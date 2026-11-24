import type { EmailDraft } from './demo';
import { classificationTitles, purposeTitles, type Assessment, type LocalAnalysisResponse } from './assessment';

const LOCAL_API_URL = 'http://127.0.0.1:8765/api/analyze';
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}
function count(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
function validAssessment(value: unknown): value is Assessment {
  if (!object(value) || !['suspicious', 'no_clear_signals', 'inconclusive'].includes(String(value.verdict))) return false;
  if (!Array.isArray(value.reasons) || !value.reasons.every(reason => object(reason)
    && typeof reason.code === 'string' && typeof reason.message === 'string'
    && ['info', 'warning', 'danger'].includes(String(reason.severity))) || !strings(value.limitations)) return false;
  const { text, coverage, authentication, links } = value;
  return object(text) && typeof text.language === 'string' && count(text.token_count)
    && count(text.processed_tokens) && text.processed_tokens <= text.token_count && typeof text.truncated === 'boolean'
    && object(coverage) && count(coverage.images_total) && count(coverage.images_pending)
    && coverage.images_pending <= coverage.images_total && typeof coverage.ocr_low_confidence === 'boolean'
    && typeof coverage.links_complete === 'boolean'
    && Array.isArray(links) && links.every(link => object(link) && typeof link.url === 'string'
      && typeof link.host === 'string' && (link.decoded_url === undefined || typeof link.decoded_url === 'string') && strings(link.issues))
    && object(authentication) && typeof authentication.source === 'string' && typeof authentication.verified === 'boolean'
    && ['spf', 'dkim', 'dmarc'].every(key => authentication[key] === undefined || typeof authentication[key] === 'string');
}
function validCorpus(value: Record<string, unknown>): boolean {
  const fields = ['classification', 'purpose', 'recommendation', 'warnings'];
  if (!fields.some(key => key in value)) return true; // Historical API response: UI requests an update.
  const { classification, purpose, recommendation, warnings } = value;
  return object(classification) && typeof classification.primary === 'string'
    && Object.hasOwn(classificationTitles, classification.primary) && strings(classification.secondary)
    && typeof classification.evidence_strength === 'string'
    && ['weak', 'moderate', 'strong'].includes(classification.evidence_strength)
    && typeof classification.provisional === 'boolean'
    && typeof classification.model_version === 'string' && classification.model_version.trim().length > 0
    && object(purpose) && typeof purpose.kind === 'string' && Object.hasOwn(purposeTitles, purpose.kind)
    && strings(purpose.basis) && typeof recommendation === 'string' && recommendation.trim().length > 0 && strings(warnings);
}
export function validResponse(value: unknown): value is LocalAnalysisResponse {
  if (!object(value) || !['spam', 'not_spam', 'legitimate', 'malicious', 'unavailable'].includes(String(value.label))) return false;
  const scoreValid = value.label === 'unavailable' ? value.confidence === null
    : typeof value.confidence === 'number' && Number.isFinite(value.confidence) && value.confidence >= 0 && value.confidence <= 1;
  return scoreValid && count(value.max_tokens) && value.max_tokens > 0
    && (typeof value.model === 'string' || (value.label === 'unavailable' && value.model === null))
    && validCorpus(value) && typeof value.language === 'string' && typeof value.task === 'string' && validAssessment(value.assessment);
}
export async function analyzeLocalEmail(draft: EmailDraft, signal?: AbortSignal): Promise<LocalAnalysisResponse> {
  let response: Response;
  try {
    response = await fetch(LOCAL_API_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'omit', cache: 'no-store', signal,
      body: JSON.stringify({ subject: draft.subject, body: draft.body }),
    });
  } catch {
    throw new Error('No se pudo contactar al servidor local. Inicia la API con python -m src.api e inténtalo de nuevo.');
  }
  let data: unknown;
  try { data = await response.json(); }
  catch { throw new Error('El servidor local no devolvió una respuesta válida.'); }
  if (!response.ok) {
    throw new Error(object(data) && typeof data.error === 'string' ? data.error : 'No se pudo analizar el correo con el modelo local.');
  }
  if (!validResponse(data)) throw new Error('El servidor local no devolvió una respuesta válida.');
  return data;
}
