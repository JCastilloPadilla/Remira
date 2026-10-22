import { useState } from 'react'
import { analyzeEmail, type Analysis } from './api'
import { extractOpenEmails, type EmailPreview, type Extraction } from './extract'

export function App() {
  const [emails, setEmails] = useState<EmailPreview[]>([])
  const [selected, setSelected] = useState('')
  const [preview, setPreview] = useState<EmailPreview | null>(null)
  const [result, setResult] = useState<Analysis | null>(null)
  const [busy, setBusy] = useState<'reading' | 'analyzing' | null>(null)
  const [error, setError] = useState('')
  const inExtension = typeof chrome !== 'undefined' && !!chrome.scripting

  async function read() {
    setBusy('reading'); setError(''); setResult(null); setPreview(null); setEmails([]); setSelected('')
    try {
      if (!inExtension) throw new Error('Instala la carpeta extension/dist como extensión descomprimida para leer la pestaña activa.')
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab?.id === undefined) throw new Error('No se encontró una pestaña activa.')
      const [injection] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractOpenEmails })
      const extraction: Extraction | undefined = injection?.result
      if (!extraction?.emails.length) throw new Error(extraction?.error || 'No se encontró un mensaje abierto.')
      setEmails(extraction.emails)
      if (extraction.emails.length === 1) { setSelected('0'); setPreview(extraction.emails[0]) }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : ''
      setError(/Cannot access|Missing host permission|extensions gallery|cannot be scripted/i.test(message)
        ? 'El navegador no permite leer esta pestaña. Abre Gmail web y un correo.'
        : message || 'No se pudo leer la página. Abre Gmail web y un correo.')
    } finally { setBusy(null) }
  }

  async function analyze() {
    if (!preview) return
    setBusy('analyzing'); setError(''); setResult(null)
    try { setResult(await analyzeEmail(preview)) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'No se pudo analizar el correo.') }
    finally { setBusy(null) }
  }

  function edit(field: 'subject' | 'body', value: string) {
    if (preview) setPreview({ ...preview, [field]: value })
    setResult(null); setError('')
  }

  return <main aria-busy={busy !== null}>
    <header><span className="brand">remira<span className="brand-dot">.</span></span><span className="local">EN TU EQUIPO</span></header>
    <section className="intro">
      <p className="eyebrow">UNA SEGUNDA MIRADA</p>
      <h1>Revisa antes<br />de confiar.</h1>
      <p>Lee el correo abierto en Gmail y analízalo con el modelo de tu computadora.</p>
    </section>
    {!inExtension && <p className="notice">Vista de desarrollo. La lectura de pestañas funciona al instalar la extensión.</p>}
    <button className={preview ? 'secondary' : 'primary'} disabled={!!busy} onClick={read}>
      {busy === 'reading' ? 'Leyendo…' : emails.length ? 'Volver a leer' : 'Leer correo abierto'}
    </button>
    {emails.length > 1 && <div className="field">
      <label htmlFor="message">Hay {emails.length} mensajes expandidos. Elige uno.</label>
      <select id="message" value={selected} disabled={!!busy} onChange={event => {
        const value = event.target.value
        setSelected(value); setPreview(value === '' ? null : emails[Number(value)]); setResult(null); setError('')
      }}>
        <option value="">Seleccionar mensaje</option>
        {emails.map((email, index) => <option key={index} value={index}>{index + 1}. {email.sender || email.subject || 'Sin asunto'}</option>)}
      </select>
    </div>}
    {preview && <section className="preview">
      <div className="section-label"><h2>Texto que se analizará</h2><span>{preview.body.length.toLocaleString('es-MX')} caracteres</span></div>
      {preview.sender && <p className="sender">De: {preview.sender}</p>}
      <div className="field"><label htmlFor="subject">Asunto</label>
        <input id="subject" value={preview.subject} maxLength={5000} disabled={!!busy} onChange={event => edit('subject', event.target.value)} />
      </div>
      <div className="field"><label htmlFor="body">Contenido</label>
        <textarea id="body" rows={7} value={preview.body} maxLength={100000} disabled={!!busy} onChange={event => edit('body', event.target.value)} />
      </div>
      <p className="hint">Puedes corregir el texto antes de enviarlo. Se omiten citas, borradores y contenido oculto; revisa que la extracción esté completa.</p>
      <button className="primary" disabled={!!busy || !(preview.subject.trim() || preview.body.trim())} onClick={analyze}>
        {busy === 'analyzing' ? 'Analizando en tu equipo…' : 'Analizar localmente'}
      </button>
    </section>}
    {busy === 'analyzing' && <p role="status" className="hint">La primera consulta carga el modelo y puede tardar. Mantén este panel abierto.</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {result && <section role="status" className={`result ${result.label}`}>
      <p className="eyebrow">RESULTADO DEL MODELO LOCAL</p>
      <h2>{result.label === 'malicious' ? 'Potencialmente malicioso' : 'Clasificado como legítimo'}</h2>
      <p>Puntuación del modelo: <strong>{(result.confidence * 100).toFixed(1)} %</strong></p>
      <p className="hint">Esta puntuación no es una garantía de seguridad. El modelo procesa hasta {result.max_tokens} tokens del inicio del texto; no inspecciona adjuntos ni verifica enlaces.</p>
    </section>}
    <footer>
      <p>Asunto y cuerpo → <code>127.0.0.1:8765</code></p>
      <p>Sin conexión a tu cuenta de Google. Sin historial. El contenido se descarta al cerrar este panel.</p>
      <a href="http://127.0.0.1:5174/test-email.html" target="_blank" rel="noreferrer">Abrir correos de prueba ↗</a>
    </footer>
  </main>
}
