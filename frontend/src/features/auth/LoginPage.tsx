import { BrandMark } from "@/components/BrandMark";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CircleHelp,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FadeContent from "@/components/react-bits/FadeContent";
import "./login.css";

export function LoginPage() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    document.title = "Iniciar sesión · Detector de correos";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="login-page">
      <a href="#login-main" className="skip-link">
        Ir al contenido
      </a>
      <header className="site-header">
        <div className="page-width login-nav">
          <Link
            to="/"
            className="login-brand"
            aria-label="Detector de correos, inicio"
          >
            <BrandMark />
            <span>
              Detector de correos
              <span className="login-brand-caption">
                Análisis inteligente de mensajes
              </span>
            </span>
          </Link>
          <Link to="/" className="login-back">
            <ArrowLeft size={15} /> Volver al inicio
          </Link>
        </div>
      </header>

      <main id="login-main" className="page-width login-layout">
        <section className="login-intro" aria-labelledby="login-intro-title">
          <Badge variant="outline" className="login-project-badge">
            Tu espacio de revisión
          </Badge>
          <FadeContent duration={550}>
            <h2 id="login-intro-title">
              Una segunda mirada.
              <br />
              <span>Un mismo lugar.</span>
            </h2>
          </FadeContent>
          <p className="login-intro-copy">
            Estamos preparando un espacio para revisar tus mensajes y volver a
            tus análisis cuando lo necesites.
          </p>
          <div className="login-planned">
            <span className="login-eyebrow">Lo que viene</span>
            <div className="login-planned-row">
              <Mail size={21} strokeWidth={1.5} />
              <div>
                <h2>Tu bandeja, conectada</h2>
                <p>
                  Consulta y analiza mensajes de Gmail cuando autorices la
                  conexión.
                </p>
              </div>
            </div>
            <div className="login-planned-row">
              <ShieldCheck size={21} strokeWidth={1.5} />
              <div>
                <h2>Análisis para consultar después</h2>
                <p>
                  Un historial asociado a tu cuenta para retomar las revisiones.
                </p>
              </div>
            </div>
            <p className="login-planned-note">
              Estas funciones forman parte de una etapa posterior del proyecto.
            </p>
          </div>
        </section>

        <section className="login-access" aria-labelledby="login-title">
          <div className="login-access-heading">
            <span className="login-access-mark">
              <ShieldCheck size={28} strokeWidth={1.5} />
            </span>
            <Badge variant="outline">Maqueta</Badge>
          </div>
          <h1 id="login-title">Iniciar sesión</h1>
          <p className="login-access-copy">
            Usaremos tu cuenta de Google para acceder a las funciones personales
            del proyecto.
          </p>
          <Button
            size="lg"
            className="login-google"
            onClick={() => setShowNotice(true)}
            aria-describedby="login-auth-note"
          >
            <span className="login-google-letter" aria-hidden="true">
              G
            </span>{" "}
            Continuar con Google
          </Button>
          <p id="login-auth-note" className="login-auth-note">
            Inicio de sesión de demostración. Todavía no está conectado con
            Google.
          </p>
          {showNotice && (
            <div className="login-notice" role="status">
              <CircleHelp size={18} />
              <p>
                El acceso con Google estará disponible cuando integremos la
                autenticación. Mientras tanto, puedes explorar el analizador sin
                cuenta.
              </p>
            </div>
          )}
          <div className="login-divider">
            <span />o prueba la herramienta
            <span />
          </div>
          <Button
            variant="outline"
            size="lg"
            render={<Link to="/analizar" />}
            className="login-guest"
          >
            Continuar sin cuenta <ArrowRight size={16} />
          </Button>
          <p className="login-guest-note">
            Puedes probar los ejemplos del analizador sin iniciar sesión.
          </p>
          <Link to="/bandeja" className="login-inbox-link">
            Explorar la bandeja de demostración <ArrowRight size={14} />
          </Link>
          <div className="login-permissions">
            <ShieldCheck size={19} strokeWidth={1.5} />
            <p>
              <strong>Tu cuenta y tu bandeja son pasos distintos.</strong>{" "}
              Iniciar sesión no dará acceso a tus correos. La conexión con Gmail
              requerirá una autorización adicional.
            </p>
          </div>
        </section>
      </main>

      <footer className="page-width login-footer">
        <p>Detector de correos · Proyecto académico</p>
        <Link to="/">
          Conocer el proyecto <ArrowRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
