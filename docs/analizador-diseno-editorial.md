# Analizador: la mesa de revisión

Fecha: 10 de octubre de 2026. Ruta: `/analizar`.

El analizador adopta el lenguaje visual de Remira: papel neutro, tinta azul,
tipografía editorial e ilustraciones de correspondencia. La entrada es breve
para dar prioridad al correo y al resultado; no utiliza un paisaje que ocupe
toda la primera pantalla.

## Composición

- Encabezado sin línea divisora, marca Fraunces y navegación centrada en escritorio.
  En teléfono, navegación desplegable y acceso a la ayuda breve.
- Título con la entrada por palabras de `SplitText` de React Bits. Se respeta
  la preferencia de movimiento reducido.
- Formulario como hoja de papel: asunto opcional, cuerpo, ejemplos, limpieza
  y acción principal. El texto conserva su tamaño legible en teléfonos.
- Resultado como nota de lectura: ilustración mientras espera, sello de tinta
  verde o granate al recibir una clasificación y confianza identificada como
  valor del ejemplo.
- Sobres y recorridos de avión estáticos en los márgenes, discretos detrás
  del contenido en móvil. Footer ilustrado compartido con inicio y ayuda,
  conectado mediante una transición corta hacia azul nocturno.

Paleta: papel `#f7f8f6`, hoja `#fffefa`, tinta `#132f50`, acción `#2457c5`,
bruma `#e5edf2`, resultado legítimo `#1b694f`, advertencia `#92374b`.
Manrope para controles y lectura; Georgia para títulos; Fraunces para Remira.

## Adaptación y comportamiento

El formulario y el resultado aparecen en dos columnas desde 1024 px. Por debajo
se leen en una sola columna. La ilustración de entrada se omite en teléfono
para dejar espacio al trabajo; la ilustración nueva del resultado se conserva
completa, sin recorte, a 200 px de ancho.

Se mantienen los estados inicial, carga, resultado, correo editado y error;
validación del cuerpo; confirmación antes de reemplazar o limpiar; y ayuda en
diálogo que conserva el borrador. El desplazamiento al resultado en móvil se
ejecuta después de actualizar el contenido, con movimiento suave o inmediato
según la preferencia del usuario.

La pantalla sigue siendo una demostración: solo los dos ejemplos proporcionan
clasificaciones preparadas. El texto libre no se clasifica, no se envía al
servidor y no se guarda. El rediseño no añade conexión con el modelo, Gmail ni
historial real.

## Ilustración generada

Activo: `frontend/public/illustrations/analyzer-letter-v1.webp`.
768 × 512 px, transparencia, 88 678 bytes. Se utiliza la misma composición
completa en escritorio y móvil; no necesita una variante recortada.

Generada con ImageGen a partir de `correspondence-guide-v1.webp` como referencia
de estilo. El original se conserva en:
`C:/Users/joose/.codex/generated_images/01a0f076-b655-7f70-bf70-54844aea57a1/exec-8c65aee2-b4c0-48bc-a939-ee5692215869.png`.
Después se redujo y comprimió a WebP conservando el canal alfa.

Prompt utilizado:

> Use case: illustration-story. Asset: isolated editorial vignette for Remira
> email analyzer's awaiting-result state, readable on desktop and mobile.
> Match supplied reference ONLY for fine navy ink etching, cobalt watercolor,
> neutral ivory paper, tiny restrained gold, slightly imperfect professional
> hand drawing. New compact composition on genuinely TRANSPARENT background,
> landscape 3:2. A cobalt open envelope holds one folded ivory letter; a brass
> magnifying glass rests diagonally over its lower corner, navy fountain pen
> and two delicate blue olive leaves alongside. NO desk, no landscape, no
> people, no frames/badges, no text or readable handwriting, no shadows outside
> objects, no background rectangle, no fog. Clear graceful silhouettes
> distinguishable at 180px wide. Keep every object COMPLETE within canvas with
> 10% transparent margin. Fine hand-drawn detail, quiet confident craft, not
> clipart. Magnifying glass visually suggests taking a second look rather than
> a generic security shield.

## Verificación

- Compilación de producción y lint.
- Navegador en 320, 390, 768, 1024 y 1920 px: sin desbordamiento horizontal,
  imágenes cargadas y revisión de capturas de escritorio y teléfono.
- Recorrido de ambos ejemplos, carga, edición, confirmación/cancelación,
  limpieza, error de texto libre, reintento y conservación del borrador al
  abrir la ayuda.
- Navegación móvil y desplazamiento al resultado, también con movimiento reducido.
- Comprobaciones automáticas de accesibilidad WCAG A/AA con axe en la pantalla,
  resultados y diálogos. No sustituyen una auditoría manual completa.

Los scripts y capturas de revisión están en `tmp/landing-qa`, carpeta ignorada
por Git. No se añadieron dependencias al producto. Se eliminaron del CSS global
los estilos obsoletos exclusivos del analizador anterior.
