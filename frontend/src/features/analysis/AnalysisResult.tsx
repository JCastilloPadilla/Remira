import {
  CircleAlert,
  LoaderCircle,
  ScanLine,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FadeContent from "@/components/react-bits/FadeContent";
import type { AnalysisState, AnalysisResponse } from "./demo";
import { getAnalysisPresentation, verdictTitles, type LocalAnalysisResponse } from "./assessment";

export function AnalysisResult({
  state,
  onRetry,
  onReset,
}: {
  state: AnalysisState<AnalysisResponse | LocalAnalysisResponse>;
  onRetry: () => void;
  onReset: () => void;
}) {
  if (state.status === "success") {
    const result = state.result;
    const { assessment, classification, title, risk, needsReview, purposeTitle, recommendation, warnings, secondaryTitles, primaryReasons, legacyReasons } = getAnalysisPresentation(result);
    const Icon = risk ? ShieldAlert : classification && !needsReview ? ShieldCheck : CircleAlert;
    return (
      <FadeContent duration={400} className="analysis-verdict">
        <div className={`analysis-stamp ${risk ? "analysis-stamp-danger" : ""}`}>
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <div role="status" aria-live="polite">
          <p className="mt-6 text-xs font-medium text-muted-foreground">Estimación del contenido</p>
          <h3 className="analysis-verdict-title">{title}</h3>
        </div>
        {purposeTitle && <p className="mt-3 text-sm font-medium">Tipo: {purposeTitle}</p>}
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{recommendation}</p>
        {!!secondaryTitles.length && <p className="mt-3 text-sm">{needsReview ? "Hipótesis del modelo" : "Clasificaciones adicionales"}: {secondaryTitles.join(" · ")}</p>}
        {classification && <p className="mt-3 text-xs text-muted-foreground">
          Evidencia {({ weak: "débil", moderate: "moderada", strong: "fuerte" })[classification.evidence_strength]}.
          Es una estimación del contenido; no verifica la identidad del remitente ni garantiza seguridad.
        </p>}
        {!!warnings.length && <aside className="mt-4 text-left text-xs leading-6 text-muted-foreground" aria-label="Advertencias de la estimación">
          <ul className="list-disc pl-5">{warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul>
        </aside>}
        {assessment ? (
          <div className="mt-5 space-y-5 text-left text-sm leading-6">
            <section aria-label="Señales observadas">
              <h4 className="font-medium">Señales observadas</h4>
              {primaryReasons.length ? (
                <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
                  {primaryReasons.map((reason, index) => <li key={`${reason.code}-${index}`}>{reason.message}</li>)}
                </ul>
              ) : <p className="text-muted-foreground">No se aportaron señales específicas.</p>}
            </section>
            <section aria-label="Cobertura y límites">
              <h4 className="font-medium">Cobertura y límites</h4>
              <p className="text-muted-foreground">
                Idioma del texto: {assessment.text.language}. Texto procesado por el modelo auxiliar: {assessment.text.processed_tokens} de {assessment.text.token_count} tokens.
                {assessment.text.truncated ? " El texto se recortó solo en el modelo auxiliar." : " Sin recorte en el modelo auxiliar."}
                {classification ? " El alcance del clasificador del corpus se indica en sus avisos." : ""}
              </p>
              <p className="mt-2 text-muted-foreground">
                Imágenes: {assessment.coverage.images_total}; pendientes: {assessment.coverage.images_pending}.
                {assessment.coverage.ocr_low_confidence ? " La lectura de imágenes tiene baja confianza." : ""}
                {assessment.coverage.links_complete ? " Enlaces declarados como completos." : " Cobertura de enlaces incompleta."}
              </p>
              {assessment.limitations.length > 0 && <ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">
                {assessment.limitations.map((limitation, index) => <li key={index}>{limitation}</li>)}
              </ul>}
            </section>
            {assessment.links.length > 0 && <section aria-label="Enlaces revisados">
              <h4 className="font-medium">Enlaces revisados sin visitarlos</h4>
              <ul className="mt-2 space-y-3 text-muted-foreground">
                {assessment.links.map((link, index) => <li key={index} className="break-all">
                  <span>{link.url}</span>
                  <p>Destino: {link.host || "Sin dominio"}{link.decoded_url ? ` · Destino decodificado: ${link.decoded_url}` : ""}</p>
                  {link.issues.length > 0 && <p>Señales: {link.issues.join(", ")}</p>}
                </li>)}
              </ul>
            </section>}
            {!["none", "unavailable"].includes(assessment.authentication.source) && <section aria-label="Cabeceras declaradas">
              <h4 className="font-medium">Cabeceras declaradas</h4>
              <p className="text-muted-foreground">Origen: {assessment.authentication.source}. {assessment.authentication.verified ? "Verificadas según la API." : "No verificadas criptográficamente."}</p>
              <p className="text-muted-foreground">SPF: {assessment.authentication.spf ?? "no disponible"}; DKIM: {assessment.authentication.dkim ?? "no disponible"}; DMARC: {assessment.authentication.dmarc ?? "no disponible"}.</p>
            </section>}
          </div>
        ) : <p className="mt-4 text-sm leading-7 text-muted-foreground">Este resultado anterior no incluye evidencia, cobertura ni límites verificables. Analiza el correo de nuevo para obtenerlos.</p>}
        <details className="analysis-confidence-block text-left">
          <summary className="text-sm font-medium">Diagnóstico técnico y modelo anterior</summary>
          {!!legacyReasons.length && <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">{legacyReasons.map((reason, index) => <li key={index}>{reason.message}</li>)}</ul>}
          <p className="mt-2 text-xs text-muted-foreground">Diagnóstico anterior: {assessment ? verdictTitles[assessment.verdict] : "no disponible"}. Modelo del corpus: {classification?.model_version ?? "no disponible"}.</p>
          <p className="mt-2 text-sm text-muted-foreground">Etiqueta original: <strong>{result.label}</strong>.</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Puntuación: {typeof result.confidence === "number" ? result.confidence.toFixed(6) : "no disponible"}. No es una probabilidad de seguridad ni determina por sí sola si hay phishing.
          </p>
          {"model" in result && <p className="mt-2 break-all text-xs text-muted-foreground">
            Modelo: {result.model ?? "no disponible"}. Idioma: {result.language}. Tarea: {result.task}. Límite: {result.max_tokens} tokens.
          </p>}
        </details>
        <Button variant="outline" className="mt-7" onClick={onReset}>
          <RotateCcw size={15} />
          Nuevo análisis
        </Button>
      </FadeContent>
    );
  }

  const loading = state.status === "loading";
  const error = state.status === "error";
  const edited = state.status === "edited";
  const Icon = loading ? LoaderCircle : error ? CircleAlert : ScanLine;
  return (
    <div className="analysis-empty-result">
      {state.status === "idle" ? (
        <img
          className="analysis-awaiting-art"
          src="/illustrations/analyzer-letter-v1.webp"
          width="768" height="512" alt=""
        />
      ) : (
        <div className={`analysis-state-icon ${error ? "analysis-state-error" : ""}`}>
          <Icon
            size={32}
            strokeWidth={1.3}
            className={loading ? "motion-safe:animate-spin" : ""}
          />
        </div>
      )}
      <div role={error ? "alert" : "status"} aria-live="polite">
        <h3 className="analysis-state-title">
          {loading
            ? "Analizando correo…"
            : error
              ? "El análisis aún no está disponible"
              : edited
                ? "El correo cambió"
                : "Tu resultado aparecerá aquí"}
        </h3>
        <p className="mt-3 max-w-80 text-sm leading-7 text-muted-foreground">
          {loading
            ? "Consultando el modelo local."
            : error
              ? state.message
              : edited
                ? "Analízalo de nuevo para actualizar el resultado."
                : "Introduce un mensaje o carga un ejemplo para explorar la clasificación."}
        </p>
      </div>
      {error && (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          <RotateCcw size={15} />
          Reintentar
        </Button>
      )}
      {!loading && !error && !edited && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} />
          Sin señales claras
          <span className="mx-1 h-1 w-1 rounded-full bg-border" />
          <ShieldAlert size={14} />
          Señales de riesgo
        </div>
      )}
    </div>
  );
}
