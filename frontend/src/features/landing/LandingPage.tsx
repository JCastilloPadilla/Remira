import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  FileText,
  Mail,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import SplitText from "@/components/react-bits/SplitText";
import TechText from "@/components/react-bits/TechText";
import "./landing.css";

const steps = [
  {
    title: "El mensaje llega",
    description: "Copia el asunto y el cuerpo del correo que quieres revisar. No necesitas abrir sus enlaces.",
    icon: FileText,
  },
  {
    title: "Le damos otra mirada",
    description: "Consulta la clasificación y la confianza del modelo. Son una pista para orientar tu revisión.",
    icon: ScanLine,
  },
  {
    title: "Tú decides el siguiente paso",
    description: "Verifica el remitente y el contexto antes de responder, compartir datos o hacer clic.",
    icon: ShieldCheck,
  },
];

const repositoryUrl = "https://github.com/JCastilloPadilla/email-threat-detector";

export function LandingPage() {
  useEffect(() => {
    document.title = "Detector de correos · Una segunda mirada a tus mensajes";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="landing-page">
      <a href="#landing-main" className="skip-link">Ir al contenido</a>
      <header className="site-header">
        <div className="page-width landing-nav">
          <Link to="/" className="landing-brand" aria-label="Detector de correos, inicio">
            <BrandMark />
            <span>
              Detector de correos
              <span className="landing-brand-caption">Una segunda mirada a tus mensajes</span>
            </span>
          </Link>
          <nav aria-label="Navegación principal" className="landing-nav-links">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#acerca">El proyecto</a>
            <Link to="/login" className="landing-login-link">Iniciar sesión</Link>
            <Button render={<Link to="/analizar" />} className="landing-nav-cta">
              Abrir analizador <ArrowUpRight size={15} />
            </Button>
          </nav>
        </div>
      </header>

      <main id="landing-main">
        <section className="landing-hero" aria-labelledby="landing-title">
          <div className="page-width landing-hero-copy">
            <h1 id="landing-title">
              <SplitText
                text="Antes de hacer clic, dale una segunda mirada."
                tag="span"
                splitType="words"
                delay={45}
                duration={0.7}
                rootMargin="0px"
              />
            </h1>
            <p className="landing-lead">
              Una segunda mirada al contenido de tus correos para ayudarte
              a reconocer mensajes potencialmente maliciosos.
            </p>
            <div className="landing-hero-actions">
              <Button size="lg" render={<Link to="/analizar" />} className="landing-primary-action">
                Probar el analizador <ArrowRight size={17} />
              </Button>
              <a href="#como-funciona" className="landing-text-link">
                Descubre cómo funciona <ChevronDown size={15} />
              </a>
            </div>
          </div>
          <div className="landing-hero-art">
            <img
              src="/illustrations/correspondence-hero-v1.webp"
              alt=""
              aria-hidden="true"
              width={2172}
              height={724}
              fetchPriority="high"
            />
          </div>
          <div className="landing-hero-note">
            <Mail size={16} /> Cada mensaje cuenta una historia. Conviene leerla con atención.
          </div>
        </section>

        <div className="landing-story">
          <section id="como-funciona" className="page-width landing-process" aria-labelledby="process-title">
            <div className="landing-section-heading">
              <div>
                <span className="landing-section-label">Un pequeño hábito, una mejor revisión</span>
                <h2 id="process-title">Del correo a una<br />decisión más informada.</h2>
              </div>
              <p>Tres pasos para mirar más allá del asunto<br className="hidden sm:block" /> y entender mejor el mensaje.</p>
            </div>
            <ol className="landing-steps">
              {steps.map(({ title, description, icon: Icon }, index) => (
                <li key={title}>
                  <div className="step-illustration" aria-hidden="true">
                    <span className="step-number">0{index + 1}</span>
                    <span className="step-stamp"><Icon size={46} strokeWidth={1.2} /></span>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="landing-demo-section" aria-labelledby="demo-title">
            <div className="page-width landing-tech-stage">
              <h2 id="demo-title" className="landing-tech-heading">
                <span className="landing-tech-fallback">Mira más allá.</span>
                <span className="landing-tech-effect" aria-hidden="true">
                  <TechText
                    text="Mira más allá."
                    fontFamily=""
                    fontSize={150}
                    fontWeight={600}
                    letterSpacing={-0.05}
                    color="#ffffff"
                    accentColor="#ffffff"
                    reach={200}
                    softness={0.7}
                    reveal="letter"
                    lineStyle="dashed"
                    dashLength={4}
                    dashGap={2}
                    strokeWidth={1.5}
                    speed={1}
                    specks={15}
                    selection
                    labels
                    draggable
                    sweep
                  />
                </span>
              </h2>
            </div>
            <div className="page-width landing-demo-grid">
              <div className="landing-demo-copy">
                <span className="landing-section-label">Una pausa antes del clic</span>
                <p>
                  Lo urgente no siempre es lo que parece. Un remitente familiar,
                  una petición inesperada, un plazo demasiado corto.
                  El contenido de un correo puede darte razones para detenerte y verificar.
                </p>
                <p>
                  Conoce cómo se presenta la clasificación de un correo. Este ejemplo
                  ficticio muestra una petición que conviene revisar antes de actuar.
                </p>
                <Button render={<Link to="/analizar" />} className="landing-primary-action">
                  Probar el analizador <ArrowRight size={17} />
                </Button>
                <span className="landing-handnote">Un momento para mirar mejor.</span>
              </div>
              <AnimatedContent distance={28} duration={0.65} className="landing-preview-wrap">
                <div className="landing-preview" aria-label="Ejemplo ficticio de un correo y su clasificación">
                  <div className="preview-label">
                    <Mail size={17} /> <span>Un correo bajo la lupa</span>
                    <span className="preview-example">Ejemplo</span>
                  </div>
                  <article className="preview-mail">
                    <div className="preview-mail-heading">
                      <span className="preview-avatar">V</span>
                      <div>
                        <strong>Verificación de cuenta</strong>
                        <span>Correo de ejemplo</span>
                      </div>
                    </div>
                    <h3>Tu cuenta requiere atención</h3>
                    <p>
                      Detectamos un problema con tu cuenta. Para evitar el bloqueo,
                      confirma tus datos en las próximas dos horas.
                    </p>
                    <div className="preview-link">verificacion-cuenta.example</div>
                    <p className="preview-signature">Departamento de verificación</p>
                  </article>
                  <div className="preview-verdict">
                    <ShieldAlert size={24} strokeWidth={1.5} />
                    <div>
                      <strong>Potencialmente malicioso</strong>
                      <p>Resultado de ejemplo</p>
                    </div>
                  </div>
                  <div className="preview-caption">
                    <Mail size={15} />
                    <span>Revisa el remitente antes de responder.</span>
                  </div>
                </div>
              </AnimatedContent>
            </div>
          </section>

          <section id="acerca" className="landing-about" aria-labelledby="about-title">
            <div className="page-width landing-about-grid">
              <div>
                <span className="landing-section-label">La idea detrás del proyecto</span>
                <h2 id="about-title">Aprender de los mensajes.<br />También de los errores.</h2>
                <p className="landing-academic">Técnicas de Inteligencia Artificial<br />Proyecto semestral</p>
              </div>
              <div className="landing-about-content">
                <p>
                  El Sistema inteligente para la detección de correos electrónicos
                  maliciosos nace como un proyecto académico para explorar la
                  clasificación de mensajes mediante aprendizaje automático.
                </p>
                <p>
                  Utilizamos un modelo especializado preentrenado que se ejecuta
                  localmente. Con el conjunto de evaluación CEAS_08 observamos su
                  desempeño y estudiamos sus errores, especialmente los mensajes
                  maliciosos que pasan inadvertidos.
                </p>
                <dl className="landing-about-details">
                  <div><dt>Qué analiza</dt><dd>Asunto y cuerpo del correo</dd></div>
                  <div><dt>Qué devuelve</dt><dd>Clasificación y confianza</dd></div>
                </dl>
                <a href={repositoryUrl} target="_blank" rel="noreferrer" className="landing-text-link">
                  Explorar el proyecto en GitHub <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </section>

          <section className="page-width landing-limits" aria-labelledby="limits-title">
            <div className="limits-heading">
              <ShieldCheck size={28} strokeWidth={1.3} />
              <h2 id="limits-title">Una pista útil.<br />La última palabra es tuya.</h2>
            </div>
            <div className="limits-content">
              <p>
                Una clasificación no garantiza que un mensaje sea seguro. El modelo
                puede equivocarse y no inspecciona adjuntos ni verifica la reputación
                de los enlaces. Comprueba el remitente y evita compartir datos sensibles.
              </p>
              <Link to="/como-funciona" className="landing-text-link">
                Conocer los alcances y las limitaciones <ArrowUpRight size={15} />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <div className="landing-footer-transition" aria-hidden="true" />
      <footer className="landing-footer">
        <section className="landing-final-cta" aria-labelledby="try-title">
          <div className="page-width landing-final-copy">
            <h2 id="try-title">Dale una segunda mirada.</h2>
            <p>Empieza con un correo de ejemplo y conoce el recorrido.</p>
            <Button size="lg" render={<Link to="/analizar" />} className="landing-final-button">
              Probar el analizador <ArrowRight size={17} />
            </Button>
          </div>
        </section>
        <img
          className="landing-footer-art"
          src="/illustrations/correspondence-footer-v1.webp"
          alt=""
          aria-hidden="true"
          width={2172}
          height={724}
          loading="lazy"
          decoding="async"
        />
        <div className="page-width landing-footer-links">
          <div className="landing-footer-brand">
            <BrandMark />
            <p>Detector de correos<span>Hecho para mirar con más atención.</span></p>
          </div>
          <nav aria-label="Navegación del pie de página">
            <Link to="/analizar">Analizador</Link>
            <a href="#acerca">El proyecto</a>
            <Link to="/como-funciona">Ayuda</Link>
            <a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
          </nav>
        </div>
        <div className="page-width landing-footer-bottom">
          <p>Una segunda mirada a tus mensajes</p>
          <a href="#landing-main">Volver al inicio ↑</a>
        </div>
      </footer>
    </div>
  );
}
