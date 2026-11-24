import { afterEach, describe, expect, it, vi } from 'vitest'
import { captureMessageImage, cropRectangle, ocrCoverage } from './ocr'

afterEach(() => vi.unstubAllGlobals())

describe('límites de la captura OCR', () => {
  it('convierte solo la región de la imagen a píxeles de captura', () => {
    expect(cropRectangle({ x: 10, y: 20, width: 100, height: 50 }, { width: 400, height: 300 }, { width: 800, height: 600 }))
      .toEqual({ x: 20, y: 40, width: 200, height: 100 })
  })
  it('rechaza imágenes parcialmente fuera de pantalla o coordenadas inválidas', () => {
    expect(() => cropRectangle({ x: -10, y: 0, width: 100, height: 50 }, { width: 400, height: 300 }, { width: 800, height: 600 })).toThrow(/visible/)
    expect(() => cropRectangle({ x: 10, y: 20, width: NaN, height: 50 }, { width: 400, height: 300 }, { width: 800, height: 600 })).toThrow()
  })
  it('OCR fallido o de baja confianza nunca cuenta como imagen revisada', () => {
    expect(ocrCoverage(['pending', 'recognized', 'ignored', 'low_confidence', 'failed'])).toEqual({ images_total: 5, images_pending: 3, ocr_low_confidence: true, links_complete: true })
  })
  it('descarta la captura si el usuario cambió de pestaña durante la operación', async () => {
    const image = { id: 'one', alt: '', rect: { x: 10, y: 10, width: 100, height: 40 }, viewport: { width: 400, height: 300 }, visible: true }
    const email = { subject: '', body: 'Texto', messageKey: 'key', images: [image] }
    let captured = false
    vi.stubGlobal('chrome', {
      tabs: { query: async () => [{ id: captured ? 2 : 1, url: 'https://mail.google.com', windowId: 1 }], captureVisibleTab: async () => { captured = true; return 'data:image/png;base64,AA==' } },
      scripting: { executeScript: async () => [{ result: { emails: [email] } }] },
    })
    await expect(captureMessageImage(email, image, 1, 'https://mail.google.com')).rejects.toThrow(/pestaña cambió/)
  })
  it('descarta la captura si cambió el viewport aunque el rectángulo se mantenga', async () => {
    const image = { id: 'one', alt: '', rect: { x: 10, y: 10, width: 100, height: 40 }, viewport: { width: 400, height: 300 }, visible: true }
    const email = { subject: '', body: 'Texto', messageKey: 'key', images: [image] }
    let captured = false
    vi.stubGlobal('chrome', {
      tabs: { query: async () => [{ id: 1, url: 'https://mail.google.com', windowId: 1 }], captureVisibleTab: async () => { captured = true; return 'data:image/png;base64,AA==' } },
      scripting: { executeScript: async () => [{ result: { emails: [{ ...email, images: [{ ...image, viewport: { width: captured ? 800 : 400, height: 300 } }] }] } }] },
    })
    await expect(captureMessageImage(email, image, 1, 'https://mail.google.com')).rejects.toThrow(/cambió/)
  })
})
