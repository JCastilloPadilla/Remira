import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  History,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SplitText from "@/components/react-bits/SplitText";
import { IllustratedFooter } from "@/components/IllustratedFooter";
import { CorrespondenceBackdrop } from "@/features/landing/CorrespondenceBackdrop";
import { examples } from "@/features/analysis/demo";
import "./history.css";

const records = examples.map((example, id) => ({
  ...example,
  id,
  date: id === 0 ? "2026-10-02" : "2026-10-01",
  time: id === 0 ? "10:24" : "09:18",
  source: id === 0 ? "Análisis manual" : "Bandeja de demostración",
}));
const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));

export function HistoryPage() {
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showExamples, setShowExamples] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const invalidRange = Boolean(from && to && from > to);
  const selected = records.find((record) => record.id === selectedId);
  const visible =
    showExamples && !invalidRange
      ? records.filter(
          (record) =>
            record.subject
              .toLocaleLowerCase("es")
              .includes(query.trim().toLocaleLowerCase("es")) &&
            (label === "all" || record.result.label === label) &&
            (!from || record.date >= from) &&
            (!to || record.date <= to),
        )
      : [];

  useEffect(() => {
    document.title = "Historial de análisis · Remira";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  function resetFilters() {
    setQuery("");
    setLabel("all");
    setFrom("");
    setTo("");
  }

  return (
    <div className="history-page">
      <a href="#history-main" className="skip-link">
        Ir al contenido
      </a>
      <SiteHeader />
      <main id="history-main" className="history-main">
        <CorrespondenceBackdrop />
        <div className="page-width history-content">
        <div className="history-heading">
          <div>
            <p className="history-eyebrow">El registro de tus miradas</p>
            <h1>
              <SplitText text="Una revisión que puedes retomar." tag="span" textAlign="left" splitType="words" delay={45} duration={0.7} rootMargin="0px" />
            </h1>
            <p>Explora cómo consultarías tus análisis anteriores.</p>
          </div>
          <img className="history-heading-art" src="/illustrations/history-archive-v1.webp" width="768" height="512" alt="" />
        </div>
        <div className="history-demo-note">
          <History size={18} />
          <p>
            <strong>Historial ilustrativo.</strong> Las fechas, los registros y
            los resultados son ficticios. Esta demostración no guarda
            los análisis que realizas.
          </p>
        </div>
        <section
          className="history-records"
          aria-labelledby="history-list-title"
        >
          <div className="history-list-heading">
            <h2 id="history-list-title">Análisis anteriores</h2>
            <Button
              variant="ghost"
              onClick={() => {
                setShowExamples(!showExamples);
                resetFilters();
              }}
            >
              {showExamples ? "Ver historial vacío" : "Mostrar ejemplos"}
            </Button>
          </div>
          <div className="history-filters">
            <label className="history-search">
              Buscar asunto
              <div>
                <Search size={16} aria-hidden="true" />
                <Input
                  placeholder="Buscar en los ejemplos"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </label>
            <label>
              Clasificación
              <select
                value={label}
                onChange={(event) => setLabel(event.target.value)}
              >
                <option value="all">Todas</option>
                <option value="legitimate">Legítimo</option>
                <option value="malicious">Potencialmente malicioso</option>
              </select>
            </label>
            <label>
              Desde
              <Input
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                aria-invalid={invalidRange}
                aria-describedby={
                  invalidRange ? "history-range-error" : undefined
                }
              />
            </label>
            <label>
              Hasta
              <Input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                aria-invalid={invalidRange}
                aria-describedby={
                  invalidRange ? "history-range-error" : undefined
                }
              />
            </label>
          </div>
          {invalidRange && (
            <p
              id="history-range-error"
              className="history-range-error"
              role="alert"
            >
              La fecha inicial debe ser anterior o igual a la fecha final.
            </p>
          )}
          <div className="history-results-count" role="status">
            <span>
              {visible.length}{" "}
              {visible.length === 1
                ? "registro de demostración"
                : "registros de demostración"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              disabled={!query && label === "all" && !from && !to}
            >
              Restablecer filtros
            </Button>
          </div>
          {visible.length > 0 ? (
            <table className="history-table">
              <caption className="sr-only">
                Registros ficticios de análisis. Usa Ver detalle para consultar
                cada ejemplo.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Correo</th>
                  <th scope="col">Fecha ilustrativa</th>
                  <th scope="col">Clasificación</th>
                  <th scope="col">Confianza ilustrativa</th>
                  <th scope="col">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.subject}</strong>
                      <span>{record.source}</span>
                    </td>
                    <td data-label="Fecha">
                      {formatDate(record.date)}
                      <span>{record.time}</span>
                    </td>
                    <td data-label="Clasificación">
                      <span className={`history-label ${record.result.label}`}>
                        {record.result.label === "malicious" ? (
                          <ShieldAlert size={15} />
                        ) : (
                          <ShieldCheck size={15} />
                        )}
                        {record.result.label === "malicious"
                          ? "Potencialmente malicioso"
                          : "Legítimo"}
                      </span>
                    </td>
                    <td data-label="Confianza">
                      {Math.round(record.result.confidence * 100)} %
                    </td>
                    <td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedId(record.id)}
                        aria-label={`Ver detalle: ${record.subject}`}
                      >
                        Ver detalle <ArrowRight size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="history-empty">
              <img className="history-empty-art" src="/illustrations/history-archive-v1.webp" width="768" height="512" alt="" />
              <h3>
                {showExamples
                  ? invalidRange
                    ? "Revisa el intervalo de fechas"
                    : "No hay registros que coincidan"
                  : "Tus próximas revisiones empiezan aquí."}
              </h3>
              <p>
                {showExamples
                  ? "Ajusta los filtros para volver a consultar los ejemplos."
                  : "Así se verá el historial cuando no haya análisis guardados. Por ahora, puedes explorar el analizador o mostrar los registros ficticios."}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setShowExamples(true);
                  resetFilters();
                }}
              >
                {showExamples ? "Restablecer filtros" : "Mostrar ejemplos"}
              </Button>
            </div>
          )}
        </section>
        <p className="history-storage-note">
          Esta demostración no almacena correos ni resultados. Recargar o salir de la
          pantalla reinicia los filtros y la selección.
        </p>
        </div>
      </main>
      <div className="history-footer-transition" aria-hidden="true" />
      <IllustratedFooter topHref="#history-main" />
      <Dialog
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <DialogContent className="history-dialog">
          <DialogHeader>
            <DialogTitle>
              {selected?.subject ?? "Detalle del análisis"}
            </DialogTitle>
            <DialogDescription>
              Registro ficticio. No corresponde a un análisis guardado de tu
              cuenta.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <dl className="history-detail-meta">
                <div>
                  <dt>Fecha ilustrativa</dt>
                  <dd>
                    {formatDate(selected.date)} · {selected.time}
                  </dd>
                </div>
                <div>
                  <dt>Origen ilustrativo</dt>
                  <dd>{selected.source}</dd>
                </div>
              </dl>
              <div className="history-message">
                <h3>Contenido del ejemplo</h3>
                <p>{selected.body}</p>
              </div>
              <div className="history-result-reveal" key={selected.id}>
                <div
                  className={`history-detail-result ${selected.result.label}`}
                >
                  <strong>
                    {selected.result.label === "malicious"
                      ? "Potencialmente malicioso"
                      : "Clasificado como legítimo"}
                  </strong>
                  <p>
                    Confianza ilustrativa:{" "}
                    {Math.round(selected.result.confidence * 100)} % · Resultado
                    simulado
                  </p>
                </div>
              </div>
              <p className="history-detail-limit">
                La clasificación puede equivocarse. Los enlaces se muestran como
                texto; no se abren ni se inspeccionan adjuntos.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
