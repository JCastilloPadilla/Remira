import { createWorker, OEM } from 'tesseract.js'
import { extractOpenEmails, type Coverage, type EmailPreview, type MessageImage, type Rect } from './extract'

export type ImageStatus = 'pending' | 'recognized' | 'ignored' | 'low_confidence' | 'failed'
export interface OcrResult { text: string; confidence: number }

export function ocrCoverage(statuses: ImageStatus[]): Coverage {
  return { images_total: statuses.length, images_pending: statuses.filter(status => status !== 'recognized' && status !== 'ignored').length,
    ocr_low_confidence: statuses.includes('low_confidence'), links_complete: true }
}

export function cropRectangle(rect: Rect, viewport: { width: number; height: number }, bitmap: { width: number; height: number }): Rect {
  if (![rect.x, rect.y, rect.width, rect.height, viewport.width, viewport.height, bitmap.width, bitmap.height].every(Number.isFinite)
    || rect.x < 0 || rect.y < 0 || rect.width <= 0 || rect.height <= 0 || viewport.width <= 0 || viewport.height <= 0
    || bitmap.width <= 0 || bitmap.height <= 0 || rect.x + rect.width > viewport.width + 0.5 || rect.y + rect.height > viewport.height + 0.5) {
    throw new Error('La imagen debe estar completamente visible. Desplázate hasta ella y vuelve a leer el mensaje.')
  }
  const x = Math.round(rect.x * bitmap.width / viewport.width)
  const y = Math.round(rect.y * bitmap.height / viewport.height)
  const width = Math.min(bitmap.width - x, Math.round(rect.width * bitmap.width / viewport.width))
  const height = Math.min(bitmap.height - y, Math.round(rect.height * bitmap.height / viewport.height))
  if (width < 1 || height < 1 || width * height > 12_000_000) throw new Error('La imagen es demasiado grande o pequeña para OCR local.')
  return { x, y, width, height }
}

export async function recognizeLocalImage(image: Blob | HTMLCanvasElement, progress?: (message: string) => void): Promise<OcrResult> {
  const asset = (path: string) => typeof chrome !== 'undefined' && chrome.runtime?.getURL ? chrome.runtime.getURL(`ocr/${path}`) : `/ocr/${path}`
  const worker = await createWorker(['spa', 'eng'], OEM.LSTM_ONLY, {
    workerPath: asset('worker.min.js'), corePath: asset('core/'), langPath: asset('lang'),
    workerBlobURL: false, cacheMethod: 'none', gzip: true,
    errorHandler: () => { /* El trabajo rechazado se informa en la interfaz, sin lanzar otro error global. */ },
    logger: event => { if (event.status === 'recognizing text') progress?.(`Reconociendo texto: ${Math.round(event.progress * 100)} %`) },
  })
  try {
    const { data } = await worker.recognize(image)
    return { text: data.text.trim(), confidence: data.confidence }
  } finally { await worker.terminate() }
}

export async function captureMessageImage(email: EmailPreview, image: MessageImage, tabId: number, tabUrl: string): Promise<HTMLCanvasElement> {
  const [active] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (active?.id !== tabId || (tabUrl && active.url !== tabUrl)) throw new Error('La pestaña cambió. Vuelve a leer el correo antes de capturar.')
  const [injection] = await chrome.scripting.executeScript({ target: { tabId }, func: extractOpenEmails })
  const current = injection.result?.emails.find(candidate => candidate.messageKey === email.messageKey)
  const currentImage = current?.images?.find(candidate => candidate.id === image.id)
  if (!currentImage?.visible || JSON.stringify(currentImage.rect) !== JSON.stringify(image.rect)
    || JSON.stringify(currentImage.viewport) !== JSON.stringify(image.viewport)) throw new Error('El mensaje o la imagen cambió de posición. Vuelve a leer el correo.')
  // La captura se mantiene en memoria y se recorta inmediatamente; no se envía al backend.
  const screenshot = await chrome.tabs.captureVisibleTab(active.windowId!, { format: 'png' })
  const [afterCapture] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (afterCapture?.id !== tabId || (tabUrl && afterCapture.url !== tabUrl)) throw new Error('La pestaña cambió durante la captura. Vuelve a leer el correo.')
  const [afterInjection] = await chrome.scripting.executeScript({ target: { tabId }, func: extractOpenEmails })
  const afterImage = afterInjection.result?.emails.find(candidate => candidate.messageKey === email.messageKey)?.images?.find(candidate => candidate.id === image.id)
  if (!afterImage?.visible || JSON.stringify(afterImage.rect) !== JSON.stringify(image.rect)
    || JSON.stringify(afterImage.viewport) !== JSON.stringify(image.viewport)) throw new Error('El mensaje o la ventana cambió durante la captura. Vuelve a leer el correo.')
  const bitmap = await createImageBitmap(await (await fetch(screenshot)).blob())
  try {
    const rect = cropRectangle(image.rect, image.viewport, bitmap)
    const canvas = document.createElement('canvas')
    canvas.width = rect.width; canvas.height = rect.height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('No se pudo preparar la imagen para OCR.')
    context.drawImage(bitmap, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height)
    return canvas
  } finally { bitmap.close() }
}
