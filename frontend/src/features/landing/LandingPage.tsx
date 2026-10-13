import { SiteHeader } from "@/components/SiteHeader";
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
import { IllustratedFooter } from "@/components/IllustratedFooter";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import SplitText from "@/components/react-bits/SplitText";
import TechText from "@/components/react-bits/TechText";
import { CorrespondenceBackdrop } from "./CorrespondenceBackdrop";
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
    document.title = "Remira · Una segunda mirada a tus mensajes";
    const section = ["#acerca", "#como-funciona"].includes(window.location.hash)
      ? document.getElementById(window.location.hash.slice(1)) : null;
    if (section) section.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="landing-page">
      <svg className="landing-color-filters" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          {/* Match each image's paper to #f7f8f6 while anchoring the navy ink tone. */}
          <filter id="remira-paper-desktop" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1.00885 0 0 0 -0.000659  0 1.004926 0 0 -0.00085  0 0 1.018072 0 -0.005457  0 0 0 1 0" />
          </filter>
          <filter id="remira-paper-mobile" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.987013 0 0 0 0.000968  0 1 0 0 0  0 0 1.05625 0 -0.016985  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
      <a href="#landing-main" className="skip-link">Ir al contenido</a>
      <SiteHeader />

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
            <picture>
              <source
                media="(max-width: 767px) and (orientation: portrait)"
                srcSet="/illustrations/correspondence-hero-mobile-v1.webp"
                width={1024}
                height={1536}
              />
              <img
                src="/illustrations/correspondence-hero-v2.webp"
                alt=""
                aria-hidden="true"
                width={2172}
                height={724}
                fetchPriority="high"
              />
            </picture>
          </div>
        </section>
        <div className="landing-hero-note">
          <Mail size={16} /> Cada mensaje cuenta una historia. Conviene leerla con atención.
        </div>

        <div className="landing-story">
          <CorrespondenceBackdrop />
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
                    speed={0.5}
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
                <figure className="landing-preview" aria-label="Ejemplo ficticio de un correo y su clasificación">
                  <figcaption className="preview-label">
                    <Mail size={17} /> <span>Un correo bajo la lupa</span>
                    <span className="preview-example">Ejemplo ficticio</span>
                  </figcaption>
                  <article className="preview-mail">
                    <div className="preview-mail-heading">
                      <div>
                        <span>Remitente</span>
                        <strong>Departamento de verificación</strong>
                      </div>
                    </div>
                    <h3>Tu cuenta requiere atención</h3>
                    <p>
                      Detectamos un problema con tu cuenta. Para evitar el bloqueo,{' '}
                      <mark>confirma tus datos en las próximas dos horas.</mark>
                    </p>
                    <div className="preview-link">verificacion-cuenta.example</div>
                    <p className="preview-annotation">Una petición urgente de datos merece otra mirada.</p>
                    <div className="preview-verdict">
                      <ShieldAlert size={20} strokeWidth={1.5} />
                      <div>
                        <strong>Potencialmente malicioso</strong>
                        <p>Resultado de ejemplo</p>
                      </div>
                    </div>
                  </article>
                  <div className="preview-caption">
                    <Mail size={15} />
                    <span>Revisa el remitente antes de responder.</span>
                  </div>
                </figure>
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
                  Remira nace como un proyecto académico para explorar la
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
      <IllustratedFooter topHref="#landing-main" projectHref="#acerca" />
    </div>
  );
}
