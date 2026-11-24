import { useState } from 'react'
import type { Coverage, EmailPreview, MessageImage } from './extract'
import { captureMessageImage, recognizeLocalImage, ocrCoverage, type ImageStatus } from './ocr'

export function ImageReview({ email, tab, disabled, onChange, onBusy }: {
  email: EmailPreview; tab: { id: number; url: string } | null; disabled: boolean
  onChange: (text: string, coverage: Coverage) => void; onBusy: (busy: boolean) => void
}) {
  const total = email.coverage?.images_total || email.images?.length || 0
  const images: MessageImage[] = email.images?.length ? email.images : Array.from({ length: Math.min(total, 30) }, (_, index) => ({
    id: `import-${index}`, alt: `Imagen importada ${index + 1}`, rect: { x: 0, y: 0, width: 0, height: 0 }, viewport: { width: 0, height: 0 }, visible: false,
  }))
  const [statuses, setStatuses] = useState<ImageStatus[]>(images.map(() => 'pending'))
  const [texts, setTexts] = useState(images.map(() => ''))
  const [seen, setSeen] = useState(images.map(() => false))
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  function publish(nextStatuses: ImageStatus[], nextTexts = texts) {
    setStatuses(nextStatuses); setTexts(nextTexts)
    const coverage = ocrCoverage(nextStatuses)
    coverage.images_total = total
    coverage.images_pending += Math.max(0, total - nextStatuses.length)
    coverage.links_complete = email.coverage?.links_complete !== false
    onChange(nextTexts.filter(Boolean).join('\n\n'), coverage)
  }
  async function recognize(index: number, file?: File) {
    onBusy(true); setError(''); setProgress('Preparando OCR local…')
    try {
      if (file && (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 10_000_000)) throw new Error('Usa una imagen PNG, JPEG o WebP de hasta 10 MB.')
      if (!file && !tab) throw new Error('Esta imagen importada necesita un archivo original para OCR.')
      const source = file || await captureMessageImage(email, images[index], tab!.id, tab!.url)
      if (file) {
        const bitmap = await createImageBitmap(file)
        const oversized = bitmap.width * bitmap.height > 12_000_000
        bitmap.close()
        if (oversized) throw new Error('La imagen supera 12 millones de píxeles. Recórtala antes de cargarla.')
      }
      const result = await recognizeLocalImage(source, setProgress)
      setSeen(current => current.map((value, item) => item === index ? true : value))
      const nextTexts = [...texts]; nextTexts[index] = result.text
      const nextStatuses = [...statuses]; nextStatuses[index] = result.text && result.confidence >= 70 ? 'pending' : 'low_confidence'
      publish(nextStatuses, nextTexts)
      setProgress(`OCR terminado. Calidad estimada por OCR: ${Math.round(result.confidence)} / 100. Revisa y corrige el texto antes de analizar.`)
    } catch (cause) {
      const next = [...statuses]; next[index] = 'failed'; const nextTexts = [...texts]; nextTexts[index] = ''; publish(next, nextTexts)
      setError(cause instanceof Error ? cause.message : 'No se pudo reconocer la imagen.')
      setProgress('')
    } finally { onBusy(false) }
  }
  if (!total) return null
  return <section className="image-review"><h3>Texto en imágenes ({total})</h3>
    <p className="hint">El OCR procesa solo la imagen visible que elijas. No descarga imágenes del correo ni envía capturas al servidor. Si no cabe en pantalla, carga el archivo original. Una imagen pendiente mantiene el análisis incompleto.</p>
    {images.map((image, index) => <div className="image-item" key={image.id}>
      <p><strong>{index + 1}. {image.alt}</strong> <span className="hint">{statuses[index] === 'recognized' ? 'Texto reconocido' : statuses[index] === 'ignored' ? 'Marcada decorativa por ti' : 'Pendiente de revisión'}</span></p>
      <div className="image-actions">
        <button type="button" className="secondary" disabled={disabled || !image.visible || !tab} onClick={() => recognize(index)}>Leer imagen visible {index + 1}</button>
        <label className="file-label">Cargar imagen {index + 1}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={disabled} onChange={event => { const file = event.target.files?.[0]; if (file) void recognize(index, file); event.target.value = '' }} /></label>
        <button type="button" className="quiet" disabled={disabled} onClick={() => { const next = [...statuses]; next[index] = statuses[index] === 'ignored' ? 'pending' : 'ignored'; const nextTexts = [...texts]; nextTexts[index] = ''; publish(next, nextTexts) }}>{statuses[index] === 'ignored' ? 'Volver a revisar imagen' : 'Es decorativa, omitir'}</button>
      </div>
      {seen[index] && <><label htmlFor={`ocr-${index}`}>Texto reconocido {index + 1}</label><textarea id={`ocr-${index}`} rows={4} maxLength={100000} disabled={disabled} value={texts[index]} onChange={event => { const next = [...texts]; next[index] = event.target.value; const nextStatuses = [...statuses]; nextStatuses[index] = 'pending'; publish(nextStatuses, next) }} />
        <button type="button" className="quiet" disabled={disabled || !texts[index].trim()} onClick={() => { const next = [...statuses]; next[index] = 'recognized'; publish(next) }}>Confirmar texto revisado {index + 1}</button></>}
    </div>)}
    {total > images.length && <p className="notice">Se muestran las primeras {images.length} imágenes. Las restantes siguen pendientes.</p>}
    {progress && <p className="hint" role="status">{progress}</p>}{error && <p className="error" role="alert">{error}</p>}
  </section>
}
