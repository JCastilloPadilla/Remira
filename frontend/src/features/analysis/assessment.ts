import type { AnalysisResponse } from './demo';

export type Verdict = 'suspicious' | 'no_clear_signals' | 'inconclusive';
export interface Assessment {
  verdict: Verdict;
  reasons: { code: string; severity: 'info' | 'warning' | 'danger'; message: string }[];
  limitations: string[];
  text: { language: string; token_count: number; processed_tokens: number; truncated: boolean };
  coverage: { images_total: number; images_pending: number; ocr_low_confidence: boolean; links_complete: boolean };
  links: { url: string; host: string; decoded_url?: string; issues: string[] }[];
  authentication: { source: string; spf?: string; dkim?: string; dmarc?: string; verified: boolean };
}
export type PrimaryClassification = 'likely_legitimate' | 'possible_spam' | 'possible_phishing' | 'possible_malicious' | 'needs_review';
export interface Classification {
  primary: PrimaryClassification;
  secondary: string[];
  evidence_strength: 'weak' | 'moderate' | 'strong';
  provisional: boolean;
  model_version: string;
}
export interface Purpose {
  kind: 'invoice' | 'payment_request' | 'receipt' | 'account_notice' | 'advertisement' | 'ordinary' | 'other';
  basis: string[];
}
export const classificationTitles: Record<PrimaryClassification, string> = {
  likely_legitimate: 'Probablemente legítimo', possible_spam: 'Posible spam',
  possible_phishing: 'Posible phishing', possible_malicious: 'Posible contenido malicioso', needs_review: 'Requiere revisión',
};
export const purposeTitles: Record<Purpose['kind'], string> = {
  invoice: 'Factura o estado de cuenta', payment_request: 'Solicitud de pago o aviso de cobro',
  receipt: 'Confirmación de compra o recibo', account_notice: 'Aviso de cuenta o seguridad',
  advertisement: 'Publicidad', ordinary: 'Comunicación habitual', other: 'Otro tipo de mensaje',
};
export interface LocalAnalysisResponse {
  classification?: Classification;
  purpose?: Purpose;
  recommendation?: string;
  warnings?: string[];
  label: 'spam' | 'not_spam' | 'legitimate' | 'malicious' | 'unavailable';
  confidence: number | null;
  max_tokens: number;
  model: string | null;
  language: string;
  task: string;
  assessment: Assessment;
}
export const verdictTitles: Record<Verdict, string> = {
  suspicious: 'Señales de riesgo',
  no_clear_signals: 'Sin señales claras de phishing',
  inconclusive: 'Análisis no concluyente',
};
export function getAnalysisPresentation(result: LocalAnalysisResponse | AnalysisResponse) {
  const assessment = 'assessment' in result ? result.assessment : undefined;
  const classification = 'classification' in result ? result.classification : undefined;
  const purpose = 'purpose' in result ? result.purpose : undefined;
  const verdict = assessment?.verdict ?? 'inconclusive';
  const warnings = 'warnings' in result ? [...(result.warnings ?? [])] : [];
  if (classification?.evidence_strength === 'weak' && !warnings.some(warning => /débil|debil|weak/i.test(warning))) warnings.unshift('Estimación débil; requiere revisión.');
  if (classification?.provisional && !warnings.some(warning => /experimental|sintétic|sintetic|synthetic|provisional/i.test(warning))) warnings.unshift('Estimación experimental y provisional; requiere revisión.');
  if (assessment && ((!classification && assessment.text.truncated) || assessment.coverage.images_pending > 0 || !assessment.coverage.links_complete)
    && !warnings.some(warning => /incomplet|pendient|sin analizar|no se analizar/i.test(warning))) {
    warnings.push('Contenido incompleto: algunas partes del correo no se analizaron.');
  }
  return {
    assessment, verdict, classification, purpose,
    primaryReasons: assessment?.reasons.filter(reason => !classification || !['model_auxiliary_flag', 'no_clear_signals'].includes(reason.code)) ?? [],
    legacyReasons: classification ? assessment?.reasons.filter(reason => ['model_auxiliary_flag', 'no_clear_signals'].includes(reason.code)) ?? [] : [],
    title: classification ? classificationTitles[classification.primary] : 'Actualiza el análisis local',
    purposeTitle: purpose ? purposeTitles[purpose.kind] : undefined,
    needsReview: classification?.primary === 'needs_review',
    risk: !!classification && !['likely_legitimate', 'needs_review'].includes(classification.primary),
    recommendation: 'recommendation' in result && result.recommendation
      ? result.recommendation : 'Reinicia o actualiza la API local y vuelve a analizar el correo para obtener la clasificación del corpus.',
    warnings: [...new Set(warnings)],
    secondaryTitles: classification?.secondary.map(value => Object.hasOwn(classificationTitles, value) ? classificationTitles[value as PrimaryClassification] : value) ?? [],
  };
}
