import { afterEach, expect, it, vi } from 'vitest'
import { analyzeEmail } from './api'

afterEach(() => vi.unstubAllGlobals())

it('envía solo asunto y cuerpo al servidor loopback y devuelve la clasificación', async () => {
  let captured: RequestInit | undefined
  vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
    expect(url).toBe('http://127.0.0.1:8765/api/analyze')
    captured = init
    return new Response(JSON.stringify({ label: 'malicious', confidence: 0.91, max_tokens: 512 }), { status: 200 })
  })
  expect((await analyzeEmail({ subject: 'Asunto', body: 'Texto', sender: 'private@example.com' })).label).toBe('malicious')
  expect(JSON.parse(String(captured?.body))).toEqual({ subject: 'Asunto', body: 'Texto' })
  expect(captured?.credentials).toBe('omit')
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
