# Landing con ilustración editorial

Implementada el 4 de octubre de 2026 en la ruta `/`. Esta revisión aplica la dirección aprobada: una página informativa más expresiva, con ilustración editorial de tinta y acuarela, textura intencional y una temática de correspondencia vinculada al logo existente.

## Composición y estilo

- Portada centrada con el mensaje «Antes de hacer clic, dale una segunda mirada», acciones principales y un paisaje panorámico de correspondencia.
- Presentación de la landing sin avisos de construcción, con ejemplos identificados como tales. La integración real con el modelo continúa pendiente y se documenta fuera de esta presentación.
- Recorrido en tres pasos, con motivos de sellos postales y numeración que representa la secuencia real.
- Ejemplo ficticio de correo y clasificación, separado de la portada para explicar el producto después de presentar su identidad.
- Contexto académico, alcance del modelo y límites de la clasificación.
- Cierre y footer azul oscuro con una segunda ilustración del mismo universo visual.

Manrope se conserva para navegación, texto y controles. Georgia aporta el carácter editorial a los títulos sin añadir una descarga de tipografía. La paleta combina papel `#F7F4E9`, tinta `#132C4D`, azul del logo `#2457C5`, azul claro `#DAE7F4` y noche `#0F2F56`. El ámbar se reserva para detalles ilustrativos; los resultados conservan colores semánticos independientes.

Los estilos se limitan a la landing. Las demás pantallas mantienen su diseño actual y serán la siguiente etapa de propagación de esta identidad.

## React Bits

