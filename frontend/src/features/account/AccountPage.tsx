import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CircleHelp,
  Link2,
  Mail,
  ShieldCheck,
  Unplug,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FadeContent from "@/components/react-bits/FadeContent";
import "./account.css";

export function AccountPage() {
  const [connectedExample, setConnectedExample] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = "Cuenta y conexiones · Detector de correos";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="account-page">
      <a href="#account-main" className="skip-link">
        Ir al contenido
      </a>
      <header className="site-header">
        <div className="page-width account-nav">
          <Link
            to="/"
            className="account-brand"
            aria-label="Detector de correos, inicio"
          >
            <span className="brand-mark">
              <ShieldCheck size={23} strokeWidth={1.7} />
            </span>
            <span>
              Detector de correos
              <span className="account-brand-caption">
                Análisis inteligente de mensajes
              </span>
            </span>
          </Link>
          <nav aria-label="Navegación principal">
            <Link to="/analizar">Analizar correo</Link>
            <Link to="/bandeja">Bandeja de Gmail</Link>
            <Link to="/historial">Historial</Link>
            <Link to="/cuenta" aria-current="page">
              Cuenta
            </Link>
            <Link to="/como-funciona">Ayuda</Link>
          </nav>
        </div>
      </header>
      <main id="account-main" className="page-width account-main">
        <div className="account-heading">
          <Badge variant="outline">Demostración</Badge>
          <h1>Tu cuenta. Tus conexiones.</h1>
          <p>
            Un lugar para consultar el acceso al proyecto y la conexión de tu
            correo.
          </p>
        </div>
        <div className="account-demo-note">
          <ShieldCheck size={18} />
          <p>
            <strong>No hay una sesión ni una conexión real.</strong> Esta
            pantalla muestra el flujo previsto; no solicita permisos ni modifica
            tu cuenta de Google.
          </p>
        </div>

        <div className="account-layout">
          <div className="account-settings">
            <section
              className="account-section"
              aria-labelledby="account-access-title"
            >
              <div className="account-section-heading">
                <span className="account-section-icon">
                  <UserRound size={22} strokeWidth={1.5} />
                </span>
                <div>
                  <h2 id="account-access-title">Acceso a la cuenta</h2>
                  <p>La identidad con la que entrarás al proyecto.</p>
                </div>
                <Badge variant="outline">Sin sesión</Badge>
              </div>
              <div className="account-access-body">
                <h3>Continúas como visitante.</h3>
                <p>
                  Puedes explorar el análisis manual sin cuenta. El acceso con
                  Google estará disponible al integrar la autenticación.
                </p>
                <Button render={<Link to="/login" />}>
                  Ver inicio de sesión <ArrowRight size={16} />
                </Button>
              </div>
            </section>

            <section
              className="account-section"
              aria-labelledby="account-gmail-title"
            >
              <div className="account-section-heading">
                <span className="account-section-icon">
                  <Mail size={22} strokeWidth={1.5} />
                </span>
                <div>
                  <h2 id="account-gmail-title">Conexión con Gmail</h2>
                  <p>El acceso a tus mensajes se autorizará por separado.</p>
                </div>
                <Badge variant="outline">
                  {connectedExample ? "Conexión ficticia" : "Sin conectar"}
                </Badge>
              </div>
              <FadeContent duration={300} key={String(connectedExample)}>
                <div className="account-connection-body">
                  {connectedExample ? (
                    <>
                      <div className="account-example-identity">
                        <span>
                          <UserRound size={20} />
                        </span>
                        <div>
                          <strong>Cuenta de ejemplo</strong>
                          <p>persona@correo.example</p>
                        </div>
                      </div>
                      <p>
                        Este estado ilustra cómo se verá una cuenta conectada.
                        No hay un permiso de Google ni mensajes reales
                        asociados.
                      </p>
                      <dl className="account-connection-data">
                        <div>
                          <dt>Proveedor</dt>
                          <dd>Gmail · Ejemplo</dd>
                        </div>
                        <div>
                          <dt>Autorización</dt>
                          <dd>Simulada, sin permisos reales</dd>
                        </div>
                      </dl>
                      <div className="account-actions">
                        <Button
                          variant="outline"
                          render={<Link to="/bandeja" />}
                        >
                          Ver bandeja ficticia <ArrowRight size={15} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                variant="ghost"
                                className="account-disconnect"
                              />
                            }
                          >
                            <Unplug size={15} /> Desconectar ejemplo
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Restablecer la conexión de ejemplo?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                La maqueta volverá al estado Sin conectar. No se
                                revocan permisos ni se borra información de una
                                cuenta real.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  setConnectedExample(false);
                                  setNotice(
                                    "La conexión ficticia se restableció. No se modificó ninguna cuenta real.",
                                  );
                                }}
                              >
                                Desconectar ejemplo
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>Tu correo todavía no está conectado.</h3>
                      <p>
                        La conexión permitirá consultar mensajes desde la
                        bandeja cuando integremos Gmail. Iniciar sesión no dará
                        acceso automático a tus correos.
                      </p>
                      <div className="account-actions">
                        <Dialog>
                          <DialogTrigger render={<Button />}>
                            <Link2 size={16} /> Conectar Gmail
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                La conexión con Gmail está pendiente
                              </DialogTitle>
                              <DialogDescription>
                                Esta versión no inicia OAuth ni solicita acceso
                                a tus correos.
                              </DialogDescription>
                            </DialogHeader>
                            <p className="text-sm leading-7 text-muted-foreground">
                              En el flujo previsto, primero iniciarás sesión y
                              después autorizarás la conexión con Gmail. Por
                              ahora puedes explorar una conexión ficticia desde
                              esta pantalla.
                            </p>
                            <Button render={<Link to="/login" />}>
                              Ver inicio de sesión <ArrowRight size={16} />
                            </Button>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setConnectedExample(true);
                            setNotice(
                              "Se muestra una conexión ficticia. No se concedió acceso a Gmail.",
                            );
                          }}
                        >
                          Mostrar conexión ficticia
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </FadeContent>
            </section>
            <p className="account-status" role="status">
              {notice}
            </p>
          </div>

          <aside
            className="account-explanation"
            aria-labelledby="account-permissions-title"
          >
            <CircleHelp size={24} strokeWidth={1.5} />
            <h2 id="account-permissions-title">Dos decisiones distintas.</h2>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <h3>Iniciar sesión</h3>
                  <p>
                    Identifica tu cuenta para las funciones personales del
                    proyecto.
                  </p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Conectar Gmail</h3>
                  <p>
                    Requiere una autorización adicional para consultar los
                    mensajes.
                  </p>
                </div>
              </li>
            </ol>
            <div className="account-privacy-note">
              <ShieldCheck size={19} />
              <p>
                Los ejemplos viven en memoria del navegador. Recargar o salir
                reinicia esta pantalla. La autenticación y la gestión de
                permisos reales siguen pendientes.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <footer className="page-width account-footer">
        <p>Detector de correos · Proyecto académico</p>
        <Link to="/">
          Conocer el proyecto <ArrowRight size={13} />
        </Link>
      </footer>
    </div>
  );
}
