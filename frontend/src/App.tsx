import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  CircleHelp,
  FlaskConical,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  simulateAnalysis,
  type AnalysisState,
  type EmailDraft,
} from "@/features/analysis/demo";

const emptyDraft: EmailDraft = { subject: "", body: "" };

function App() {
  const [draft, setDraft] = useState<EmailDraft>(emptyDraft);
  const [analysis, setAnalysis] = useState<AnalysisState>({ status: "idle" });
  const [validation, setValidation] = useState("");
  const [pendingDraft, setPendingDraft] = useState<EmailDraft | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const busy = analysis.status === "loading";

  useEffect(() => () => requestRef.current?.abort(), []);

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
      const result = await simulateAnalysis(draft, controller.signal);
      setAnalysis({ status: "success", result });
    } catch (error) {
      if (controller.signal.aborted) return;
      setAnalysis({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "No pudimos completar la demostración.",
      });
    }
    if (window.matchMedia("(max-width: 1023px)").matches) {
      resultRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    }
  }

  return (
    <div className="min-h-dvh">
      <a className="skip-link" href="#main">
        Ir al contenido
      </a>
      <header className="site-header">
        <div className="page-width flex min-h-20 items-center justify-between gap-4">
          <a
            href="#main"
            className="flex items-center gap-3"
            aria-label="Detector de correos, inicio"
          >
            <span className="brand-mark">
              <ShieldCheck size={23} strokeWidth={1.7} />
            </span>
            <span className="font-semibold tracking-tight">
              Detector de correos
              <span className="block text-xs font-normal tracking-normal text-muted-foreground">
                Análisis inteligente de mensajes
              </span>
            </span>
          </a>
          <div className="flex items-center gap-3 sm:gap-6">
            <span
              className="hidden text-sm font-semibold text-primary sm:block"
              aria-current="page"
            >
              Analizar correo
            </span>
            <Dialog>
              <DialogTrigger render={<Button variant="ghost" size="sm" />}>
                <CircleHelp size={16} />
                <span>Cómo funciona</span>
              </DialogTrigger>
              <DialogContent>
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
                      Esta versión es una demostración.
                    </strong>{" "}
                    Los ejemplos tienen respuestas simuladas; todavía no se
                    envía texto a Flask ni se ejecuta el modelo.
                  </p>
                  <p>
                    Cuando esté conectado, el modelo procesará el texto en el
                    equipo que ejecuta la aplicación. No inspeccionará adjuntos
                    ni verificará la reputación de los enlaces.
                  </p>
                  <p>
                    La confianza del modelo no garantiza seguridad. El
                    clasificador puede equivocarse y recortar mensajes que
                    superen 512 tokens.
                  </p>
                  <p>
                    El contenido de este borrador permanece en memoria durante
                    la sesión. Recargar la página lo borra.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main id="main" className="page-width pb-12 pt-8 sm:pt-12">
        <section className="intro-banner" aria-labelledby="page-title">
          <div className="relative z-10 max-w-xl">
            <Badge className="intro-badge" variant="outline">
              <FlaskConical size={13} /> Primera versión · Demostración
            </Badge>
            <h1
              id="page-title"
              className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-[2.75rem]"
            >
              Antes de hacer clic,
              <br />
              dale una segunda mirada.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-blue-100 sm:text-base">
              Revisa el contenido de un correo y consulta si el modelo lo
              clasifica como legítimo o potencialmente malicioso.
            </p>
          </div>
          <div className="mail-illustration" aria-hidden="true">
            <div className="mail-sheet">
              <div className="mail-sheet-dot" />
              <div className="mail-line long" />
              <div className="mail-line" />
              <div className="mail-line short" />
            </div>
            <div className="mail-envelope">
              <Mail size={72} strokeWidth={0.9} />
            </div>
            <span className="mail-check">
              <Check size={24} strokeWidth={2} />
            </span>
          </div>
        </section>

        <div className="demo-notice">
          <FlaskConical size={16} className="shrink-0" />
          <p>
            <strong>Vista de demostración.</strong> El modelo todavía no está
            conectado. Usa un ejemplo para explorar el resultado.
          </p>
        </div>

        <div className="analysis-grid">
          <section className="workspace-panel" aria-labelledby="form-title">
            <div className="panel-heading">
              <div>
                <h2 id="form-title">Analiza un correo</h2>
                <p>Pega el mensaje que quieres revisar.</p>
              </div>
              <span className="panel-icon">
                <Mail size={20} strokeWidth={1.5} />
              </span>
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
            className="workspace-panel result-panel scroll-mt-6"
            aria-labelledby="result-title"
          >
            <div className="panel-heading">
              <div>
                <h2 id="result-title">Resultado del análisis</h2>
                <p>Una orientación para tu siguiente paso.</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Demostración
              </Badge>
            </div>
            <AnalysisResult
              state={analysis}
              onRetry={analyze}
              onReset={() => requestReplacement(emptyDraft)}
            />
            <div className="result-note">
              <CircleHelp size={15} className="mt-0.5 shrink-0" />
              <p>
                La clasificación es una ayuda para revisar el mensaje. No
                sustituye la verificación del remitente.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <LockKeyhole size={14} className="mt-0.5 shrink-0" />
          <p>
            En esta demostración el texto permanece en tu navegador y no se
            guarda al recargar.
          </p>
        </div>
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground">
          <p>Proyecto académico · Técnicas de Inteligencia Artificial</p>
          <a
            href="https://github.com/JCastilloPadilla/email-threat-detector"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary"
          >
            Acerca del proyecto <ArrowUpRight size={13} />
          </a>
        </footer>
      </main>

      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
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

export default App;
