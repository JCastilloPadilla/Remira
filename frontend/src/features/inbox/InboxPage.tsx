import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Inbox,
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
import FadeContent from "@/components/react-bits/FadeContent";
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
    document.title = "Bandeja de Gmail · Detector de correos";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => requestRef.current?.abort();
  }, []);

  useEffect(() => {
    if (selectedId !== null) detailRef.current?.focus();
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
      <header className="site-header">
        <div className="page-width inbox-nav">
          <Link
            to="/"
            className="inbox-brand"
            aria-label="Detector de correos, inicio"
          >
            <span className="brand-mark">
              <ShieldCheck size={23} strokeWidth={1.7} />
            </span>
            <span>
              Detector de correos
              <span className="inbox-brand-caption">
                Análisis inteligente de mensajes
              </span>
            </span>
          </Link>
          <nav aria-label="Navegación principal">
            <Link to="/historial">Historial</Link>
            <Link to="/analizar">Analizar correo</Link>
            <Link to="/bandeja" aria-current="page">
              Bandeja de Gmail
            </Link>
          </nav>
        </div>
      </header>
      <main id="inbox-main" className="page-width inbox-main">
        <div className="inbox-heading">
          <div>
            <Badge variant="outline">Demostración</Badge>
            <h1>Tu bandeja, bajo otra mirada.</h1>
            <p>Selecciona un mensaje y explora su clasificación.</p>
          </div>
          <Dialog>
            <DialogTrigger
              render={<Button variant="outline" className="inbox-connect" />}
            >
              <Mail size={16} /> Conectar Gmail
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>La conexión con Gmail está pendiente</DialogTitle>
                <DialogDescription>
                  Esta bandeja contiene dos mensajes ficticios. No accede a tu
                  cuenta ni lee correos reales.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-7 text-muted-foreground">
                Cuando integremos Gmail, iniciar sesión y autorizar la lectura
                de correos serán pasos separados. Por ahora puedes probar los
                mensajes de demostración.
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
            <div className="inbox-list-heading">
              <h2 id="inbox-list-title">Mensajes de ejemplo</h2>
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
                    document
                      .getElementById("inbox-list-title")
                      ?.scrollIntoView({ block: "start" });
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
                    <FadeContent
                      duration={400}
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
                    </FadeContent>
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
                <span>
                  <Inbox size={38} strokeWidth={1.3} />
                </span>
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
      </main>
      <footer className="page-width inbox-footer">
        <p>Detector de correos · Proyecto académico</p>
        <Link to="/">
          Conocer el proyecto <ArrowRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
