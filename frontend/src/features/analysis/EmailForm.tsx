import { useState, type RefObject } from "react";
import { ArrowRight, FileText, LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { EmailDraft, examples as demoExamples } from "./demo";

interface EmailFormProps {
  draft: EmailDraft;
  onChange: (draft: EmailDraft) => void;
  onSubmit: () => void;
  busy: boolean;
  validation: string;
  subjectRef: RefObject<HTMLInputElement | null>;
  examples: typeof demoExamples;
  onExample: (draft: EmailDraft) => void;
  onClear: () => void;
}

export function EmailForm({
  draft,
  onChange,
  onSubmit,
  busy,
  validation,
  subjectRef,
  examples,
  onExample,
  onClear,
}: EmailFormProps) {
  const [examplesOpen, setExamplesOpen] = useState(false);
  return (
    <form
      className="flex flex-1 flex-col gap-6 p-6 sm:p-7"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <fieldset
        disabled={busy}
        className="flex min-w-0 flex-1 flex-col gap-6 disabled:opacity-70"
      >
        <div className="space-y-2.5">
          <Label htmlFor="email-subject">
            Asunto{" "}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </Label>
          <Input
            ref={subjectRef}
            id="email-subject"
            value={draft.subject}
            onChange={(event) =>
              onChange({ ...draft, subject: event.target.value })
            }
            placeholder="¿De qué trata el correo?"
            className="h-12"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          <Label htmlFor="email-body">Cuerpo del correo</Label>
          <Textarea
            id="email-body"
            value={draft.body}
            onChange={(event) =>
              onChange({ ...draft, body: event.target.value })
            }
            placeholder={
              "Pega aquí el contenido del mensaje…\n\nPuedes incluir el saludo, los enlaces y la firma."
            }
            aria-invalid={Boolean(validation)}
            aria-describedby={validation ? "body-error" : "body-hint"}
            className="min-h-64 flex-1 resize-y px-4 py-3 text-sm leading-7"
          />
          <p
            id={validation ? "body-error" : "body-hint"}
            role={validation ? "alert" : undefined}
            className={
              validation
                ? "text-xs text-destructive"
                : "text-xs text-muted-foreground"
            }
          >
            {validation ||
              "El contenido se revisará como texto, sin abrir enlaces ni adjuntos."}
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Dialog open={examplesOpen} onOpenChange={setExamplesOpen}>
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                />
              }
            >
              <FileText size={15} />
              Cargar ejemplo
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Prueba con un ejemplo</DialogTitle>
                <DialogDescription>
                  Mensajes ficticios con resultados preparados para explorar la
                  interfaz.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                {examples.map((example) => (
                  <button
                    type="button"
                    key={example.name}
                    className="example-option"
                    onClick={() => {
                      setExamplesOpen(false);
                      onExample({
                        subject: example.subject,
                        body: example.body,
                      });
                    }}
                  >
                    <span className="font-semibold text-foreground">
                      {example.name}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {example.description}
                    </span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!draft.subject && !draft.body}
            onClick={onClear}
          >
            <Trash2 size={15} />
            Limpiar
          </Button>
        </div>
      </fieldset>
      <Button
        type="submit"
        size="lg"
        disabled={busy}
        className="h-12 w-full justify-between px-5 font-semibold"
      >
        {busy ? "Analizando correo…" : "Analizar correo"}
        {busy ? (
          <LoaderCircle className="motion-safe:animate-spin" size={18} />
        ) : (
          <ArrowRight size={18} />
        )}
      </Button>
    </form>
  );
}
