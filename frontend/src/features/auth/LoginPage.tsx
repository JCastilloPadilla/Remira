import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CircleHelp, ShieldCheck } from "lucide-react";
import { IllustratedFooter } from "@/components/IllustratedFooter";
import SplitText from "@/components/react-bits/SplitText";
import { CorrespondenceBackdrop } from "@/features/landing/CorrespondenceBackdrop";
import { Button } from "@/components/ui/button";
import "./login.css";

export function LoginPage() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    document.title = "Iniciar sesión · Remira";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="login-page">
      <a href="#login-main" className="skip-link">Ir al contenido</a>
      <SiteHeader />

      <main id="login-main" className="login-main">
        <CorrespondenceBackdrop />
        <div className="page-width login-layout">
          <section className="login-intro" aria-labelledby="login-intro-title">
            <p className="login-eyebrow">Un lugar para volver a mirar</p>
            <h1 id="login-intro-title">
              <SplitText
                text="Tu espacio para mirar mejor."
                tag="span"
                textAlign="left"
                splitType="words"
                delay={45}
                duration={0.7}
                rootMargin="0px"
              />
            </h1>
            <p className="login-intro-copy">
              Entra a tu ritmo. También puedes empezar con un correo de ejemplo,
              sin crear una cuenta.
            </p>
            <img
              className="login-welcome-art"
              src="/illustrations/login-welcome-v1.webp"
              width="768" height="512" alt=""
            />
          </section>

          <section className="login-access" aria-labelledby="login-title">
            <div className="login-access-heading">
              <span className="login-access-mark" aria-hidden="true">
                <ShieldCheck size={26} strokeWidth={1.4} />
              </span>
              <span className="login-demo-label">Demostración</span>
            </div>
            <h2 id="login-title">Bienvenido a Remira.</h2>
            <p className="login-access-copy">
              Elige cómo quieres empezar.
            </p>
            <Button
              size="lg"
              className="login-google"
              onClick={() => setShowNotice(true)}
              aria-describedby="login-auth-note"
            >
              <span className="login-google-letter" aria-hidden="true">G</span>
              Continuar con Google
            </Button>
            <p id="login-auth-note" className="login-auth-note">
              Acceso de demostración. No se inicia una sesión real con Google.
            </p>
            {showNotice && (
              <div className="login-notice" role="status">
                <CircleHelp size={18} aria-hidden="true" />
                <p>
                  Esta demostración no autentica tu cuenta ni solicita permisos.
                  Puedes explorar el analizador con la opción sin cuenta.
                </p>
              </div>
            )}
            <div className="login-divider"><span />o empieza sin cuenta<span /></div>
            <Button
              variant="outline"
              size="lg"
              render={<Link to="/analizar" />}
              className="login-guest"
            >
              Continuar sin cuenta <ArrowRight size={16} />
            </Button>
            <p className="login-guest-note">
              Prueba los ejemplos del analizador sin iniciar sesión.
            </p>
            <Link to="/bandeja" className="login-inbox-link">
              Explorar la bandeja de demostración <ArrowRight size={14} />
            </Link>
            <div className="login-permissions">
              <ShieldCheck size={19} strokeWidth={1.5} aria-hidden="true" />
              <p>
                <strong>Tu identidad y tu correo, por separado.</strong>
                Iniciar sesión no autoriza la lectura de mensajes. La conexión
                con Gmail requiere un permiso adicional.
              </p>
            </div>
          </section>
        </div>
      </main>
      <div className="login-footer-transition" aria-hidden="true" />
      <IllustratedFooter topHref="#login-main" />
    </div>
  );
}
