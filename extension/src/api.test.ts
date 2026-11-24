import { afterEach, expect, it, vi } from 'vitest'
import { analyzeEmail } from './api'

const assessment = { verdict: 'inconclusive', reasons: [], limitations: [], text: { language: 'es', token_count: 20, processed_tokens: 20, truncated: false }, coverage: { images_total: 0, images_pending: 0, links_complete: true, ocr_low_confidence: false }, links: [], authentication: { source: 'unavailable', verified: false } }

afterEach(() => vi.unstubAllGlobals())

it('envía solo asunto y cuerpo al servidor loopback y devuelve la clasificación', async () => {
  let captured: RequestInit | undefined
  vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
    expect(url).toBe('http://127.0.0.1:8765/api/analyze')
    captured = init
    return new Response(JSON.stringify({ label: 'spam', confidence: 0.91, max_tokens: 512, assessment, language: 'es', model: 'test', task: 'spam_detection' }), { status: 200 })
  })
  expect((await analyzeEmail({ subject: 'Asunto', body: 'Texto', sender: 'private@example.com' })).label).toBe('spam')
  expect(JSON.parse(String(captured?.body))).toEqual({ subject: 'Asunto', body: 'Texto', sender: 'private@example.com' })
  expect(captured?.credentials).toBe('omit')
})

it('admite abstención si el modelo no está disponible y rechaza respuestas sin assessment', async () => {
  vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ label: 'unavailable', confidence: null, max_tokens: 512, assessment, language: 'unknown', model: null, task: 'unavailable' })))
  expect((await analyzeEmail({ subject: '', body: 'text' })).assessment.verdict).toBe('inconclusive')
  vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ label: 'malicious', confidence: 1, max_tokens: 512 })))
  await expect(analyzeEmail({ subject: '', body: 'text' })).rejects.toThrow(/respuesta válida/)
})

it('presenta la falta de backend como error, nunca como clasificación', async () => {
  vi.stubGlobal('fetch', async () => { throw new TypeError('Failed to fetch') })
  await expect(analyzeEmail({ subject: '', body: 'text' })).rejects.toThrow(/servidor local/)
})

it('rechaza respuestas corruptas o puntuaciones fuera de rango', async () => {
  vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ label: 'legitimate', confidence: 5 }), { status: 200 }))
  await expect(analyzeEmail({ subject: '', body: 'text' })).rejects.toThrow(/respuesta válida/)
})

it('propaga el error legible del modelo sin inventar resultado', async () => {
  vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ error: 'Modelo no disponible' }), { status: 503 }))
  await expect(analyzeEmail({ subject: '', body: 'text' })).rejects.toThrow('Modelo no disponible')
})
