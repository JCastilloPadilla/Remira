import { SiteHeader } from "@/components/SiteHeader";
import SplitText from "@/components/react-bits/SplitText";
import { IllustratedFooter } from "@/components/IllustratedFooter";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HelpBackdrop } from "./HelpBackdrop";
import "./help.css";

const questions = [
  {
    question: "¿Necesito iniciar sesión para probar el analizador?",
    answer: "No. Puedes abrir el analizador y cargar los ejemplos sin cuenta. En la demostración no se realiza una autenticación real con Google.",
  },
  {
    question: "¿Por qué no obtengo un resultado al pegar mi propio correo?",
    answer: "La demostración ofrece resultados preparados para dos ejemplos ficticios. Los mensajes propios no se envían al modelo y no reciben una clasificación.",
  },
  {
    question: "¿Se guardan mis análisis en el historial?",
    answer: "El historial de la demostración muestra registros ficticios. No guarda los mensajes que introduces ni recibe los análisis del formulario o de la bandeja.",
  },
  {
    question: "¿Conectar Gmail o desconectar el ejemplo modifica mi cuenta?",
    answer: "No. La conexión de ejemplo es ficticia. No se solicitan ni se revocan permisos reales de Google, y Remira no accede a tus mensajes de Gmail en esta demostración.",
  },
  {
    question: "¿Qué ocurre si edito el mensaje o recargo la página?",
    answer: "Editar el correo invalida su resultado anterior. Recargar o abandonar el analizador reinicia el borrador. Abrir y cerrar su ayuda breve conserva lo escrito; el enlace a esta página abre una pestaña nueva para mantener ese borrador.",
  },
];

