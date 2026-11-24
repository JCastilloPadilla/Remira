import { verdictTitles, getAnalysisPresentation, type Analysis } from './analysis-types'

export function AnalysisResult({ result }: { result: Analysis }) {
  const { assessment } = result
  const { title, classification, purposeTitle, recommendation, warnings, secondaryTitles, risk, needsReview, primaryReasons, legacyReasons } = getAnalysisPresentation(result)
  return <section role="status" className={`result ${risk ? 'suspicious' : !classification || needsReview ? 'inconclusive' : 'no_clear_signals'}`}>
    <h2>{title}</h2>
    <p>{recommendation}</p>
    <details className="result-details">
    <summary>Detalles del resultado</summary>
      {purposeTitle && <p><strong>Tipo: {purposeTitle}</strong></p>}
      {!!secondaryTitles.length && <p>{needsReview ? "Hipótesis del modelo" : "Clasificaciones adicionales"}: {secondaryTitles.join(' · ')}</p>}
      {classification && <p className="hint">Evidencia {({weak: 'débil', moderate: 'moderada', strong: 'fuerte'})[classification.evidence_strength]}. Es una estimación del contenido; no verifica la identidad del remitente.</p>}
      {!!warnings.length && <aside aria-label="Advertencias de la estimación"><ul className="hint">{warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></aside>}
      <ul className="evidence">{primaryReasons.map(reason => <li key={reason.code} className={`evidence-${reason.severity}`}>{reason.message}</li>)}</ul>
      <p className="hint">Idioma detectado: {result.language}. Texto procesado por el modelo auxiliar: {assessment.text.processed_tokens} de {assessment.text.token_count} tokens.
        {assessment.text.truncated ? ' Se omitió el final del texto en el modelo auxiliar.' : ''}{classification ? ' El alcance del clasificador del corpus se indica en sus avisos.' : ''}</p>
      <p className="hint">Imágenes pendientes: {assessment.coverage.images_pending} de {assessment.coverage.images_total}. Autenticación: {assessment.authentication.verified ? 'verificada' : 'no verificada'}.</p>
      {!!assessment.limitations.length && <details><summary>Límites de esta revisión</summary><ul className="hint">{assessment.limitations.map((limitation, index) => <li key={index}>{limitation}</li>)}</ul></details>}
      {!!assessment.links.length && <details><summary>Destinos de enlaces ({assessment.links.length})</summary><ul className="link-reports">{assessment.links.map((link, index) => <li key={index}><strong>{link.host || 'Destino no compatible'}</strong><code>{link.url}</code>{link.decoded_url && <><span>Destino incluido en parámetros, sin visitarlo:</span><code>{link.decoded_url}</code></>}{!!link.issues.length && <span>{link.issues.join(', ')}</span>}</li>)}</ul></details>}
      <details><summary>Diagnóstico técnico y modelo anterior</summary>{!!legacyReasons.length && <ul className="hint">{legacyReasons.map((reason, index) => <li key={index}>{reason.message}</li>)}</ul>}<p className="hint">Diagnóstico anterior: {verdictTitles[assessment.verdict]}. Modelo del corpus: {classification?.model_version ?? 'no disponible'}.</p><p className="hint">{result.model || 'Modelo no disponible'} · {result.task}<br />Etiqueta: {result.label}. Puntuación interna: {result.confidence === null ? 'no disponible' : result.confidence.toFixed(6)}. No es una probabilidad calibrada de seguridad.</p></details>
      {assessment.authentication.source !== 'unavailable' && <p className="hint">Cabeceras declaradas: SPF {assessment.authentication.spf || 'sin dato'}, DKIM {assessment.authentication.dkim || 'sin dato'}, DMARC {assessment.authentication.dmarc || 'sin dato'}. No se verificaron firmas ni procedencia de esas cabeceras.</p>}
      <p className="hint">Esta estimación no garantiza seguridad. No se abrieron enlaces ni se inspeccionaron archivos adjuntos.</p>
    </details>
  </section>
}
