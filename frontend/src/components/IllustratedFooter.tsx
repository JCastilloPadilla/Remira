import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { BrandName } from "./BrandName";
import { Button } from "./ui/button";
import "./illustrated-footer.css";

export function IllustratedFooter({ topHref, projectHref = "/#acerca" }: { topHref: string; projectHref?: string }) {
  const { pathname } = useLocation();
  const onAnalyzer = pathname === "/analizar";
  const onHelp = pathname === "/como-funciona";
  return (
    <footer className="landing-footer">
      <div className="page-width landing-footer-links">
        <div className="landing-footer-brand">
          <BrandMark tone="light" />
          <p><BrandName /><span>Hecho para mirar con más atención.</span></p>
        </div>
        <nav aria-label="Navegación del pie de página">
          {onAnalyzer ? <a href={topHref}>Analizador</a> : <Link to="/analizar">Analizador</Link>}
          {projectHref.startsWith("#") ? <a href={projectHref}>El proyecto</a> : <Link to={projectHref}>El proyecto</Link>}
          {onHelp ? <a href={topHref}>Cómo funciona</a> : <Link to="/como-funciona">Cómo funciona</Link>}
          <a href="https://github.com/JCastilloPadilla/email-threat-detector" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
        </nav>
      </div>
      <div className="page-width landing-footer-bottom">
        <p>Una segunda mirada a tus mensajes</p>
        <a href="#">Volver al inicio ↑</a>
      </div>
      <div className="landing-footer-scene">
        <section className="landing-final-cta" aria-labelledby="footer-try-title">
          <div className="page-width landing-final-copy">
            <h2 id="footer-try-title">Dale una segunda mirada.</h2>
            <p>Empieza con un correo de ejemplo y conoce el recorrido.</p>
            <Button size="lg" render={onAnalyzer ? <a href={topHref} /> : <Link to="/analizar" />} className="landing-final-button">
              Probar el analizador <ArrowRight size={17} />
            </Button>
          </div>
        </section>
        <picture className="landing-footer-picture">
          <source media="(max-width: 767px) and (orientation: portrait)" srcSet="/illustrations/correspondence-footer-mobile-v1.webp" width={1024} height={1536} />
          <img className="landing-footer-art" src="/illustrations/correspondence-footer-v1.webp" alt="" aria-hidden="true" width={2172} height={724} loading="lazy" decoding="async" />
        </picture>
      </div>
    </footer>
  );
}
