import type { EmailPreview } from './extract'
import type { Analysis } from './analysis-types'
import { validResponse } from '../../frontend/src/features/analysis/api'
export type { Analysis } from './analysis-types'

async function requestLocal(path: string, body: BodyInit, json = false): Promise<Analysis & { email?: EmailPreview }> {
  let response: Response
  try {
    response = await fetch(`http://127.0.0.1:8765${path}`, {
      method: 'POST', headers: json ? { 'Content-Type': 'application/json' } : undefined,
      credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(120_000), body,
    })
  } catch {
    throw new Error('No se pudo contactar al servidor local o se agotó la espera. Ejecuta python -m src.api y vuelve a intentar.')
  }
  let data: unknown
  try { data = await response.json() } catch { throw new Error('El servidor no devolvió una respuesta válida.') }
  if (!response.ok) throw new Error(data && typeof data === 'object' && 'error' in data && typeof data.error === 'string' ? data.error : 'No se pudo analizar el correo.')
  if (!validResponse(data)) throw new Error('El servidor no devolvió una respuesta válida. Reinicia la API para usar el análisis actualizado.')
  return data
}

export async function analyzeEmail(email: EmailPreview): Promise<Analysis> {
  return requestLocal('/api/analyze', JSON.stringify({ subject: email.subject, body: email.body, sender: email.sender,
    links: email.links, coverage: email.coverage, authentication: email.authentication }), true)
}

export async function importEmail(file: File): Promise<Analysis & { email: EmailPreview }> {
  if (!file.name.toLowerCase().endsWith('.eml') || file.size > 8_000_000) throw new Error('Elige un archivo .eml de hasta 8 MB.')
  const form = new FormData(); form.append('file', file)
  const response = await requestLocal('/api/analyze-eml', form)
  if (!response.email || typeof response.email.subject !== 'string' || typeof response.email.body !== 'string') throw new Error('No se pudo extraer el archivo .eml.')
  return response as Analysis & { email: EmailPreview }
}
