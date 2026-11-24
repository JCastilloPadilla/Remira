export interface EmailDraft {
  subject: string;
  body: string;
}
export interface AnalysisResponse {
  label: "legitimate" | "malicious";
  confidence: number;
}
export type AnalysisState<T = AnalysisResponse> =
  | { status: "idle" | "edited" | "loading" }
  | { status: "success"; result: T }
  | { status: "error"; message: string };

export const examples = [
  {
    name: "Coordinación de una reunión",
    description: "Un mensaje cotidiano entre compañeros.",
    subject: "Reunión del equipo para el viernes",
    body: "Hola, equipo:\n\nLes confirmo que la reunión del proyecto será el viernes a las 10:00 en el salón habitual. Revisaremos los avances y las tareas de la próxima semana.\n\nSi necesitan cambiar el horario, avísenme por el grupo.\n\nSaludos,\nMariana",
    result: { label: "legitimate", confidence: 0.93 },
  },
  {
    name: "Aviso de una cuenta bloqueada",
    description: "Un mensaje ficticio que solicita datos con urgencia.",
    subject: "URGENTE: verifica tu cuenta para evitar el bloqueo",
    body: "Estimado usuario:\n\nTu cuenta será suspendida en las próximas 2 horas. Confirma tu contraseña y los datos de tu tarjeta en https://verificacion-cuenta.example para mantener el acceso.\n\nNo respondas a este mensaje. Actúa de inmediato.\n\nDepartamento de verificación",
    result: { label: "malicious", confidence: 0.97 },
  },
] satisfies (EmailDraft & {
  name: string;
  description: string;
  result: AnalysisResponse;
})[];

// Solo los ejemplos exactos tienen una respuesta preparada. No se clasifica texto libre.
export async function simulateAnalysis(
  draft: EmailDraft,
  signal: AbortSignal,
): Promise<AnalysisResponse> {
  await new Promise<void>((resolve, reject) => {
    const finish = () => {
      signal.removeEventListener("abort", cancel);
      resolve();
    };
    const timer = window.setTimeout(finish, 1100);
    function cancel() {
      window.clearTimeout(timer);
      reject(new DOMException("Cancelado", "AbortError"));
    }
    if (signal.aborted) cancel();
    else signal.addEventListener("abort", cancel, { once: true });
  });
  const example = examples.find(
    (item) => item.subject === draft.subject && item.body === draft.body,
  );
  if (!example)
    throw new Error(
      "El análisis de texto libre estará disponible al conectar el modelo. Carga uno de los ejemplos para probar esta demostración.",
    );
  return example.result;
}
