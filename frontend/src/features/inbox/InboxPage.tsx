import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Mail,
  ScanLine,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SplitText from "@/components/react-bits/SplitText";
import { IllustratedFooter } from "@/components/IllustratedFooter";
import { CorrespondenceBackdrop } from "@/features/landing/CorrespondenceBackdrop";
import {
  examples,
  simulateAnalysis,
  type AnalysisState,
} from "@/features/analysis/demo";
import "./inbox.css";

const messages = examples.map((example, index) => ({
  ...example,
  id: index,
  sender:
    index === 0
      ? "Mariana · Equipo del proyecto"
      : "Departamento de verificación",
  address:
    index === 0
      ? "mariana@equipo.example"
      : "avisos@verificacion-cuenta.example",
  time: index === 0 ? "10:24" : "09:18",
}));
type Filter = "all" | "pending" | "legitimate" | "malicious";

export function InboxPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [analyses, setAnalyses] = useState<Record<number, AnalysisState>>({});
  const requestRef = useRef<AbortController | null>(null);
  const detailRef = useRef<HTMLElement>(null);
  const busy = Object.values(analyses).some(
    (state) => state.status === "loading",
  );
  const selected = messages.find((message) => message.id === selectedId);
  const state = selected ? analyses[selected.id] : undefined;
  const visible = messages.filter((message) => {
    const result = analyses[message.id];
    const matchesFilter =
      filter === "all" ||
      (filter === "pending"
        ? result?.status !== "success"
        : result?.status === "success" && result.result.label === filter);
    return (
      matchesFilter &&
      `${message.sender} ${message.subject}`
        .toLocaleLowerCase("es")
        .includes(query.trim().toLocaleLowerCase("es"))
    );
  });

  useEffect(() => {
    document.title = "Bandeja de Gmail · Remira";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => requestRef.current?.abort();
  }, []);

  useEffect(() => {
    if (selectedId === null) return;
    detailRef.current?.focus({ preventScroll: true });
    if (window.matchMedia("(max-width: 767px)").matches) {
      detailRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant" : "smooth",
        block: "start",
      });
    }
  }, [selectedId]);

  async function analyze() {
    if (!selected || busy) return;
    const id = selected.id;
    const controller = new AbortController();
    requestRef.current = controller;
    setAnalyses((previous) => ({ ...previous, [id]: { status: "loading" } }));
    try {
      const result = await simulateAnalysis(selected, controller.signal);
      if (!controller.signal.aborted)
        setAnalyses((previous) => ({
          ...previous,
          [id]: { status: "success", result },
        }));
    } catch (error) {
      if (!controller.signal.aborted)
        setAnalyses((previous) => ({
          ...previous,
          [id]: {
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "No se pudo completar la demostración. Inténtalo de nuevo.",
          },
        }));
    }
  }

  return (
    <div className="inbox-page">
      <a href="#inbox-main" className="skip-link">
        Ir al contenido
      </a>
      <SiteHeader />
      <main id="inbox-main" className="inbox-main">
        <CorrespondenceBackdrop />
        <div className="page-width inbox-content">
        <div className="inbox-heading">
          <div>
            <p className="inbox-eyebrow">La correspondencia</p>
            <h1>
              <SplitText text="Cada correo merece otra mirada." tag="span" textAlign="left" splitType="words" delay={45} duration={0.7} rootMargin="0px" />
            </h1>
            <p>Selecciona un mensaje y explora su clasificación.</p>
          </div>
          <Dialog>
            <DialogTrigger
              render={<Button variant="outline" className="inbox-connect" />}
            >
              <Mail size={16} /> Conectar Gmail
            </DialogTrigger>
            <DialogContent className="inbox-dialog">
              <DialogHeader>
                <DialogTitle>Tu correo, con tu permiso</DialogTitle>
                <DialogDescription>
                  Esta bandeja contiene dos mensajes ficticios. No accede a tu
                  cuenta ni lee correos reales.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-7 text-muted-foreground">
                Iniciar sesión y autorizar la lectura de correos son decisiones
                separadas. Aquí puedes explorar los dos mensajes de ejemplo,
                sin conceder acceso a tu cuenta.
              </p>
              <Button render={<Link to="/login" />}>
                Ver la pantalla de acceso <ArrowRight size={16} />
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <div className="inbox-demo-note">
          <ShieldCheck size={18} />
          <p>
            <strong>Sin cuenta conectada.</strong> Los mensajes y sus resultados
            son de demostración. No se guardan al recargar.
          </p>
        </div>

        <div
          className={`inbox-workspace ${selected ? "inbox-has-selection" : ""}`}
        >
          <section
            className="inbox-list-panel"
            aria-labelledby="inbox-list-title"
          >
            <img
              className="inbox-mobile-art"
              src="/illustrations/inbox-correspondence-v1.webp"
              width="768" height="512" alt=""
            />
            <div className="inbox-list-heading">
              <h2 id="inbox-list-title" tabIndex={-1}>Mensajes de ejemplo</h2>
              <span>
                {visible.length} de {messages.length}
              </span>
            </div>
            <div className="inbox-search">
              <Search size={16} aria-hidden="true" />
              <Input
                aria-label="Buscar por asunto o remitente"
                placeholder="Buscar por asunto o remitente"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <label className="inbox-filter">
              Mostrar
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as Filter)}
              >
                <option value="all">Todos los mensajes</option>
                <option value="pending">Sin analizar</option>
                <option value="legitimate">Legítimos</option>
                <option value="malicious">Potencialmente maliciosos</option>
              </select>
            </label>
            <ul className="inbox-messages">
              {visible.map((message) => {
                const analysis = analyses[message.id];
                return (
                  <li key={message.id}>
                    <button
                      className={`inbox-message ${message.id === selectedId ? "is-selected" : ""}`}
                      onClick={() => setSelectedId(message.id)}
                      aria-pressed={message.id === selectedId}
                      aria-label={`Abrir correo: ${message.subject}`}
                    >
                      <div className="inbox-message-meta">
                        <strong>{message.sender}</strong>
                        <span>{message.time}</span>
                      </div>
                      <h3>{message.subject}</h3>
                      <p>{message.body.replaceAll("\n", " ")}</p>
                      <span
                        className={`inbox-message-status ${analysis?.status === "success" ? analysis.result.label : ""}`}
                      >
                        {analysis?.status === "success"
                          ? analysis.result.label === "malicious"
                            ? "Potencialmente malicioso"
                            : "Legítimo"
                          : analysis?.status === "loading"
                            ? "Analizando…"
                            : "Sin analizar"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {visible.length === 0 && (
              <div className="inbox-no-matches" role="status">
                <Search size={24} />
                <h3>No hay mensajes que coincidan</h3>
                <p>Prueba otro asunto, remitente o filtro.</p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  Restablecer filtros
                </Button>
              </div>
            )}
            <p className="inbox-list-footnote">
              Remitentes ficticios · Dominios .example
            </p>
          </section>

          <section
            className="inbox-detail"
            ref={detailRef}
            tabIndex={-1}
            aria-labelledby="inbox-detail-title"
          >
            {selected ? (
              <>
                <Button
                  variant="ghost"
                  className="inbox-back-list"
                  onClick={() => {
                    setSelectedId(null);
                    requestAnimationFrame(() => {
                      const title = document.getElementById("inbox-list-title");
                      title?.focus({ preventScroll: true });
                      title?.scrollIntoView({
                        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                          ? "instant" : "smooth",
                        block: "start",
                      });
                    });
                  }}
                >
                  <ArrowLeft size={16} /> Volver a los mensajes
                </Button>
                <div className="inbox-detail-top">
                  <span>Vista del mensaje</span>
                  <Badge variant="outline">Correo ficticio</Badge>
                </div>
                <h2 id="inbox-detail-title">{selected.subject}</h2>
                <div className="inbox-sender">
                  <span className="inbox-avatar">
                    {selected.sender.charAt(0)}
                  </span>
                  <div>
                    <strong>{selected.sender}</strong>
                    <span>{selected.address}</span>
                  </div>
                  <time>{selected.time}</time>
                </div>
                <p className="inbox-body">{selected.body}</p>
                <div className="inbox-analysis-area">
                  <div className="inbox-analysis-heading">
                    <div>
                      <h3>Revisión del mensaje</h3>
                      <p>Resultado preparado para este ejemplo.</p>
                    </div>
                    <Button
                      onClick={analyze}
                      disabled={busy}
                      aria-busy={state?.status === "loading"}
                    >
                      {state?.status === "loading" ? (
                        <LoaderCircle
                          className="animate-spin motion-reduce:animate-none"
                          size={16}
                        />
                      ) : (
                        <ScanLine size={16} />
                      )}
                      {state?.status === "loading"
                        ? "Analizando…"
                        : state?.status === "success"
                          ? "Repetir demostración"
                          : "Analizar ejemplo"}
                    </Button>
                  </div>
                  {state?.status === "success" ? (
                    <div
                      className="inbox-result-reveal"
                      key={`${selected.id}-${state.result.label}`}
                    >
                      <div
                        className={`inbox-verdict ${state.result.label}`}
                        role="status"
                      >
                        {state.result.label === "malicious" ? (
                          <ShieldAlert size={24} />
                        ) : (
                          <ShieldCheck size={24} />
                        )}
                        <div>
                          <strong>
                            {state.result.label === "malicious"
                              ? "Potencialmente malicioso"
                              : "Clasificado como legítimo"}
                          </strong>
                          <p>
                            Confianza ilustrativa:{" "}
                            {Math.round(state.result.confidence * 100)} % ·
                            Resultado simulado
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="inbox-analysis-status" role="status">
                      {state?.status === "error"
                        ? state.message
                        : state?.status === "loading"
                          ? "Preparando el resultado de demostración…"
                          : "La clasificación aparecerá aquí cuando analices el ejemplo."}
                    </p>
                  )}
                  <p className="inbox-analysis-limit">
                    La clasificación puede equivocarse. No se abren enlaces ni
                    se inspeccionan adjuntos.
                  </p>
                </div>
              </>
            ) : (
              <div className="inbox-detail-empty">
                <img
                  className="inbox-awaiting-art"
                  src="/illustrations/inbox-correspondence-v1.webp"
                  width="768" height="512" alt=""
                />
                <h2 id="inbox-detail-title">Empieza por un mensaje.</h2>
                <p>
                  Selecciona un correo de la lista para leer su contenido y
                  probar el análisis.
                </p>
                <span className="inbox-empty-caption">
                  Dos ejemplos. Ningún correo real.
                </span>
              </div>
            )}
          </section>
        </div>
        </div>
      </main>
      <div className="inbox-footer-transition" aria-hidden="true" />
      <IllustratedFooter topHref="#inbox-main" />
    </div>
  );
}
