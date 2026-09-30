# Frontend del detector de correos

Primera pantalla **Analizar correo**, creada con React, TypeScript, Vite, Tailwind CSS, shadcn/ui y React Bits.

## Ejecutar

Requiere Node.js 22.12 o superior dentro de la versión 22, o una versión posterior compatible con Vite.

Desde esta carpeta:

```powershell
npm ci
npm run dev -- --host 127.0.0.1
```

Abrir `http://127.0.0.1:5173`. Para comprobar el código:

```powershell
npm run build
npm run lint
```

## Qué se puede probar

- Introducir asunto y cuerpo; el cuerpo vacío o con espacios se rechaza.
- Cargar dos ejemplos ficticios y ver resultados simulados, con una espera breve.
- Consultar clasificación y confianza de demostración.
- Editar el mensaje e invalidar el resultado anterior.
- Confirmar o cancelar la limpieza y el reemplazo del contenido.
- Abrir la ayuda sin perder lo escrito.
- Usar la pantalla en escritorio o celular.

**Flask y el modelo todavía no están conectados.** Solo los ejemplos exactos tienen una respuesta preparada. Cualquier otro texto presenta un aviso de integración pendiente; no se intenta clasificarlo mediante reglas. No hay almacenamiento persistente ni llamadas a una API.

La ayuda está en un diálogo para este avance. La página independiente Cómo funciona, Gmail y el historial no están implementados.

## Organización

- `src/App.tsx`: composición de la pantalla y estado del análisis.
- `src/features/analysis/`: formulario, resultado y servicio de demostración.
- `src/components/ui/`: controles originales de shadcn/ui, estilo Base Nova.
- `src/components/react-bits/FadeContent.tsx`: transición original de React Bits para el resultado.
- `src/index.css`: tokens, estilos de la pantalla y adaptación a distintos tamaños.

## Componentes externos

Los controles se instalaron con la CLI oficial de [shadcn/ui](https://github.com/shadcn-ui/ui). Se ajustaron el texto de cierre al español, el tamaño del diálogo y las exportaciones de variantes que no se utilizan. Su licencia está en `src/components/ui/LICENSE.md`.

[FadeContent de React Bits](https://github.com/DavidHDev/react-bits/blob/main/public/r/FadeContent-TS-TW.json) se incorporó desde el registro TypeScript/Tailwind oficial. Se añadió soporte para movimiento reducido y se corrigieron las dependencias del efecto de React. Su licencia se conserva en `src/components/react-bits/LICENSE.md`. La ilustración del encabezado usa CSS y el icono de correo de Lucide; no pretende ser un componente de React Bits.

Las versiones instaladas se fijan en `package-lock.json`. Manrope se sirve desde la aplicación mediante Fontsource; no se solicitan fuentes a Google.

## Verificación de este avance

- `npm run build`: correcto, incluye comprobación de TypeScript.
- `npm run lint`: correcto, sin avisos.
- Pruebas Python existentes: 12 correctas.
- Revisión en navegador a 360, 768 y 1440 px: sin desplazamiento horizontal.
- Flujo comprobado: entrada vacía y espacios, carga con campos bloqueados, ejemplos legítimo y malicioso, invalidación al editar, cancelación y confirmación de limpieza, texto libre con aviso y ayuda en celular.

Las preferencias de movimiento reducido se contemplan en CSS y FadeContent; no se ha realizado una revisión con lector de pantalla ni una prueba cambiando esa preferencia del sistema.
