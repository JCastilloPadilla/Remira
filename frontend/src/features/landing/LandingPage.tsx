import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  FileText,
  FlaskConical,
  LockKeyhole,
  Mail,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FadeContent from "@/components/react-bits/FadeContent";
import "./landing.css";

const steps = [
  {
    title: "Introduce el mensaje",
    description: "Copia el asunto y el cuerpo del correo que quieres revisar.",
    icon: FileText,
  },
  {
    title: "Revisa su clasificación",
    description: "Consulta la etiqueta y la confianza que devuelve el modelo.",
    icon: ScanLine,
  },
  {
    title: "Decide con más contexto",
    description:
      "Usa el resultado como apoyo y verifica el remitente antes de actuar.",
    icon: ShieldCheck,
  },
];

export function LandingPage() {
  useEffect(() => {
    document.title = "Detector de correos · Una segunda mirada a tus mensajes";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="landing-page">
      <a href="#landing-main" className="skip-link">
        Ir al contenido
      </a>
      <header className="site-header">
        <div className="page-width landing-nav">
          <Link
            to="/"
            className="landing-brand"
            aria-label="Detector de correos, inicio"
          >
            <span className="brand-mark">
              <ShieldCheck size={23} strokeWidth={1.7} />
            </span>
            <span>
              Detector de correos
              <span className="landing-brand-caption">
                Análisis inteligente de mensajes
              </span>
            </span>
          </Link>
          <nav aria-label="Navegación principal" className="landing-nav-links">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#acerca">Acerca del proyecto</a>
            <Button
              render={<Link to="/analizar" />}
              className="landing-nav-cta"
            >
              Abrir analizador <ArrowUpRight size={15} />
            </Button>
          </nav>
        </div>
      </header>

      <main id="landing-main">
        <section
          className="page-width landing-hero"
          aria-labelledby="landing-title"
        >
          <div className="landing-hero-copy">
            <Badge variant="outline" className="landing-project-badge">
              <FlaskConical size={13} /> Proyecto académico en desarrollo
            </Badge>
            <FadeContent duration={550}>
              <h1 id="landing-title">
                Un correo puede
                <br />
                parecer confiable.
                <br />
                <span>Revísalo antes.</span>
              </h1>
            </FadeContent>
            <p className="landing-lead">
              Una segunda mirada al contenido de tus mensajes. Exploramos cómo
              la inteligencia artificial puede ayudar a identificar correos
              potencialmente maliciosos.
            </p>
            <div className="landing-hero-actions">
              <Button
                size="lg"
                render={<Link to="/analizar" />}
                className="landing-primary-action"
              >
                Probar el analizador <ArrowRight size={17} />
              </Button>
              <a href="#como-funciona" className="landing-text-link">
                Conoce cómo funciona <ChevronDown size={15} />
              </a>
            </div>
            <p className="landing-demo-caption">
              <span />
              Interfaz de demostración · Sin cuenta para probar
            </p>
          </div>

          <div
            className="landing-preview"
            aria-label="Vista ilustrativa de un correo ficticio"
          >
            <div className="preview-label">
              <Mail size={16} />
              <span>Una mirada más allá del asunto</span>
            </div>
            <article className="preview-mail">
              <div className="preview-mail-heading">
                <span className="preview-avatar">V</span>
                <div>
                  <strong>Verificación de cuenta</strong>
                  <span>Mensaje ficticio de demostración</span>
                </div>
                <span className="preview-time">Ahora</span>
              </div>
              <h2>Tu cuenta requiere atención</h2>
              <p>
                Detectamos un problema con tu cuenta. Para evitar el bloqueo,
                confirma tus datos en las próximas dos horas.
              </p>
              <div className="preview-link">verificacion-cuenta.example</div>
              <p className="preview-signature">Departamento de verificación</p>
            </article>
            <div className="preview-verdict">
              <span className="preview-alert">
                <ShieldAlert size={23} strokeWidth={1.6} />
              </span>
              <div>
                <strong>Potencialmente malicioso</strong>
                <p>Clasificación ilustrativa, no un análisis real.</p>
              </div>
            </div>
            <div className="preview-caption">
              <LockKeyhole size={14} />
              <span>
                El mensaje es el punto de partida. La revisión sigue siendo
                tuya.
              </span>
            </div>
          </div>
        </section>

        <div className="page-width landing-status">
          <FlaskConical size={17} />
          <p>
            <strong>Estamos construyendo la primera versión.</strong> Puedes
            explorar el analizador con ejemplos preparados. La conexión con el
            modelo está pendiente.
          </p>
        </div>

        <section
          id="como-funciona"
          className="page-width landing-process"
          aria-labelledby="process-title"
        >
          <div className="landing-section-heading">
            <h2 id="process-title">
              Del mensaje a una
              <br />
              decisión más informada.
            </h2>
            <p>
              Un flujo sencillo para revisar un correo,
              <br className="hidden sm:block" /> sin perder de vista sus
              limitaciones.
            </p>
          </div>
          <ol className="landing-steps">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <li key={title}>
                <div className="step-top">
                  <span className="step-number">0{index + 1}</span>
                  <Icon size={21} strokeWidth={1.4} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="acerca"
          className="landing-about"
          aria-labelledby="about-title"
        >
          <div className="page-width landing-about-grid">
            <div>
              <span className="landing-section-label">Acerca del proyecto</span>
              <h2 id="about-title">
                Inteligencia artificial
                <br />
                aplicada a un problema
                <br />
                de todos los días.
              </h2>
              <p className="landing-academic">
                Técnicas de Inteligencia Artificial
                <br />
                Proyecto semestral
              </p>
            </div>
            <div className="landing-about-content">
              <p>
                El Sistema inteligente para la detección de correos electrónicos
                maliciosos nace como un proyecto académico para explorar la
                clasificación de mensajes mediante aprendizaje automático.
              </p>
              <p>
                El proyecto utiliza un modelo especializado preentrenado que se
                ejecuta localmente. CEAS_08 sirve como conjunto de evaluación
                para observar su desempeño y revisar los errores, especialmente
                los mensajes maliciosos que pasan inadvertidos.
              </p>
              <div className="about-detail">
                <span>Qué analiza</span>
                <strong>El asunto y el cuerpo del correo</strong>
              </div>
              <div className="about-detail">
                <span>Qué devuelve</span>
                <strong>Clasificación y confianza del modelo</strong>
              </div>
              <a
                href="https://github.com/JCastilloPadilla/email-threat-detector"
                target="_blank"
                rel="noreferrer"
                className="landing-text-link"
              >
                Explorar el proyecto en GitHub <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </section>

        <section
          className="page-width landing-limits"
          aria-labelledby="limits-title"
        >
          <div className="limits-heading">
            <ShieldCheck size={25} strokeWidth={1.4} />
            <h2 id="limits-title">
              Una herramienta de apoyo.
              <br />
              La verificación sigue siendo importante.
            </h2>
          </div>
          <div className="limits-content">
            <p>
              Una clasificación no garantiza que un mensaje sea seguro. El
              modelo puede equivocarse y no inspecciona adjuntos ni verifica la
              reputación de enlaces.
            </p>
            <p>
              En la demostración, el texto permanece en tu navegador. Cuando
              conectemos el modelo, el análisis se realizará en el equipo que
              ejecute la aplicación.
            </p>
          </div>
        </section>

        <section
          className="page-width landing-final-cta"
          aria-labelledby="try-title"
        >
          <div>
            <h2 id="try-title">Dale una segunda mirada.</h2>
            <p>Prueba el flujo con un correo de ejemplo.</p>
          </div>
          <Button
            size="lg"
            render={<Link to="/analizar" />}
            className="landing-final-button"
          >
            Explorar la demostración <ArrowRight size={17} />
          </Button>
        </section>
      </main>

      <footer className="page-width landing-footer">
        <p>Detector de correos · Proyecto académico</p>
        <div>
          <a href="#acerca">Acerca del proyecto</a>
          <a
            href="https://github.com/JCastilloPadilla/email-threat-detector"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
    </div>
  );
}
