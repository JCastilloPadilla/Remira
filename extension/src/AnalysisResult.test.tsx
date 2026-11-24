import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { AnalysisResult } from './AnalysisResult'
import type { Analysis } from './analysis-types'
const base: Analysis = {label: 'spam', confidence: .99, max_tokens: 512, model: 'legacy', language: 'es', task: 'spam', assessment: { verdict: 'inconclusive', reasons: [], limitations: ['Contenido incompleto'], text: {language: 'es', token_count: 20, processed_tokens: 20, truncated: false}, coverage: {images_total: 1, images_pending: 1, ocr_low_confidence: false, links_complete: false}, links: [], authentication: {source: 'none', verified: false}}}
it.each([['likely_legitimate','Probablemente legítimo'], ['possible_spam','Posible spam'], ['possible_phishing','Posible phishing'], ['possible_malicious','Posible contenido malicioso'], ['needs_review','Requiere revisión']] as const)('muestra %s sin sustituirla por diagnóstico antiguo', (primary, title) => {
 const html = renderToStaticMarkup(<AnalysisResult result={{...base, classification: {primary, secondary: [], evidence_strength: 'weak', provisional: true, model_version: 'corpus-v1'}, purpose: {kind: 'invoice', basis: ['amount']}, recommendation: 'Verifica el importe por tu portal habitual.', warnings: ['Soporte experimental limitado.']}} />)
 expect(html).toContain(`<h2>${title}</h2>`)
 expect(html).toContain('Factura o estado de cuenta')
 expect(html).toContain('Verifica el importe por tu portal habitual.')
 expect(html).toContain('Estimación débil; requiere revisión')
 expect(html).toContain('Soporte experimental limitado.')
 expect(html).not.toContain('<h2>Análisis no concluyente</h2>')
})
it('un backend antiguo pide actualizar sin convertir spam en phishing', () => {
 const html = renderToStaticMarkup(<AnalysisResult result={base} />)
 expect(html).toContain('<h2>Actualiza el análisis local</h2>')
 expect(html).not.toContain('Posible phishing')
})

it('mantiene acusaciones del modelo antiguo dentro del diagnóstico y aclara su recorte', () => {
 const html = renderToStaticMarkup(<AnalysisResult result={{...base, classification: {primary: 'likely_legitimate', secondary: [], evidence_strength: 'moderate', provisional: false, model_version: 'corpus-v1'}, assessment: {...base.assessment, reasons: [{code: 'model_auxiliary_flag', severity: 'warning', message: 'Modelo anterior detectó spam'}, {code: 'no_clear_signals', severity: 'info', message: 'Sin señales del diagnóstico antiguo'}, {code: 'invoice_structure', severity: 'info', message: 'Estructura de factura'}], text: {...base.assessment.text, truncated: true}}}} />)
 const doc = new DOMParser().parseFromString(html, 'text/html')
 expect(doc.querySelector('.evidence')?.textContent).toBe('Estructura de factura')
 const diagnostic = [...doc.querySelectorAll('details')].find(el => el.firstElementChild?.textContent?.includes('Diagnóstico técnico'))!
 expect(diagnostic.textContent).toContain('Modelo anterior detectó spam')
 expect(diagnostic.textContent).toContain('Sin señales del diagnóstico antiguo')
 expect(diagnostic.hasAttribute('open')).toBe(false)
 expect(doc.body.textContent).toContain('Texto procesado por el modelo auxiliar')
 expect(doc.body.textContent).toContain('El alcance del clasificador del corpus se indica en sus avisos')
 expect(doc.body.textContent).not.toContain('El corpus analizó todo el texto disponible')
})
