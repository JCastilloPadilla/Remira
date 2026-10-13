import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
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
import SplitText from "@/components/react-bits/SplitText";
import { IllustratedFooter } from "@/components/IllustratedFooter";
import { CorrespondenceBackdrop } from "@/features/landing/CorrespondenceBackdrop";
import FadeContent from "@/components/react-bits/FadeContent";
import "./account.css";

export function AccountPage() {
  const [connectedExample, setConnectedExample] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = "Cuenta y conexiones · Remira";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="account-page">
      <a href="#account-main" className="skip-link">
        Ir al contenido
      </a>
      <SiteHeader />
      <main id="account-main" className="account-main">
        <CorrespondenceBackdrop />
        <div className="page-width account-content">
        <div className="account-heading">
          <p className="account-eyebrow">Cuenta y conexiones</p>
          <h1>
            <SplitText
              text="Tu correo, con tus reglas."
              tag="span"
              textAlign="left"
              splitType="words"
              delay={45}
              duration={0.7}
              rootMargin="0px"
            />
          </h1>
          <p>
            Tu identidad y el acceso a tus mensajes, en un mismo lugar.
            Cada permiso es una decisión tuya.
          </p>
        </div>
        <div className="account-demo-note">
          <ShieldCheck size={18} />
          <p>
            <strong>No hay una sesión ni una conexión real.</strong> Puedes
            explorar los estados de ejemplo sin conceder permisos
            ni modificar tu cuenta de Google.
          </p>
        </div>

        <div className="account-layout">
          <div className="account-settings">
            <section
              className="account-section account-access"
              aria-labelledby="account-access-title"
            >
              <div className="account-section-heading">
                <span className="account-section-icon">
                  <UserRound size={22} strokeWidth={1.5} />
                </span>
                <div>
                  <h2 id="account-access-title">Acceso a la cuenta</h2>
                  <p>Tu identidad al entrar en Remira.</p>
                </div>
                <Badge variant="outline">Sin sesión</Badge>
              </div>
              <div className="account-access-body">
                <h3>Continúas como visitante.</h3>
                <p>
                  Puedes probar los ejemplos del analizador sin cuenta.
                  El inicio de sesión con Google es una demostración.
                </p>
                <Button render={<Link to="/login" />}>
                  Ver inicio de sesión <ArrowRight size={16} />
                </Button>
              </div>
            </section>

            <section
              className="account-section account-gmail"
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
                          <AlertDialogContent className="account-dialog">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Restablecer la conexión de ejemplo?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                La conexión de ejemplo volverá al estado Sin conectar. No se
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
                        Iniciar sesión y dar acceso a Gmail son decisiones separadas.
                        Explora una conexión de ejemplo para conocer el recorrido.
                      </p>
                      <div className="account-actions">
                        <Dialog>
                          <DialogTrigger render={<Button />}>
                            <Link2 size={16} /> Conectar Gmail
                          </DialogTrigger>
                          <DialogContent className="account-dialog">
                            <DialogHeader>
                              <DialogTitle>
                                Conectar el correo es una decisión tuya
                              </DialogTitle>
                              <DialogDescription>
                                Esta demostración no solicita permisos ni accede
                                a tus correos.
                              </DialogDescription>
                            </DialogHeader>
                            <p className="text-sm leading-7 text-muted-foreground">
                              El inicio de sesión y la autorización de Gmail son pasos
                              separados. Puedes explorar una conexión ficticia
                              desde esta pantalla, sin dar acceso a tu cuenta.
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
            <img
              className="account-permissions-art"
              src="/illustrations/account-correspondence-v1.webp"
              width="768" height="512" alt=""
            />
            <h2 id="account-permissions-title">Dos decisiones distintas.</h2>
            <ol>
              <li>
                <span>01</span>
                <div>
                  <h3>Iniciar sesión</h3>
                  <p>
                    Identifica tu cuenta para las funciones personales de
                    Remira.
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
                reinicia esta pantalla. No se guardan datos ni se conceden
                permisos a una cuenta real.
              </p>
            </div>
          </aside>
        </div>
        </div>
      </main>
      <div className="account-footer-transition" aria-hidden="true" />
      <IllustratedFooter topHref="#account-main" />
    </div>
  );
}
