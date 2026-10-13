# Plan de implementación: primera pantalla web

**Objetivo:** maquetar Analizar correo en `feature/web-interface-v1` y hacer commit del avance, conforme a la autorización del usuario.

**Diseño de referencia:** [interfaz-web-v1.md](../../interfaz-web-v1.md).

**Arquitectura:** frontend independiente en `frontend/`. React mantiene formulario y resultado en memoria; un servicio de demostración explícito permite revisar la interacción sin Flask. Los controles provienen de shadcn/ui y el detalle visual de React Bits.

**Stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui y React Bits.

## Alcance de este avance

- Solo la pantalla Analizar correo. La ayuda se presenta como diálogo contextual; la página Cómo funciona se implementará en el siguiente avance.
- Sin API Flask, persistencia, Gmail, historial ni navegación ficticia.
- Resultados simulados identificados como demostración. El texto libre no se clasifica con reglas que pretendan sustituir al modelo.
- Edición invalida resultados anteriores; carga bloquea envíos duplicados; limpieza y reemplazo confirman antes de borrar texto.
- Adaptación a celular, teclado, movimiento reducido y mensajes accesibles.

## Archivos y responsabilidades

| Archivo | Responsabilidad |
| --- | --- |
| `frontend/package.json`, configuración de Vite y TypeScript | Desarrollo, compilación y alias. |
| `frontend/src/components/ui/` | Controles instalados desde shadcn/ui. |
| `frontend/src/components/react-bits/` | Componente original de React Bits y atribución. |
| `frontend/src/features/analysis/demo.ts` | Ejemplos ficticios y respuestas de demostración. |
| `frontend/src/features/analysis/EmailForm.tsx` | Entrada y selección de ejemplos. |
| `frontend/src/features/analysis/AnalysisResult.tsx` | Estado vacío, carga, resultado y error. |
| `frontend/src/App.tsx` | Composición y estado del flujo. |
| `frontend/src/index.css` | Tokens y estilos compartidos. |
| `frontend/README.md` | Cómo ejecutar y límites del borrador. |

## Secuencia

- [x] Preparar Vite y Tailwind, instalar únicamente controles usados y un efecto de React Bits.
- [x] Verificar el origen de componentes externos y conservar sus licencias.
- [x] Maquetar encabezado, formulario, resultado y diálogos.
- [x] Implementar demostración sin atribuir resultados reales al texto libre.
- [x] Compilar, comprobar tipos y lint; ejecutar las pruebas Python existentes.
- [x] Revisar en navegador a 360, 768 y 1440 px, incluyendo ejemplos, carga, edición y confirmación.
- [x] Actualizar documentación con los resultados de verificación y hacer commit automático. Un fallo pendiente se registra, no se oculta.

## Revisión de casos relevantes

Comprobar cuerpo vacío o solo espacios, doble envío, reemplazo de texto escrito, edición tras un resultado y movimiento reducido. Las verificaciones del flujo se harán en el navegador; no se añadirán pruebas que repliquen la estructura de esta maqueta reversible.

## Decisiones de ejecución

El usuario autorizó iniciar el modelado de la primera pantalla y realizar commit incluso si queda algún defecto. Se ejecuta directamente en la rama que pidió conservar. No se crea otro worktree ni se amplía a backend o pantallas posteriores.
