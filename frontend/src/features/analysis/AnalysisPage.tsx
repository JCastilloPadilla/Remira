import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CircleHelp, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmailForm } from "@/features/analysis/EmailForm";
import { AnalysisResult } from "@/features/analysis/AnalysisResult";
import {
  examples,
  type AnalysisState,
  type EmailDraft,
} from "@/features/analysis/demo";
import type { LocalAnalysisResponse } from "./assessment";
import { analyzeLocalEmail } from "@/features/analysis/api";

import SplitText from "@/components/react-bits/SplitText";
import { IllustratedFooter } from "@/components/IllustratedFooter";
import { CorrespondenceBackdrop } from "@/features/landing/CorrespondenceBackdrop";
import "./analysis.css";

const emptyDraft: EmailDraft = { subject: "", body: "" };

function AnalysisPage() {
  const [draft, setDraft] = useState<EmailDraft>(emptyDraft);
  const [analysis, setAnalysis] = useState<AnalysisState<LocalAnalysisResponse>>({ status: "idle" });
  const [validation, setValidation] = useState("");
  const [pendingDraft, setPendingDraft] = useState<EmailDraft | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const busy = analysis.status === "loading";

  useEffect(() => {
    document.title = "Analizar correo · Remira";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => requestRef.current?.abort();
  }, []);

  useEffect(() => {
    if (
      (analysis.status !== "success" && analysis.status !== "error") ||
      !window.matchMedia("(max-width: 1023px)").matches
    ) return;

    const frame = requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [analysis.status]);

  function updateDraft(next: EmailDraft) {
    setDraft(next);
    setValidation("");
    if (analysis.status !== "idle") setAnalysis({ status: "edited" });
  }

  function replaceDraft(next: EmailDraft) {
    setDraft(next);
    setValidation("");
    setAnalysis({ status: "idle" });
    subjectRef.current?.focus();
  }

  function requestReplacement(next: EmailDraft) {
    if (!draft.subject && !draft.body) return replaceDraft(next);
    setPendingDraft(next);
    setConfirmationOpen(true);
  }

  async function analyze() {
    if (busy) return;
    if (!draft.body.trim()) {
      setValidation("Pega el contenido del correo para continuar.");
      document.getElementById("email-body")?.focus();
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setAnalysis({ status: "loading" });
    try {
      const result = await analyzeLocalEmail(draft, controller.signal);
      setAnalysis({ status: "success", result });
    } catch (error) {
      if (controller.signal.aborted) return;
      setAnalysis({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "No pudimos completar el análisis local.",
      });
    }
  }

  return (
    <div className="analysis-page">
      <a className="skip-link" href="#main">
        Ir al contenido
      </a>
      <SiteHeader />

      <main id="main" className="analysis-stage">
        <CorrespondenceBackdrop />
        <div className="page-width analysis-content">
          <section className="analysis-intro" aria-labelledby="page-title">
            <div>
              <p className="analysis-eyebrow">La mesa de revisión</p>
              <h1 id="page-title">
                <SplitText
                  text="Dale otra mirada a ese correo."
                  tag="span"
                  textAlign="left"
                  splitType="words"
                  delay={45}
                  duration={0.7}
                  rootMargin="0px"
                />
              </h1>
              <p className="analysis-intro-description">
                Lee entre líneas, revisa las señales y decide con más contexto.
              </p>
            <Dialog>
              <DialogTrigger render={<Button variant="ghost" size="sm" />}>
                <CircleHelp size={16} />
                <span>Ayuda rápida</span>
              </DialogTrigger>
              <DialogContent className="analysis-dialog">
                <DialogHeader>
                  <DialogTitle>Una segunda mirada a tu correo</DialogTitle>
                  <DialogDescription>
                    Introduce asunto y cuerpo, analiza el mensaje y consulta su
                    clasificación.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">
                      El análisis se ejecuta localmente en este equipo.
                    </strong>{" "}
                    El asunto y cuerpo se envían solo a la API local para
                    obtener la clasificación del modelo; no se guardan.
                  </p>
                  <p>
                    El análisis se centra en el texto del mensaje. No incluye
                    la inspección de adjuntos ni la verificación de la reputación
                    de los enlaces.
                  </p>
                  <p>
                    La puntuación del modelo no es una probabilidad de seguridad. El
                    clasificador puede equivocarse y recortar mensajes largos.
                  </p>
                  <p>
                    El contenido de este borrador permanece en memoria durante
                    la sesión. Recargar la página lo borra.
                  </p>
                  <Link
                    to="/como-funciona"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    Ayuda completa (nueva pestaña)
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
            </div>
            <img
              src="/illustrations/guide-private-letter-v1.webp"
              width="500" height="375" alt=""
              className="analysis-intro-art"
            />
          </section>

          <p className="analysis-demo-note">
            <CircleHelp size={16} aria-hidden="true" />
            <span><strong>Análisis local.</strong> El correo se analiza en
              este equipo y no se envía a servicios externos.</span>
          </p>

          <div className="analysis-workspace">
            <section className="analysis-letter" aria-labelledby="form-title">
              <div className="analysis-panel-heading">
                <div>
                  <p className="analysis-eyebrow">01 / El mensaje</p>
                  <h2 id="form-title">Un correo bajo la lupa.</h2>
                  <p>Pega el contenido o empieza con un ejemplo.</p>
                </div>
                <Mail size={24} strokeWidth={1.3} aria-hidden="true" />
              </div>
              <EmailForm
                draft={draft}
                onChange={updateDraft}
                onSubmit={analyze}
                busy={busy}
                validation={validation}
                subjectRef={subjectRef}
                examples={examples}
                onExample={requestReplacement}
                onClear={() => requestReplacement(emptyDraft)}
              />
            </section>
            <section
              ref={resultRef}
              className="analysis-reading"
              aria-labelledby="result-title"
              aria-busy={busy}
            >
              <div className="analysis-panel-heading">
                <div>
                  <p className="analysis-eyebrow">02 / La segunda mirada</p>
                  <h2 id="result-title">Las señales del correo.</h2>
                </div>
                <span className="analysis-demo-label">Modelo local</span>
              </div>
              <AnalysisResult
                state={analysis}
                onRetry={analyze}
                onReset={() => requestReplacement(emptyDraft)}
              />
              <p className="analysis-result-note">
                <CircleHelp size={16} aria-hidden="true" />
                <span>Una pista útil. Comprueba siempre el remitente antes de actuar.</span>
              </p>
            </section>
          </div>
          <p className="analysis-privacy">
            <LockKeyhole size={15} aria-hidden="true" />
            <span>El borrador permanece en tu navegador. No se guarda y
              desaparece al recargar o salir de esta página.</span>
          </p>
        </div>
      </main>
      <div className="analysis-footer-transition" aria-hidden="true" />
      <IllustratedFooter topHref="#main" />

      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent className="analysis-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reemplazar el contenido?</AlertDialogTitle>
            <AlertDialogDescription>
              Se borrarán el texto actual y su resultado. Puedes cancelar para
              seguir trabajando con este correo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Conservar correo</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDraft) replaceDraft(pendingDraft);
                setPendingDraft(null);
                setConfirmationOpen(false);
              }}
            >
              Reemplazar contenido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AnalysisPage;
