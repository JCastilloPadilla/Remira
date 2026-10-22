import type { EmailPreview } from './extract'

export interface Analysis {
  label: 'legitimate' | 'malicious'
  confidence: number
  max_tokens: number
}

export async function analyzeEmail(email: EmailPreview): Promise<Analysis> {
  let response: Response
  try {
    response = await fetch('http://127.0.0.1:8765/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      cache: 'no-store',
      signal: AbortSignal.timeout(120_000),
      body: JSON.stringify({ subject: email.subject, body: email.body }),
    })
  } catch {
    throw new Error('No se pudo contactar al servidor local o se agotó la espera. Ejecuta python -m src.api y vuelve a intentar.')
  }
  let data: Record<string, unknown>
  try {
    data = await response.json()
  } catch {
    throw new Error('El servidor no devolvió una respuesta válida.')
  }
  if (!data || typeof data !== 'object') throw new Error('El servidor no devolvió una respuesta válida.')
  if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : 'No se pudo analizar el correo.')
  if ((data.label !== 'legitimate' && data.label !== 'malicious') || typeof data.confidence !== 'number'
    || !Number.isFinite(data.confidence) || data.confidence < 0 || data.confidence > 1 || data.max_tokens !== 512) {
    throw new Error('El servidor no devolvió una respuesta válida.')
  }
  return data as unknown as Analysis
}
