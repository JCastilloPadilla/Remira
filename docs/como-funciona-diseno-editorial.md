# Cómo funciona: guía editorial de Remira

## Dirección visual

La ruta `/como-funciona` adopta el lenguaje de la landing: papel neutro `#f7f8f6`, tinta `#132c4d`, azul de marca `#2457c5`, texto secundario `#53647a` y cierre nocturno `#0f2f56`. Fraunces identifica la marca; Georgia compone títulos editoriales y Manrope mantiene la lectura del cuerpo. La ilustración representa el acto de revisar una carta, en lugar de repetir el paisaje de portada.

Se retiran la insignia de título, la descripción secundaria de la marca, el aviso en tarjeta y FadeContent del encabezado. La introducción muestra texto e ilustración en dos columnas y se apila en móvil. Una nota breve identifica la demostración y sus mensajes ficticios, sin prometer análisis reales ni acceso a Gmail.

## Estructura y navegación

- Header integrado con marca, enlaces a las pantallas existentes y acceso al analizador. En móvil se usa un menú nativo y controles de 44 px.
- Introducción ilustrada con enlace al inicio de la guía.
- Índice fijo en escritorio; en móvil pasa a una cuadrícula de enlaces antes del artículo.
- Cinco secciones: primeros pasos, interpretación del resultado, privacidad y conexiones, límites del análisis y preguntas frecuentes.
- Resultados presentados como sellos de tinta verde y granate, acordes con el sello de la carta en la landing. La confianza se explica como puntuación del modelo, sin presentarla como garantía.
- Preguntas con `details` y `summary`, accesibles con teclado.
- Transición suave al cierre azul, sobre ilustrado, acceso al analizador y marca blanca.

Los enlaces internos usan scroll suave, con margen para el encabezado de la sección. `prefers-reduced-motion` elimina el desplazamiento animado y las transiciones. La clase que activa el scroll se retira al abandonar la página. Se conservan las instrucciones de los ejemplos, la ausencia de persistencia y permisos reales, el aviso de errores del clasificador y su máximo de 512 tokens, verificado en `src/hf_classifier.py`.

## Ilustración

Recurso: `frontend/public/illustrations/correspondence-guide-v1.webp`, 1448×1086 px, proporción 4:3, transparencia y aproximadamente 391 KiB. Se generó con la herramienta integrada de imágenes, usando `correspondence-hero-v2.webp` como referencia de estilo. Representa un escritorio con una carta, lupa, sobre azul, correspondencia, pluma y avión. La misma composición completa se adapta a escritorio y móvil, sin recortes ni fondo rectangular.

Prompt: «Create a single isolated editorial illustration for Remira's 'How it works' guide, matching the provided reference's navy ink etching, cobalt watercolor, near-white neutral paper and small golden highlights. Reference is STYLE only, do not reproduce its landscape. Landscape 4:3 composition on truly transparent background. Subject: an elegant slightly imperfect wooden correspondence desk seen at gentle three-quarter overhead angle, one large unfolded ivory letter at center being inspected by a magnifying glass lying across it, a cobalt folded envelope open beside it, a short stack of correspondence, one fountain pen and a small blue paper airplane resting on the desk's corner. No people, no landscape, no room or backdrop, no readable text, no logos. Fine hand-drawn navy linework, restrained watercolor, quietly professional and detailed. The letter has subtle handwritten line marks but NO legible words. The magnifier reveals fine lines on the same letter. Preserve the complete desk and every object within canvas with 8% transparent margin. Silhouette irregular with a few fine ink hatches ending naturally. No giant badge, no gradients, no photorealism, no cartoon faces. This will sit alongside text on a web guide and scale to mobile, so keep a clear readable focal object and strong silhouettes.»

## Verificación

Se revisaron 1440, 1024, 768, 390 y 320 px de ancho: carga de ilustración, ausencia de desbordamiento horizontal, navegación del índice a las cinco secciones, apertura y cierre de preguntas con Enter, menú móvil y salida al analizador. Se verificó la limpieza de la clase de scroll y la preferencia de movimiento reducido. La revisión de accesibilidad no detectó infracciones en 1440 y 390 px. Se inspeccionaron capturas de introducción, resultados y footer. Compilación y lint completados correctamente; permanece el aviso previo de tamaño del paquete JavaScript.

## Ilustraciones durante la lectura

El usuario pidió más vida y carisma después de la introducción. `HelpBackdrop` incorpora cinco sobres y dos recorridos estáticos del avión, con un jardín de correspondencia en el margen derecho. La decoración se ubica detrás de las secciones, con opacidad reducida, sin capturar clics ni formar parte del árbol accesible. En móvil se reduce su intensidad y se mantienen los motivos visibles junto al texto. No se añaden animaciones de scroll.

El índice de escritorio incluye una ilustración a color con una pequeña nota editorial; se omite esa pieza en pantallas de poca altura para mantener la navegación utilizable. Privacidad recibe una ilustración propia de cartas atadas con una cinta azul. Preguntas frecuentes incorpora un pequeño sobre. El menú se sitúa sobre el contenido para conservar sus enlaces disponibles.

Dos recursos generados con la herramienta integrada de imágenes, usando `correspondence-guide-v1.webp` como referencia de estilo:

- `frontend/public/illustrations/guide-garden-v1.webp`: 600×900 px, transparencia, aproximadamente 218 KiB. Ciprés, flores, cartas, sobre, rocas y avión.
- `frontend/public/illustrations/guide-private-letter-v1.webp`: 500×375 px, transparencia, aproximadamente 44 KiB. Cartas con cinta azul, sello de cera, sobre y pluma.

Prompt base de ambos: «Use the reference ONLY to match Remira's fine navy ink etching, cobalt watercolor, neutral ivory paper, restrained warm gold and slightly imperfect professional editorial illustration. Isolated illustration on genuinely TRANSPARENT background. No text, readable handwriting, logos, badges, backdrop, shadows outside the object, gradient, or white rectangular panel. Keep the entire subject with 8% transparent margin.»

Jardín: «Portrait 2:3 decorative margin vignette: a little rocky garden at the base of a tall slender cypress and delicate blue foliage, three ivory and blue letters caught between stems, one folded cobalt envelope resting on a stone, a small paper airplane near the top with only a short broken ink trail. Botanical drawing connects naturally to a landscape of correspondence; charming but quiet, NOT a fantasy creature, no people. Tall narrow asymmetric silhouette for the side margin of a website reading guide. Sharply drawn tiny plants end naturally in sparse ink hatching on transparent canvas at bottom, no fog. Objects and foliage must remain distinguishable when scaled to 200px wide.»

Carta: «Landscape 4:3 small chapter illustration: two ivory letters neatly tied with a cobalt ribbon and a tiny plain gold wax seal, an open blue envelope behind, a small dark-blue fountain pen beside them and one delicate olive sprig. Clear readable correspondence silhouette, graceful hand-drawn shapes, slightly irregular paper edges. No wooden desk and no magnifying glass. Intended as a miniature vignette beside the privacy chapter of a website guide. The ribbon holds the papers closed, not a padlock or shield.»

Se repitieron las comprobaciones de los cinco anchos, navegación y preguntas con teclado, accesibilidad en escritorio y móvil y movimiento reducido. Se comprobó que las imágenes cargan, que el fondo conserva su posición al hacer scroll y que el menú móvil permite navegar a Cuenta. Capturas de resultados y privacidad revisadas en 1440 y 390 px. Compilación y lint completados correctamente.
