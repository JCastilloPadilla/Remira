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

El título y su explicación se integran en el espacio central despejado de la escena. La ilustración ocupa el ancho completo de la página; el contenido de lectura conserva su ancho limitado. Un elemento `picture` selecciona la composición vertical para teléfonos en orientación vertical y la panorámica para escritorio y móvil horizontal. Ambas se muestran completas, con altura proporcional, sin recortes.

Recursos generados con la herramienta integrada de imágenes, convertidos a WebP y guardados en el repositorio:

- `frontend/public/illustrations/guide-panorama-v1.webp`: 2172×724 px, aproximadamente 522 KiB.
- `frontend/public/illustrations/guide-panorama-mobile-v1.webp`: 1024×1536 px, aproximadamente 534 KiB.

Prompt de escritorio: «Use case: illustration-story. Asset: full-width panorama hero for Remira's How it works reading guide. Use supplied image as STYLE reference ONLY: detailed navy ink etching, cobalt watercolor, muted gold, professional hand-drawn correspondence world. Generate a NEW different composition, panoramic 3:1, 2172x724 or similar. A beautiful open-air correspondence school and reading workshop: left an elegant stone arcade with pigeonhole shelves and letters; center a long winding wooden reading table with open letters, pens, ribbon-bound stacks, a large brass magnifier on one letter; right two small adult readers patiently examining correspondence under a cobalt canopy among cypresses and botanical plants. A small blue paper airplane travels above the tables. Distant quiet hills, no central lake or bridge from the reference. Narrative is learning to read and interpret letters. Upper 20% quiet near-white neutral paper #f7f8f6 sky, illustration spreads across the whole width. Bottom boundary ORGANIC irregular silhouette of grasses, rocks, table legs and sparse ink strokes dissolving naturally into plain neutral #f7f8f6 bare paper. No straight bottom edge, NO white blur or fog, no rectangular framed image, no text or logos. Intricate yet calm, small golden highlights, predominantly navy and cobalt, avoid cream/yellow background. Keep all focal objects complete.»

Prompt móvil: «Create a mobile portrait 2:3 1024x1536 version of the supplied Remira correspondence-school panorama. Reference is subject/style reference, recompose thoughtfully, NOT crop. Match navy ink etching, cobalt watercolor, neutral near-white #f7f8f6 paper, restrained gold. A winding wooden reading table in the foreground with open letters, a clear brass magnifying glass, pens, blue ribbon-bound letters. Left stone arcade with correspondence shelves, right one small adult reading a letter beneath a cobalt canopy. Cypress garden and distant hills. Small paper plane in the upper quiet sky. Keep upper 15% very quiet pale neutral sky. Complete objects contained. Irregular organic bottom silhouette with plants, rocks and sparse ink strokes ending naturally onto bare near-white #f7f8f6 paper, no straight bottom edge, NO blur or mist overlay. This is a how-it-works guide illustration, professional and charming, no readable text, logos or frame. Vertical visual hierarchy, main objects large enough for a phone.»

Verificación: imagen completa y ancho de pared a pared en 1440, 390, 320 y 844 px (este último en orientación horizontal); carga del recurso correspondiente y ausencia de desbordamiento.

### Corrección de composición: versión 2

La primera panorámica cortaba la arcada y los árboles en el borde superior y se colocaba debajo del texto como una pieza separada. Se regeneran ambas composiciones con las siluetas completas, margen superior de papel y un centro amplio despejado para el título, explicación y enlace. Texto e ilustración comparten ahora la misma celda de una cuadrícula, con el texto por delante. No se aplica una máscara ni un difuminado para ocultar bordes.

Recursos actuales, generados con la herramienta integrada y guardados como WebP:

- `frontend/public/illustrations/guide-panorama-v2.webp`: 1774×887 px, aproximadamente 364 KiB.
- `frontend/public/illustrations/guide-panorama-mobile-v2.webp`: 1024×1536 px, aproximadamente 317 KiB.

Una corrección de color SVG en la presentación iguala el papel con `#f7f8f6`, conservando el tono oscuro de la tinta. En móviles pequeños se reserva una altura mínima de 760 px para impedir que la decoración cruce el texto; en horizontal con poca altura se compacta la cabecera y se limita el ancho del párrafo.

