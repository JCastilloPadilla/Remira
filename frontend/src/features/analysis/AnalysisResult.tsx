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
import type { AnalysisState } from "./demo";

export function AnalysisResult({
  state,
  onRetry,
  onReset,
}: {
  state: AnalysisState;
  onRetry: () => void;
  onReset: () => void;
}) {
  if (state.status === "success") {
    const malicious = state.result.label === "malicious";
    const Icon = malicious ? ShieldAlert : ShieldCheck;
    return (
      <FadeContent duration={400} className="flex flex-1 flex-col p-7">
        <div
          className={
            malicious
              ? "verdict-icon verdict-danger"
              : "verdict-icon verdict-safe"
          }
        >
          <Icon size={32} strokeWidth={1.5} />
        </div>
        <div role="status" aria-live="polite">
          <p className="mt-6 text-xs font-medium text-muted-foreground">
            Resultado simulado
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            {malicious
              ? "Potencialmente malicioso"
              : "Clasificado como legítimo"}
          </h3>
        </div>
        <div className="confidence-block">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span>Confianza del modelo</span>
            <strong className="text-xl">
              {Math.round(state.result.confidence * 100)} %
            </strong>
          </div>
          <div className="confidence-track" aria-hidden="true">
            <div
              className={
                malicious ? "confidence-fill danger" : "confidence-fill safe"
              }
              style={{ width: `${state.result.confidence * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Valor de demostración, no una medición de este correo.
          </p>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">
          {malicious
            ? "Verifica el remitente por otro medio antes de abrir enlaces o compartir información personal."
            : "La clasificación no garantiza seguridad. Comprueba el remitente y el contexto antes de actuar."}
        </p>
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
    <div className="empty-result flex flex-1 flex-col items-center justify-center px-7 py-12 text-center">
      <div className={`empty-result-icon ${error ? "error-icon" : ""}`}>
        <Icon
          size={32}
          strokeWidth={1.3}
          className={loading ? "motion-safe:animate-spin" : ""}
        />
      </div>
      <div role={error ? "alert" : "status"} aria-live="polite">
        <h3 className="mt-6 text-base font-semibold">
          {loading
            ? "Analizando correo…"
            : error
              ? "El análisis aún no está disponible"
              : edited
                ? "El correo cambió"
                : "Tu resultado aparecerá aquí"}
        </h3>
        <p className="mt-3 max-w-64 text-sm leading-7 text-muted-foreground">
          {loading
            ? "Estamos preparando el resultado de demostración."
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
          Legítimo
          <span className="mx-1 h-1 w-1 rounded-full bg-border" />
          <ShieldAlert size={14} />
          Potencialmente malicioso
        </div>
      )}
    </div>
  );
}
