import { afterEach, expect, it, vi } from 'vitest'
import { analyzeLocalEmail } from '../../frontend/src/features/analysis/api'

const assessment = {
  verdict: 'inconclusive',
  reasons: [{ code: 'model_spam', severity: 'info', message: 'El modelo detectó spam.' }],
  limitations: ['Spam no equivale a phishing.'],
  text: { language: 'es', token_count: 700, processed_tokens: 512, truncated: true },
  coverage: { images_total: 0, images_pending: 0, ocr_low_confidence: false, links_complete: true },
  links: [], authentication: { source: 'none', verified: false },
}
const payload = () => ({ label: 'spam', confidence: 0.91, max_tokens: 512,
  model: 'Tanaos/spam', language: 'es', task: 'spam-classification', assessment: structuredClone(assessment) })
function respond(data: unknown, status = 200) {
  vi.stubGlobal('fetch', async () => new Response(JSON.stringify(data), { status }))
}
afterEach(() => vi.unstubAllGlobals())

it('preserva spam como opinión bruta y el veredicto independiente', async () => {
  const data = payload()
  respond(data)
  await expect(analyzeLocalEmail({ subject: 'Aviso', body: 'Verifica tu cuenta' })).resolves.toEqual(data)
})
it('admite modelo inglés y límite distinto sin convertir etiquetas', async () => {
  const data = { ...payload(), label: 'legitimate', max_tokens: 256, language: 'en', model: 'Cybersectony/model' }
  respond(data)
  await expect(analyzeLocalEmail({ subject: '', body: 'hello' })).resolves.toEqual(data)
})
it('admite modelo no disponible sin fabricar puntuación', async () => {
  const data = { ...payload(), label: 'unavailable', confidence: null, model: null }
  respond(data)
  await expect(analyzeLocalEmail({ subject: '', body: 'texto' })).resolves.toEqual(data)
})
it.each([null, [], {}, { label: 'spam', confidence: 0.91, max_tokens: 512 }])('rechaza respuesta sin contrato v2: %j', async data => {
  respond(data)
  await expect(analyzeLocalEmail({ subject: '', body: 'texto' })).rejects.toThrow('respuesta válida')
})
it.each([
  { ...assessment, verdict: 'safe' },
  { ...assessment, reasons: [null] },
  { ...assessment, text: { ...assessment.text, processed_tokens: -1 } },
  { ...assessment, coverage: { ...assessment.coverage, images_pending: 2 } },
  { ...assessment, links: [{ url: 'https://x.test', host: 'x.test', issues: [null] }] },
  { ...assessment, authentication: { source: 'eml', verified: 'yes' } },
])('rechaza evidencia mal formada', async value => {
  respond({ ...payload(), assessment: value })
  await expect(analyzeLocalEmail({ subject: '', body: 'texto' })).rejects.toThrow('respuesta válida')
})
it('expone el error de la API local sin inventar un resultado', async () => {
  respond({ error: 'No se pudo ejecutar el modelo local.' }, 503)
  await expect(analyzeLocalEmail({ subject: '', body: 'texto' })).rejects.toThrow('No se pudo ejecutar el modelo local.')
})
it('trata un error HTTP sin objeto JSON como error legible', async () => {
  respond(null, 503)
  await expect(analyzeLocalEmail({ subject: '', body: 'texto' })).rejects.toThrow('No se pudo analizar')
})

it('los resultados históricos sin evidencia quedan inconcluyentes aunque digan malicious', async () => {
  const { getAnalysisPresentation } = await import('../../frontend/src/features/analysis/assessment')
  expect(getAnalysisPresentation({ label: 'malicious', confidence: 0.99 })).toMatchObject({
    verdict: 'inconclusive', title: 'Actualiza el análisis local', assessment: undefined,
  })
})
it('la opinión spam no reemplaza el veredicto de evidencia', async () => {
  const { getAnalysisPresentation } = await import('../../frontend/src/features/analysis/assessment')
  const result = await (async () => { respond(payload()); return analyzeLocalEmail({ subject: '', body: 'texto' }) })()
  expect(getAnalysisPresentation(result).title).toBe('Actualiza el análisis local')
  const clear = { ...result, assessment: { ...result.assessment, verdict: 'no_clear_signals' as const } }
  expect(getAnalysisPresentation(clear).title).toBe('Actualiza el análisis local')
})