export function HelpPage() {
  useEffect(() => {
    document.title = "Ayuda y cómo funciona · Remira";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="help-page">
      <svg className="help-color-filters" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="help-paper-desktop" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1.001725 0 0 0 -0.000129 0 0.993648 0 0 0.001096 0 0 0.998204 0 0.000542 0 0 0 1 0" />
          </filter>
          <filter id="help-paper-mobile" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.997235 0 0 0 0.000206 0 0.989408 0 0 0.001828 0 0 0.992436 0 0.002284 0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
      <HelpBackdrop />
      <a href="#help-main" className="skip-link">
        Ir al contenido
      </a>
      <SiteHeader />
      <main id="help-main" className="help-main">
        <section className="help-hero" aria-labelledby="help-title">
          <div className="page-width help-heading">
            <span className="help-eyebrow">Una guía para mirar mejor</span>
            <h1 id="help-title">
              <SplitText text="Una segunda mirada, con el contexto necesario." tag="span" splitType="words" delay={45} duration={0.7} rootMargin="0px" />
            </h1>
            <p>
              Aprende a usar la demostración y a interpretar sus resultados sin
              perder de vista sus límites.
            </p>
            <a href="#primeros-pasos" className="help-text-link">Empieza por aquí <ChevronDown size={16} /></a>
          </div>
          <figure className="help-hero-illustration">
            <picture>
              <source media="(max-width: 767px) and (orientation: portrait)" srcSet="/illustrations/guide-panorama-mobile-v2.webp" width={1024} height={1536} />
              <img src="/illustrations/guide-panorama-v3.webp" alt="" width={2170} height={725} fetchPriority="high" />
            </picture>
            <figcaption>La mejor pista empieza por leer con atención.</figcaption>
          </figure>
        </section>
        <div className="page-width help-reading">
          <div className="help-demo-note">
            <CircleHelp size={18} />
            <p>
              <strong>Prueba con un ejemplo.</strong> La demostración utiliza mensajes y resultados ficticios.
              No accede a Gmail ni clasifica tus correos personales.
            </p>
          </div>
          <div className="help-article">
            <section id="primeros-pasos" aria-labelledby="help-steps-title">
              <span className="help-section-number"><span>01</span> Primeros pasos</span>
              <h2 id="help-steps-title">Del correo al resultado.</h2>
              <ol className="help-steps">
                <li>
                  <strong>Introduce el mensaje</strong>
                  <p>
                    El asunto es opcional. El cuerpo es obligatorio y no puede
                    estar vacío ni contener solo espacios. También puedes cargar
                    uno de los dos ejemplos ficticios.
                  </p>
                </li>
                <li>
                  <strong>Analiza el ejemplo</strong>
                  <p>
                    Usa Analizar correo y espera el resultado. Si cargas otro
                    ejemplo sobre un mensaje escrito, la herramienta solicita
                    confirmación antes de reemplazarlo.
                  </p>
                </li>
                <li>
                  <strong>Revisa la clasificación</strong>
                  <p>
                    El resultado aparece junto al formulario. Editar el
                    contenido invalida la clasificación anterior; Limpiar o
                    Nuevo análisis solicita confirmación cuando hay contenido.
                  </p>
                </li>
              </ol>
              <Button render={<Link to="/analizar" />}>
                Probar el analizador <ArrowRight size={16} />
              </Button>
            </section>
            <section id="resultados" aria-labelledby="help-results-title">
              <span className="help-section-number"><span>02</span> Interpretación</span>
              <h2 id="help-results-title">Qué significa cada resultado.</h2>
              <div className="help-classification">
                <ShieldCheck size={23} />
                <div>
                  <h3>Clasificado como legítimo</h3>
                  <p>
                    El clasificador asigna el mensaje a la categoría legítima.
                    No garantiza que sea seguro; revisa el remitente y el
                    contexto antes de actuar.
                  </p>
                </div>
              </div>
              <div className="help-classification malicious">
                <ShieldAlert size={23} />
                <div>
                  <h3>Potencialmente malicioso</h3>
                  <p>
                    El clasificador asigna el mensaje a la categoría maliciosa.
                    Verifica el remitente por otro medio antes de abrir enlaces
                    o compartir información.
                  </p>
                </div>
              </div>
              <h3 className="help-subtitle">
                La confianza no es una garantía.
              </h3>
              <p>
                La confianza es la puntuación que devuelve el modelo para su
                clasificación. No equivale a una probabilidad comprobada de que
                el correo sea seguro. Los porcentajes visibles en la demostración
                son valores preparados, identificados como demostración.
              </p>
            </section>
            <section id="privacidad" aria-labelledby="help-privacy-title">
              <img className="help-chapter-illustration" src="/illustrations/guide-private-letter-v1.webp" alt="" width={500} height={375} loading="lazy" />
              <span className="help-section-number"><span>03</span> Datos y acceso</span>
              <h2 id="help-privacy-title">Qué ocurre con tu información.</h2>
              <p>
                En esta versión, el texto introducido y los estados de
                demostración permanecen en memoria del navegador. No se envían a
                una API ni se guardan de forma persistente; recargar o salir de
                una pantalla reinicia sus datos.
              </p>
              <p>
                El uso desde otro dispositivo no cambia este comportamiento:
                el contenido del formulario no se transmite a un servicio de análisis.
              </p>
              <h3 className="help-subtitle">
                Google y Gmail son pasos separados.
              </h3>
              <p>
                Identificarse con Google y autorizar la lectura de Gmail son
                permisos distintos. En la demostración, la bandeja, el
                historial y la conexión de ejemplo contienen únicamente
                información ficticia.
              </p>
              <Link className="help-text-link" to="/cuenta">
                Explorar cuenta y conexiones <ArrowRight size={14} />
              </Link>
            </section>
            <section id="limites" aria-labelledby="help-limits-title">
              <span className="help-section-number"><span>04</span> Alcance</span>
              <h2 id="help-limits-title">Una herramienta de apoyo.</h2>
              <ul className="help-limits">
                <li>
                  El análisis usa asunto y cuerpo como texto. No inspecciona
                  adjuntos ni verifica la reputación de enlaces.
                </li>
                <li>
                  El clasificador local está configurado con un máximo de 512
                  tokens y recorta entradas largas. Los tokens no equivalen a
                  caracteres; parte de un correo extenso puede quedar fuera del
                  análisis.
                </li>
                <li>
                  Puede marcar un mensaje legítimo como malicioso o pasar por
                  alto uno malicioso. La confianza tampoco elimina esos errores.
                </li>
                <li>
                  La clasificación no explica por sí sola qué parte concreta del
                  mensaje originó el resultado.
                </li>
              </ul>
              <p>
                La evaluación académica con CEAS_08 ayuda a revisar el desempeño
                y los errores del modelo; no garantiza precisión para cualquier
                correo.
              </p>
            </section>
            <section id="preguntas" aria-labelledby="help-faq-title">
              <img className="help-question-envelope" src="/illustrations/journey-envelope-v1.webp" alt="" width={240} height={128} loading="lazy" />
              <span className="help-section-number"><span>05</span> Dudas habituales</span>
              <h2 id="help-faq-title">Preguntas frecuentes.</h2>
              <div className="help-faq">
                {questions.map(({ question, answer }) => (
                  <details key={question}>
                    <summary>
                      {question}
                      <ChevronDown size={16} aria-hidden="true" />
                    </summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <div className="help-footer-transition" aria-hidden="true" />
      <IllustratedFooter topHref="#help-main" />
    </div>
  );
}
