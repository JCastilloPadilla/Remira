# Cómo funciona: guía editorial de Remira

## Dirección visual

La ruta `/como-funciona` adopta el lenguaje de la landing: papel neutro `#f7f8f6`, tinta `#132c4d`, azul de marca `#2457c5`, texto secundario `#53647a` y cierre nocturno `#0f2f56`. Fraunces identifica la marca; Georgia compone títulos editoriales y Manrope mantiene la lectura del cuerpo. La ilustración representa el acto de revisar una carta, en lugar de repetir el paisaje de portada.

Se retiran la insignia de título, la descripción secundaria de la marca, el aviso en tarjeta y FadeContent del encabezado. La introducción muestra el título centrado sobre una ilustración panorámica de lado a lado, con una composición vertical propia para móvil. Una nota breve identifica la demostración y sus mensajes ficticios, sin prometer análisis reales ni acceso a Gmail.

## Estructura y navegación

- Header integrado con marca, enlaces a las pantallas existentes y acceso al analizador. En móvil se usa un menú nativo y controles de 44 px.
- Introducción ilustrada con enlace al inicio de la guía.
- Índice ilustrado al inicio, sin posición fija: cinco accesos en una fila en escritorio y dos columnas en móvil, con el último centrado.
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

Privacidad recibe una ilustración propia de cartas atadas con una cinta azul. Preguntas frecuentes incorpora un pequeño sobre. El menú se sitúa sobre el contenido para conservar sus enlaces disponibles. El jardín permanece como decoración del fondo y también identifica el acceso a preguntas frecuentes en el índice.

Dos recursos generados con la herramienta integrada de imágenes, usando `correspondence-guide-v1.webp` como referencia de estilo:

- `frontend/public/illustrations/guide-garden-v1.webp`: 600×900 px, transparencia, aproximadamente 218 KiB. Ciprés, flores, cartas, sobre, rocas y avión.
- `frontend/public/illustrations/guide-private-letter-v1.webp`: 500×375 px, transparencia, aproximadamente 44 KiB. Cartas con cinta azul, sello de cera, sobre y pluma.

Prompt base de ambos: «Use the reference ONLY to match Remira's fine navy ink etching, cobalt watercolor, neutral ivory paper, restrained warm gold and slightly imperfect professional editorial illustration. Isolated illustration on genuinely TRANSPARENT background. No text, readable handwriting, logos, badges, backdrop, shadows outside the object, gradient, or white rectangular panel. Keep the entire subject with 8% transparent margin.»

Jardín: «Portrait 2:3 decorative margin vignette: a little rocky garden at the base of a tall slender cypress and delicate blue foliage, three ivory and blue letters caught between stems, one folded cobalt envelope resting on a stone, a small paper airplane near the top with only a short broken ink trail. Botanical drawing connects naturally to a landscape of correspondence; charming but quiet, NOT a fantasy creature, no people. Tall narrow asymmetric silhouette for the side margin of a website reading guide. Sharply drawn tiny plants end naturally in sparse ink hatching on transparent canvas at bottom, no fog. Objects and foliage must remain distinguishable when scaled to 200px wide.»

Carta: «Landscape 4:3 small chapter illustration: two ivory letters neatly tied with a cobalt ribbon and a tiny plain gold wax seal, an open blue envelope behind, a small dark-blue fountain pen beside them and one delicate olive sprig. Clear readable correspondence silhouette, graceful hand-drawn shapes, slightly irregular paper edges. No wooden desk and no magnifying glass. Intended as a miniature vignette beside the privacy chapter of a website guide. The ribbon holds the papers closed, not a padlock or shield.»

Se repitieron las comprobaciones de los cinco anchos, navegación y preguntas con teclado, accesibilidad en escritorio y móvil y movimiento reducido. Se comprobó que las imágenes cargan, que el fondo conserva su posición al hacer scroll y que el menú móvil permite navegar a Cuenta. Capturas de resultados y privacidad revisadas en 1440 y 390 px. Compilación y lint completados correctamente.

## Portada panorámica del taller de lectura

La escena aislada del escritorio se sustituye por un taller abierto de correspondencia: arcadas, mesas con cartas y lupa, lectores bajo un toldo azul, jardín y avión. Conserva el lenguaje de tinta azul y acuarela de la landing, con una composición distinta para esta guía. El pie termina de forma orgánica entre plantas y trazos sobre papel neutro; no se aplica un difuminado CSS. El escritorio original se conserva como imagen del índice.