Prompt de escritorio: «Regenerate the reference as a genuinely integrated panoramic website hero for Remira. Reference STYLE and correspondence workshop concept only. Output 2172x1086 landscape 2:1. CRITICAL composition: upper center a LARGE EMPTY NEUTRAL PAPER SKY area for HTML heading and paragraph: x25%-75%, y0%-55% completely empty, no airplane trail there. All architecture and trees COMPLETELY CONTAINED below y20%, do NOT touch or intersect the top edge ANYWHERE including left. Top 18% across ENTIRE width pure flat #f7f8f6 near-white paper. Left and right thirds illustrate a small open-air letter-reading atelier: fully visible low stone arcade with letter pigeonholes on left, cypresses and plants, on right reader examining letter beneath low cobalt awning. Foreground bottom third winding wooden desks, open letters, brass magnifier, ribbon-tied stacks, ink pens. Small blue paper airplane only at far right x85%, y35%, away from central empty area. Central distant landscape MUST stay below y65% to leave space for copy. Navy ink etching and cobalt watercolor, tiny muted gold highlights, delicate sophisticated hand drawing. Bottom 7% organically irregular ink, leaves, stones then bare #f7f8f6 paper, no horizontal cut, no blur, no mist. Left and right artwork may extend to side edges BELOW y20% only. No text, logo, frames. Overall clear silhouette flanks a broad empty center above low scene, suitable for text overlay, absolutely no cut off roofs or treetops at top edge.»

Prompt móvil: «Generate a mobile 1024x1536 portrait recomposition of this exact correspondence-reading workshop illustration for Remira. Same navy ink etching, cobalt watercolor, small gold highlights and neutral #f7f8f6 paper. CRITICAL: TOP 50% of entire canvas is virtually EMPTY FLAT #f7f8f6 PAPER for an HTML title, paragraph and button. No words rendered. No trees, buildings, plane or marks in upper 45%. Place the COMPLETE stone letter-shelf arcade on lower left, reader beneath cobalt canopy on lower right, central wooden table with open letter and magnifier in bottom third. Cypress and botanical plants only lower half and fully visible treetops. Small paper airplane at far right y53%. Correspondence scene fits entirely in bottom 50%, clear distinct sizeable objects, not crowded. All artwork ends organically at bottom with irregular plants, rocks, sparse fine strokes onto bare #f7f8f6 paper, no straight edges, NO blur or mist. Side edges can touch scene below half only. No frame, logos or readable text. Keep correspondence-workshop character of reference, rather than cropping it.»

Se revisaron capturas en 1440×900, 1900×780, 390×900, 320×568 y 844×390 px, comprobando imagen completa, ancho total, recurso responsivo y lectura sin ilustraciones encimadas. Las comprobaciones de navegación, preguntas con teclado, movimiento reducido y accesibilidad de la guía pasaron. Build y lint correctos.

## Movimiento y footer compartido

`IllustratedFooter` reúne el footer de la landing y de esta guía: marca blanca, navegación, llamada al analizador y paisaje nocturno, con las mismas imágenes de escritorio y móvil. Sus estilos se extraen a `illustrated-footer.css` para mantener una única implementación. La transición previa conserva el color final de cada página. Los enlaces al proyecto y al inicio apuntan al destino correspondiente; la landing reconoce el ancla del proyecto al llegar desde la guía.

El título utiliza el mismo `SplitText` de React Bits que la portada: palabras, retraso de 45 ms y duración de 0,7 s. El índice incorpora una línea que crece desde el centro al pasar el cursor o recibir foco, una elevación de 4 px en su ilustración y desplazamiento de 2 px en la flecha, durante 420 ms. No se añaden movimientos continuos.

Las preguntas mantienen `details` y `summary`. En navegadores compatibles, `::details-content` interpola su altura en 380 ms y su opacidad en 280 ms para suavizar apertura y cierre. Se usa `@supports` para conservar el funcionamiento nativo donde no existe esta capacidad. Referencia: [animación de altura intrínseca en MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size). La preferencia de movimiento reducido desactiva todas estas transiciones y la entrada del título.

Se comprobaron la igualdad del footer entre las dos rutas, imágenes responsivas, animación intermedia al abrir y cerrar preguntas, foco y hover del índice, acceso al proyecto, ausencia de errores JavaScript y accesibilidad en escritorio y móvil. Compilación y lint correctos.

## Índice ilustrado al inicio

Se sustituye el índice lateral que acompañaba el scroll por una entrada titulada «Elige por dónde empezar». Cada acceso reutiliza una ilustración del proyecto: sobre, escritorio con lupa, cartas atadas, avión y jardín. Los enlaces conservan el desplazamiento suave hacia los cinco capítulos, respetando la preferencia de movimiento reducido.

El artículo pasa a una columna centrada de hasta 760 px para facilitar la lectura. El índice queda en el flujo normal de la página, sin barra flotante ni panel lateral. En móvil se distribuye en dos columnas y el quinto acceso se centra debajo.

Verificación: compilación y lint correctos; navegación, preguntas con teclado y ausencia de desbordamiento comprobadas en 1440, 1024, 768, 390 y 320 px. Accesibilidad sin infracciones detectadas en 1440 y 390 px. Se inspeccionaron capturas del índice en escritorio y móvil y se verificó que sus cinco imágenes cargan y que el bloque se desplaza junto al contenido.
