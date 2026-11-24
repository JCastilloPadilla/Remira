import { useState } from 'react'
import { analyzeEmail, importEmail, type Analysis } from './api'
import { extractOpenEmails, type Coverage, type EmailPreview, type Extraction } from './extract'
import { AnalysisResult } from './AnalysisResult'
import { ImageReview } from './ImageReview'

export function App() {
  const [emails, setEmails] = useState<EmailPreview[]>([])
  const [selected, setSelected] = useState('')
  const [preview, setPreview] = useState<EmailPreview | null>(null)
  const [result, setResult] = useState<Analysis | null>(null)
  const [busy, setBusy] = useState<'reading' | 'analyzing' | 'ocr' | 'importing' | null>(null)
  const [error, setError] = useState('')
  const [ocrText, setOcrText] = useState('')
  const [captureTab, setCaptureTab] = useState<{ id: number; url: string } | null>(null)
  const [revision, setRevision] = useState(0)
  const inExtension = typeof chrome !== 'undefined' && !!chrome.scripting

  function reset() {
    setError(''); setResult(null); setPreview(null); setEmails([]); setSelected(''); setOcrText(''); setCaptureTab(null); setRevision(value => value + 1)
  }
  function choose(value: string, source = emails) {
    setSelected(value); setPreview(value === '' ? null : source[Number(value)]); setResult(null); setError(''); setOcrText(''); setRevision(current => current + 1)
  }
  async function read() {
    setBusy('reading'); reset()
    try {
      if (!inExtension) throw new Error('Instala la carpeta extension/dist como extensión descomprimida para leer la pestaña activa.')
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.id === undefined) throw new Error('No se encontró una pestaña activa.')
      const [injection] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractOpenEmails })
      const extraction: Extraction | undefined = injection?.result
      if (!extraction?.emails.length) throw new Error(extraction?.error || 'No se encontró un mensaje abierto.')
      setCaptureTab({ id: tab.id, url: tab.url || '' })
      setEmails(extraction.emails)
      if (extraction.emails.length === 1) choose('0', extraction.emails)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : ''
      setError(/Cannot access|Missing host permission|extensions gallery|cannot be scripted/i.test(message)
        ? 'El navegador no permite leer esta pestaña. Abre Gmail web y un correo.'
        : message || 'No se pudo leer la página. Abre Gmail web y un correo.')
    } finally { setBusy(null) }
  }
  async function loadEml(file: File) {
    setBusy('importing'); reset()
    try {
      const imported = await importEmail(file)
      setEmails([imported.email]); setPreview(imported.email); setSelected('0'); setResult(imported)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo importar el correo.') }
    finally { setBusy(null) }
  }
  async function analyze() {
    if (!preview) return
    setBusy('analyzing'); setError(''); setResult(null)
    try {
      const body = [preview.body, ocrText && `[Texto reconocido en imágenes y revisado]\n${ocrText}`].filter(Boolean).join('\n\n')
      if (body.length > 100000) throw new Error('El texto combinado supera 100,000 caracteres. Reduce el contenido antes de analizar.')
      setResult(await analyzeEmail({ ...preview, body }))
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo analizar el correo.') }
    finally { setBusy(null) }
  }
  function edit(field: 'subject' | 'body', value: string) {
    if (preview) setPreview({ ...preview, [field]: value })
    setResult(null); setError('')
  }
  function updateOcr(text: string, coverage: Coverage) {
    setOcrText(text); setResult(null); setError('')
    setPreview(current => current ? { ...current, coverage } : null)
  }

  return <main aria-busy={busy !== null}>
    <header>
      <h1 className="brand">remira<span className="brand-dot">.</span></h1>
      {emails.length > 0
        ? <button className="quiet reread" disabled={!!busy} onClick={read}>Volver a leer</button>
        : <span className="local">Análisis local</span>}
    </header>
    {!inExtension && <p className="notice">Instala la extensión para leer Gmail desde Edge o Chrome.</p>}
    {emails.length === 0 && <button className="primary read" disabled={!!busy} onClick={read}>
      {busy === 'reading' ? 'Leyendo…' : 'Leer correo abierto'}
    </button>}
    {emails.length > 1 && <div className="field">
      <label htmlFor="message">Hay {emails.length} mensajes expandidos. Elige uno.</label>
      <select id="message" value={selected} disabled={!!busy} onChange={event => choose(event.target.value)}>
        <option value="">Seleccionar mensaje</option>{emails.map((email, index) => <option key={index} value={index}>{index + 1}. {email.sender || email.subject || 'Sin asunto'}</option>)}
      </select>
    </div>}
    {preview && <section className="preview">
      <h2 className="message-subject">{preview.subject || 'Correo sin asunto'}</h2>
      {preview.sender && <p className="sender">{preview.sender}</p>}
      {!!preview.coverage?.images_pending && <p className="hint pending" role="status">
        {preview.coverage.images_pending === 1 ? '1 imagen pendiente de revisar' : `${preview.coverage.images_pending} imágenes pendientes de revisar`}
      </p>}
      <button className="primary" disabled={!!busy || !(preview.subject.trim() || preview.body.trim() || ocrText.trim() || preview.coverage?.images_total)} onClick={analyze}>
        {busy === 'analyzing' ? 'Analizando…' : result ? 'Volver a analizar' : 'Analizar localmente'}
      </button>
    </section>}
    {busy === 'analyzing' && <p role="status" className="hint">La primera consulta carga el modelo del idioma detectado. Mantén este panel abierto.</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {result && <AnalysisResult result={result} />}
    {preview && <div className="options" key={`${selected}-${revision}`}>
      <details>
        <summary>Ver o editar correo</summary>
        <div className="field"><label htmlFor="subject">Asunto</label><input id="subject" value={preview.subject} maxLength={5000} disabled={!!busy} onChange={event => edit('subject', event.target.value)} /></div>
        <div className="field"><label htmlFor="body">Contenido de texto</label><textarea id="body" rows={4} value={preview.body} maxLength={100000} disabled={!!busy} onChange={event => edit('body', event.target.value)} /></div>
        {!!preview.links?.length && <details><summary>Enlaces extraídos ({preview.links.length})</summary><ul className="link-reports">{preview.links.map((link, index) => <li key={index}><span>{link.text || 'Sin texto visible'}</span><code>{link.url}</code></li>)}</ul></details>}
      </details>
      {!!preview.images?.length && <details>
        <summary>Revisar imágenes ({preview.images.length})</summary>
        <ImageReview email={preview} tab={captureTab} disabled={!!busy} onChange={updateOcr} onBusy={value => setBusy(value ? 'ocr' : null)} />
      </details>}
    </div>}
    <footer>
      <details>
        <summary>Importar archivo .eml</summary>
        <label className="file-label" htmlFor="eml-file">{busy === 'importing' ? 'Importando correo…' : 'Correo original (.eml)'}</label>
        <input id="eml-file" className="file-input" type="file" accept=".eml,message/rfc822" disabled={!!busy} onChange={event => { const file = event.target.files?.[0]; if (file) void loadEml(file); event.target.value = '' }} />
      </details>
      <a href="http://127.0.0.1:5174/test-email.html" target="_blank" rel="noreferrer">Correos de prueba ↗</a>
    </footer>
  </main>
}