Se incorporaron los componentes originales TypeScript con CSS de [React Bits](https://reactbits.dev/), conservando la licencia existente en `frontend/src/components/react-bits/LICENSE.md`:

- [SplitText](https://reactbits.dev/text-animations/split-text): entrada por palabras del título principal.
- [AnimatedContent](https://reactbits.dev/animations/animated-content): entrada del ejemplo de correo. La ilustración principal se muestra directamente al abrir la página.

Fuentes fijadas a la revisión `ca44b3f9ee180676a06d7de8ec6bea84cddff85b` del repositorio oficial:

- [SplitText.tsx](https://github.com/DavidHDev/react-bits/blob/ca44b3f9ee180676a06d7de8ec6bea84cddff85b/src/ts-default/TextAnimations/SplitText/SplitText.tsx)
- [AnimatedContent.tsx](https://github.com/DavidHDev/react-bits/blob/ca44b3f9ee180676a06d7de8ec6bea84cddff85b/src/ts-default/Animations/AnimatedContent/AnimatedContent.tsx)

Adaptaciones locales: respetar `prefers-reduced-motion`, dejar el contenido visible antes de inicializar la animación, limpiar las animaciones al desmontar y cancelar la actualización de fuentes cuando se desmonta SplitText. Se añadió `@gsap/react`, requerido por el componente original. La entrada es puntual y no se aplican efectos a todas las secciones. TiltedCard y StickerPeel se dejaron fuera de esta versión porque la ilustración ya aporta suficiente protagonismo.

## Ilustraciones originales

Generadas con la herramienta integrada de imágenes, siguiendo las referencias locales de `D:\Inspiracion` como dirección estética. Se creó arte nuevo para el proyecto, sin reutilizar las ilustraciones de las capturas.

Archivos usados por la web:

- `frontend/public/illustrations/correspondence-hero-v1.webp`: 2172 × 724 px, 352136 bytes.
- `frontend/public/illustrations/correspondence-footer-v1.webp`: 2172 × 724 px, 287178 bytes.

Los originales PNG se conservaron en el directorio de imágenes generadas de Codex. Las copias WebP del proyecto utilizan calidad 86, sin alterar la composición. La portada tiene prioridad alta de carga; el footer utiliza carga diferida. Ambas imágenes son decorativas, con dimensiones explícitas y texto alternativo vacío. La portada conserva toda la composición en escritorio y móvil, sin recorte de la imagen.

### Prompt de portada

Use case: illustration-story. Asset type: original panoramic website landing illustration for an academic phishing-email detector branded around 'a second look'. Create a very wide 3:1 landscape editorial illustration, hand-drawn ink and watercolor / vintage engraved print with deliberately imperfect fine hatching, sophisticated clean professional style. Subject: an imaginative miniature correspondence landscape: cobalt blue and cream envelopes, folded paper pathways forming gentle bridges, a small postal sorting studio with arched windows on the left, and on the right a large open envelope beside a thoughtful small person examining a letter at a desk with a magnifying glass. A paper airplane crosses the sky. Quiet coastal hills and tiny trees in the distance, subtle amber sunrise accents. It must feel like an elegant panoramic magazine illustration, not a children's cartoon, not a 3D render, not flat vector clipart. Composition: broad horizontal scene occupying bottom 65%, with airy empty warm ivory sky upper35%; central paper pathway unites the whole scene; detailed edges and beautiful ink texture, no boxed frame. Palette limited to warm ivory #F7F5EE background, cobalt #2457C5, deep ink #132C4D, pale blue and muted amber. Background entire canvas exactly warm ivory, gently blending with the illustration. Text: none. No typography, no letters or numbers, no logos, no watermark, no shields, no padlocks. High quality drawing, appealing but understated, original brand artwork. Output wide landscape.

### Prompt de footer

Use case: illustration-story. Asset type: original panoramic footer artwork for the same academic email detector landing. Create a wide 3:1 illustration in vintage fine engraved ink and handmade print texture style. Entire background deep navy blue #132C4D. Draw only with warm ivory #F7F5EE and sparse pale blue ink, like a two-color engraved illustration on blue paper. Scene across lower two-thirds: a sweeping gently curved stone and folded-paper bridge crossing a peaceful coastal bay, miniature postal studio with arched windows at left, a few large envelopes and paper folds as rocks along the shoreline, cypress trees at right, tiny person reading a letter, paper airplane crossing sky. Sophisticated editorial hand-drawn precise hatching with intentional imperfection, clean mature professional calm atmosphere. Broad empty navy sky upper one-third and continuous navy around scene to blend with website footer background. No text, no logos, no watermarks, no shields or locks, no 3D, no neon, no gradients. Match an elegant cobalt/cream correspondence-themed landing illustration. Wide panoramic composition.

## Verificación

Build y lint verificados. Revisión visual en Chrome a 1440, 768, 390 y 320 px. Sin desplazamiento horizontal; las ilustraciones cargan y los anclajes tienen destino. Se comprobó la entrada al analizador, el regreso a la landing y el enlace al recorrido. Sin errores de JavaScript durante estas comprobaciones. Con movimiento reducido, el título y las imágenes permanecen visibles sin animación.

Las capturas y herramientas de comprobación son artefactos locales bajo `tmp/landing-qa`, excluidos del repositorio. No se añadieron dependencias de pruebas a la aplicación.

Se mantiene el aviso de Vite por un paquete JavaScript superior a 500 kB. La instalación también informa seis avisos de seguridad en dependencias preexistentes de la cadena de herramientas de shadcn; la única dependencia nueva en el lockfile es `@gsap/react`. Su actualización queda fuera de esta revisión visual.

La comprobación automática con axe de reglas WCAG 2 A/AA y 2.1 A/AA no detectó infracciones en escritorio (1440 px) ni móvil (390 px). Se verificó el acceso por teclado al enlace para saltar al contenido y se corrigió el contraste de los números del recorrido. Las otras seis rutas siguen mostrando su encabezado sin errores JavaScript en una comprobación de carga; esto no sustituye la revisión completa de sus interacciones pendientes.


## Ajustes de presentación y Tech Text

Se corrigió el recorte de los descendentes del título (la «g» de «segunda») eliminando `overflow: hidden` de SplitText y aumentando el espacio de línea. La portada distribuye el espacio disponible de la ventana entre texto e ilustración y muestra la imagen con `object-fit: contain`. En móvil la composición completa conserva su proporción; en ventanas horizontales de poca altura se utilizan dos columnas.

Los botones de la landing mantienen el azul, con sombra suave y transición de color. Se desactiva el desplazamiento de Base UI al pulsarlos; solo la flecha se desplaza levemente al pasar el cursor. Estas reglas no cambian los botones de las otras pantallas y respetan movimiento reducido.

Las secciones intermedias comparten un fondo continuo de crema a azul claro, que se une gradualmente con el cierre azul oscuro. El footer mueve marca y enlaces debajo del paisaje y reduce el espacio de cielo de su ilustración. La portada sí muestra su imagen completa.

Se retiraron de la landing los banners de construcción, los avisos de conexión pendiente y las llamadas a «demostración». El correo ilustrativo sigue identificado como ejemplo. Esta modificación presenta el diseño final; no añade integración con el modelo, autenticación ni Gmail.

Se incorporaron [TechText.tsx](https://github.com/DavidHDev/react-bits/blob/ca44b3f9ee180676a06d7de8ec6bea84cddff85b/src/ts-default/TextAnimations/TechText/TechText.tsx) y su [CSS original](https://github.com/DavidHDev/react-bits/blob/ca44b3f9ee180676a06d7de8ec6bea84cddff85b/src/ts-default/TextAnimations/TechText/TechText.css), sin dependencias nuevas, bajo la licencia de React Bits ya incluida. El componente aparece en «Mira más allá», junto al correo ilustrativo. La inspección de los trazos responde al cursor; no se activan arrastre, etiquetas de medidas, partículas ni barrido automático. Hay un encabezado equivalente en HTML para accesibilidad. En pantallas táctiles y con movimiento reducido se muestra ese texto estático.

Verificación de la ilustración completa dentro de la vista inicial en 1440×900, 1366×768, 1280×720, 1366×600, 1920×1080, 768×1024, 390×844, 320×568, 844×390 y 1366×500 px, sin desplazamiento horizontal ni errores JavaScript. Se comprobó la reacción de Tech Text al cursor, los botones pulsados sin desplazamiento, la versión táctil y el movimiento reducido, el acceso al analizador y el anclaje al recorrido.
