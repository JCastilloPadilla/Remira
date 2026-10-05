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
import { Badge } from "@/components/ui/badge";
import FadeContent from "@/components/react-bits/FadeContent";
import "./help.css";

const sections = [
  { id: "primeros-pasos", title: "Primeros pasos" },
  { id: "resultados", title: "Entender el resultado" },
  { id: "privacidad", title: "Privacidad y conexiones" },
  { id: "limites", title: "Límites del análisis" },
  { id: "preguntas", title: "Preguntas frecuentes" },
];
const questions = [
  {
    question: "¿Necesito iniciar sesión para probar el analizador?",
    answer:
      "No. Puedes abrir el analizador y cargar los ejemplos sin cuenta. El login está maquetado, pero la autenticación con Google todavía no está conectada.",
  },
  {
    question: "¿Por qué no obtengo un resultado al pegar mi propio correo?",
    answer:
      "El modelo aún no está conectado a la web. Solo los dos ejemplos exactos tienen respuestas preparadas. El texto libre muestra un aviso de integración pendiente, sin inventar una clasificación.",
  },
  {
    question: "¿Se guardan mis análisis en el historial?",
    answer:
      "Todavía no. El historial muestra registros ficticios y no recibe los análisis del formulario ni de la bandeja. El almacenamiento real sigue pendiente.",
  },
  {
    question: "¿Conectar Gmail o desconectar el ejemplo modifica mi cuenta?",
    answer:
      "No. Los botones actuales explican la integración pendiente o cambian un estado ficticio dentro de la maqueta. No se solicitan ni se revocan permisos reales de Google.",
  },
  {
    question: "¿Qué ocurre si edito el mensaje o recargo la página?",
    answer:
      "Editar el correo invalida su resultado anterior. Recargar o abandonar el analizador reinicia el borrador. Abrir y cerrar su ayuda breve conserva lo escrito; el enlace a esta página abre una pestaña nueva para mantener ese borrador.",
  },
];

export function HelpPage() {
  useEffect(() => {
    document.title = "Ayuda y cómo funciona · Detector de correos";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="help-page">
      <a href="#help-main" className="skip-link">
        Ir al contenido
      </a>
      <header className="site-header">
        <div className="page-width help-nav">
          <Link
            to="/"
            className="help-brand"
            aria-label="Detector de correos, inicio"
          >
            <span className="brand-mark">
              <ShieldCheck size={23} strokeWidth={1.7} />
            </span>
            <span>
              Detector de correos
              <span className="help-brand-caption">
                Análisis inteligente de mensajes
              </span>
            </span>
          </Link>
          <nav aria-label="Navegación principal">
            <Link to="/analizar">Analizar correo</Link>
            <Link to="/bandeja">Bandeja de Gmail</Link>
            <Link to="/historial">Historial</Link>
            <Link to="/cuenta">Cuenta</Link>
            <Link to="/como-funciona" aria-current="page">
              Ayuda
            </Link>
          </nav>
        </div>
      </header>
      <main id="help-main" className="page-width help-main">
        <div className="help-heading">
          <Badge variant="outline">
            <CircleHelp size={13} /> Ayuda y cómo funciona
          </Badge>
          <FadeContent duration={450}>
            <h1>
              Una segunda mirada,
              <br />
              <span>con el contexto necesario.</span>
            </h1>
          </FadeContent>
          <p>
            Aprende a usar la demostración y a interpretar sus resultados sin
            perder de vista sus límites.
          </p>
        </div>
        <div className="help-demo-note">
          <CircleHelp size={18} />
          <p>
            <strong>Estás explorando una maqueta.</strong> El modelo, la
            autenticación, Gmail y el almacenamiento todavía no están conectados
            a la interfaz.
          </p>
        </div>
        <div className="help-layout">
          <nav className="help-contents" aria-label="En esta página">
            <span>En esta página</span>
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
          <div className="help-article">
            <section id="primeros-pasos" aria-labelledby="help-steps-title">
              <span className="help-section-number">01 · Uso</span>
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
              <span className="help-section-number">02 · Interpretación</span>
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
                el correo sea seguro. Los porcentajes visibles en esta maqueta
                son valores preparados, identificados como demostración.
              </p>
            </section>
            <section id="privacidad" aria-labelledby="help-privacy-title">
              <span className="help-section-number">03 · Datos y acceso</span>
              <h2 id="help-privacy-title">Qué ocurre con tu información.</h2>
              <p>
                En esta versión, el texto introducido y los estados de
                demostración permanecen en memoria del navegador. No se envían a
                una API ni se guardan de forma persistente; recargar o salir de
                una pantalla reinicia sus datos.
              </p>
              <p>
                Cuando conectemos el modelo, el análisis se ejecutará en el
                equipo que aloje la aplicación. Si accedes desde otro
                dispositivo, el texto deberá viajar a ese equipo. El tratamiento
                y la conservación de datos del servicio deberán definirse antes
                de esa integración.
              </p>
              <h3 className="help-subtitle">
                Google y Gmail son pasos separados.
              </h3>
              <p>
                Iniciar sesión identificará tu cuenta. Leer mensajes de Gmail
                requerirá una autorización adicional. Actualmente la bandeja, el
                historial y la conexión de ejemplo contienen únicamente
                información ficticia.
              </p>
              <Link className="help-text-link" to="/cuenta">
                Explorar cuenta y conexiones <ArrowRight size={14} />
              </Link>
            </section>
            <section id="limites" aria-labelledby="help-limits-title">
              <span className="help-section-number">04 · Alcance</span>
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
              <span className="help-section-number">05 · Dudas habituales</span>
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
            <div className="help-final">
              <h2>Ya puedes explorar el flujo.</h2>
              <p>Empieza con un ejemplo y consulta cómo cambia el resultado.</p>
              <Button render={<Link to="/analizar" />}>
                Analizar un correo <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <footer className="page-width help-footer">
        <p>Detector de correos · Proyecto académico</p>
        <Link to="/">
          Conocer el proyecto <ArrowRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