El título y su explicación se centran encima de la escena. La ilustración ocupa el ancho completo de la página; el contenido de lectura conserva su ancho limitado. Un elemento `picture` selecciona la composición vertical para teléfonos en orientación vertical y la panorámica para escritorio y móvil horizontal. Ambas se muestran completas, con altura proporcional, sin recortes.

Recursos generados con la herramienta integrada de imágenes, convertidos a WebP y guardados en el repositorio:

- `frontend/public/illustrations/guide-panorama-v1.webp`: 2172×724 px, aproximadamente 522 KiB.
- `frontend/public/illustrations/guide-panorama-mobile-v1.webp`: 1024×1536 px, aproximadamente 534 KiB.

Prompt de escritorio: «Use case: illustration-story. Asset: full-width panorama hero for Remira's How it works reading guide. Use supplied image as STYLE reference ONLY: detailed navy ink etching, cobalt watercolor, muted gold, professional hand-drawn correspondence world. Generate a NEW different composition, panoramic 3:1, 2172x724 or similar. A beautiful open-air correspondence school and reading workshop: left an elegant stone arcade with pigeonhole shelves and letters; center a long winding wooden reading table with open letters, pens, ribbon-bound stacks, a large brass magnifier on one letter; right two small adult readers patiently examining correspondence under a cobalt canopy among cypresses and botanical plants. A small blue paper airplane travels above the tables. Distant quiet hills, no central lake or bridge from the reference. Narrative is learning to read and interpret letters. Upper 20% quiet near-white neutral paper #f7f8f6 sky, illustration spreads across the whole width. Bottom boundary ORGANIC irregular silhouette of grasses, rocks, table legs and sparse ink strokes dissolving naturally into plain neutral #f7f8f6 bare paper. No straight bottom edge, NO white blur or fog, no rectangular framed image, no text or logos. Intricate yet calm, small golden highlights, predominantly navy and cobalt, avoid cream/yellow background. Keep all focal objects complete.»

Prompt móvil: «Create a mobile portrait 2:3 1024x1536 version of the supplied Remira correspondence-school panorama. Reference is subject/style reference, recompose thoughtfully, NOT crop. Match navy ink etching, cobalt watercolor, neutral near-white #f7f8f6 paper, restrained gold. A winding wooden reading table in the foreground with open letters, a clear brass magnifying glass, pens, blue ribbon-bound letters. Left stone arcade with correspondence shelves, right one small adult reading a letter beneath a cobalt canopy. Cypress garden and distant hills. Small paper plane in the upper quiet sky. Keep upper 15% very quiet pale neutral sky. Complete objects contained. Irregular organic bottom silhouette with plants, rocks and sparse ink strokes ending naturally onto bare near-white #f7f8f6 paper, no straight bottom edge, NO blur or mist overlay. This is a how-it-works guide illustration, professional and charming, no readable text, logos or frame. Vertical visual hierarchy, main objects large enough for a phone.»

Verificación: imagen completa y ancho de pared a pared en 1440, 390, 320 y 844 px (este último en orientación horizontal); carga del recurso correspondiente y ausencia de desbordamiento.

## Índice ilustrado al inicio

Se sustituye el índice lateral que acompañaba el scroll por una entrada titulada «Elige por dónde empezar». Cada acceso reutiliza una ilustración del proyecto: sobre, escritorio con lupa, cartas atadas, avión y jardín. Los enlaces conservan el desplazamiento suave hacia los cinco capítulos, respetando la preferencia de movimiento reducido.

El artículo pasa a una columna centrada de hasta 760 px para facilitar la lectura. El índice queda en el flujo normal de la página, sin barra flotante ni panel lateral. En móvil se distribuye en dos columnas y el quinto acceso se centra debajo.

Verificación: compilación y lint correctos; navegación, preguntas con teclado y ausencia de desbordamiento comprobadas en 1440, 1024, 768, 390 y 320 px. Accesibilidad sin infracciones detectadas en 1440 y 390 px. Se inspeccionaron capturas del índice en escritorio y móvil y se verificó que sus cinco imágenes cargan y que el bloque se desplaza junto al contenido.