it.each([
  { ...payload(), confidence: null },
  { ...payload(), confidence: 1.1 },
  { ...payload(), label: 'safe' },
  { ...payload(), model: null },
  { ...payload(), max_tokens: 0 },
  { ...payload(), task: undefined },
])('rechaza metadatos de modelo inválidos', async value => {
  respond(value)
  await expect(analyzeLocalEmail({ subject: '', body: 'texto' })).rejects.toThrow('respuesta válida')
})
it('envía el borrador exclusivamente a la API loopback sin credenciales ni caché', async () => {
  const fetch = vi.fn(async () => new Response(JSON.stringify(payload()), { status: 200 }))
  vi.stubGlobal('fetch', fetch)
  const controller = new AbortController()
  await analyzeLocalEmail({ subject: 'Aviso', body: 'Contenido privado' }, controller.signal)
  expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8765/api/analyze', expect.objectContaining({
    method: 'POST', credentials: 'omit', cache: 'no-store', signal: controller.signal,
    body: JSON.stringify({ subject: 'Aviso', body: 'Contenido privado' }),
  }))
})

const corpus = () => ({ ...payload(), classification: { primary: 'likely_legitimate', secondary: [], evidence_strength: 'weak', provisional: true, model_version: 'corpus-v1' }, purpose: { kind: 'invoice', basis: ['amount'] }, recommendation: 'Revisa importe y periodo desde tu portal habitual.', warnings: ['Corpus experimental.'] })
it('la categoría corpus prevalece sobre assessment y conserva finalidad separada', async () => {
  const { getAnalysisPresentation } = await import('../../frontend/src/features/analysis/assessment')
  respond(corpus())
  const data = await analyzeLocalEmail({subject: '', body: 'Factura'})
  expect(getAnalysisPresentation(data)).toMatchObject({title: 'Probablemente legítimo', purposeTitle: 'Factura o estado de cuenta', risk: false})
})
it.each([
  {classification: null}, {classification: { ...corpus().classification, primary: 'safe' }},
  {classification: { ...corpus().classification, secondary: [3] }},
  {classification: { ...corpus().classification, evidence_strength: 'certain' }},
  {classification: { ...corpus().classification, evidence_strength: ['weak'] }},
  {classification: { ...corpus().classification, provisional: 'yes' }},
  {classification: { ...corpus().classification, model_version: '' }},
  {purpose: {kind: 'safe', basis: []}}, {purpose: {kind: 'invoice', basis: [false]}},
  {recommendation: ''}, {warnings: [null]}, {purpose: undefined},
])('rechaza contrato corpus incompleto o mal formado %j', async change => {
  respond({...corpus(), ...change})
  await expect(analyzeLocalEmail({subject: '', body: 'Texto'})).rejects.toThrow('respuesta válida')
})

it('presenta señales secundarias desconocidas sin resolver propiedades heredadas', async () => {
  const { getAnalysisPresentation } = await import('../../frontend/src/features/analysis/assessment')
  respond({...corpus(), classification: {...corpus().classification, secondary: ['possible_phishing', 'constructor']}})
  const data = await analyzeLocalEmail({subject: '', body: 'Texto'})
  expect(getAnalysisPresentation(data).secondaryTitles).toEqual(['Posible phishing', 'constructor'])
})

it('no repite advertencias genéricas ya expresadas por la API', async () => {
 const {getAnalysisPresentation} = await import('../../frontend/src/features/analysis/assessment')
 const data = {...corpus(), warnings: ['Entrenamiento sintético con cobertura limitada.', 'Evidencia débil; revisa el mensaje.', 'Contenido incompleto por imágenes pendientes.']}
 respond(data)
 const result = await analyzeLocalEmail({subject: '', body: 'Texto'})
 expect(getAnalysisPresentation(result).warnings).toEqual(data.warnings)
})
