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

## Corrección: imágenes completas de pared a pared

Esta revisión sustituye el ajuste anterior que reducía el ancho de la portada y recortaba el cielo del footer. Ambas imágenes ahora usan `width: 100%` y altura natural, sin límite de ancho, `object-fit: cover` ni máscaras. Se conserva íntegra su relación de aspecto 3:1.

La portada coloca el texto sobre el espacio de cielo de la ilustración para combinar ancho completo con visibilidad en la primera ventana. En móvil conserva la imagen completa después del texto. El cierre del footer utiliza su cielo como espacio para el título y la acción en escritorio; en pantallas pequeñas el texto precede al paisaje para evitar superponerlo. La marca y los enlaces permanecen debajo de la imagen.

La transición hacia el footer deja de concentrarse en una franja de 120 px. Ocupa entre 160 y 300 px y pasa por tonos intermedios de azul antes de alcanzar el color del cielo de la ilustración. No se difumina ni se oculta parte del paisaje para conseguir esa transición.

Tech Text se reubica en un bloque amplio azul oscuro. Se aplican los parámetros de la captura del usuario: fuente heredada, peso 600, tamaño 150, color y acento `#ffffff`, espaciado `-0.05em`, revelado por letra, alcance 200, suavidad 0.7, línea discontinua, longitud 4, separación 2, grosor 1.5, velocidad 1, 15 partículas y selección, etiquetas, arrastre y barrido activados. Solo el texto se adapta al proyecto: «Mira más allá». La configuración se declara explícitamente en el componente. El efecto también está disponible en pantallas táctiles; el texto estático se reserva para movimiento reducido.

Se verificaron los anchos completos, la proporción original y la ausencia de máscaras y desplazamiento horizontal en 1920×914, 1440×900, 1366×768, 1280×720, 1366×600, 1920×768, 768×1024, 390×844, 320×568 y 844×390 px. En estos tamaños la ilustración principal completa queda dentro de la primera ventana. También se comprobó el barrido automático, arrastre y liberación de letras, el comportamiento táctil y la navegación al analizador. Las comprobaciones de accesibilidad en escritorio y móvil no detectaron infracciones.

## Portada anclada al borde inferior de la ventana

El bloque inicial ocupa la altura disponible de la ventana, descontando la navegación. El espacio flexible entre el texto y la ilustración mantiene el borde inferior de la imagen alineado con el borde inferior del viewport, con ancho completo y proporción natural. La nota bajo la ilustración pasa a continuación de la portada, fuera de la primera vista. La navegación móvil conserva una altura coherente para mantener esta alineación.

Tech Text cambia su parámetro `speed` a `0.5`; conserva los demás parámetros solicitados.

Se verificó la alineación del borde inferior, el ancho completo y la proporción de la imagen en diez tamaños entre 320×568 y 1920×914 px, además de redimensionar la ventana sin recargar. No se detectaron errores JavaScript ni desbordamiento horizontal. Build y lint completados correctamente; permanece el aviso previo de tamaño del paquete JavaScript.

## Header editorial, transición suave y navegación animada

El header comparte el fondo de papel de la portada. La marca utiliza la tipografía editorial del diseño, una línea cálida que se desvanece hacia los extremos separa la navegación y el acceso al analizador adopta un contorno azul. Los enlaces de sección muestran un subrayado discreto al interactuar; en móvil la navegación se distribuye en dos filas conservando la alineación de la portada.

La transición hacia el footer se extiende entre 420 y 760 px. Sus 21 tonos siguen una curva gradual con pendiente reducida en los extremos, para que el azul claro del contenido se funda con el cielo oscuro de la ilustración sin una unión marcada. El footer conserva su imagen completa y su ancho original.

Los enlaces internos utilizan el desplazamiento suave nativo del navegador, incluido el regreso al inicio. Se activa exclusivamente mientras la landing está montada y se desactiva cuando el usuario prefiere movimiento reducido. No se añadieron dependencias. Se corrigió también el atributo accesible que SplitText generaba sobre un span: el encabezado conserva su texto legible sin una etiqueta ARIA incompatible.

Se comprobó el desplazamiento por posiciones intermedias, la llegada al anclaje y el regreso al inicio, la preferencia de movimiento reducido y la salida al analizador. La revisión automática de accesibilidad no detectó infracciones en escritorio ni móvil. La portada mantiene su ancho, proporción y alineación al borde inferior en doce tamaños, incluido el redimensionamiento sin recargar. Build y lint completados; permanece el aviso previo de tamaño del paquete.

## Identidad: Remira

El nombre público de la aplicación es **Remira**, elegido por su relación con volver a mirar un mensaje antes de actuar. Mantiene el lema «Una segunda mirada a tus mensajes» y el símbolo azul existente.

El nombre se presenta con **Allura**, una cursiva de trazo ligero que acompaña las ilustraciones de correspondencia. La fuente se sirve localmente con `@fontsource/allura`, variante latina y peso 400; la navegación y los textos mantienen Manrope. El componente `BrandName` unifica la firma de Remira en los encabezados de las siete pantallas y en el footer de la landing. También se actualizaron los títulos de pestaña, etiquetas de inicio, referencias visibles a la marca, descripción de la web y README.

Se revisó la presencia de la identidad y la carga de la tipografía en las siete rutas, tanto en escritorio como en móvil. La portada conserva la composición completa y su alineación al borde inferior en los doce tamaños utilizados en la revisión anterior.

### Tipografía definitiva de la marca

Por elección del usuario, Fraunces sustituye a Allura para el nombre Remira: peso 600, estilo normal y sin cursiva. Se sirve localmente con `@fontsource/fraunces`, únicamente la variante latina necesaria. La marca utiliza 30 px en general, 32 px en el header de la landing y 28 px en pantallas pequeñas; se conserva Manrope para los textos de la interfaz. Se retiró la dependencia y la importación de Allura.

### Header compacto y centrado

A partir de las referencias del usuario, la landing agrupa marca y navegación en un conjunto compacto centrado sobre el título principal. Se eliminan la línea divisora, el separador del acceso a sesión y el subtítulo de la marca en el header. Remira conserva Fraunces 600, junto al símbolo azul a menor tamaño. En móvil la marca se centra sobre la fila de accesos; los enlaces de sección permanecen visibles desde 768 px.

Se reajusta la altura descontada del header para conservar la ilustración completa y pegada al borde inferior de la primera ventana. Verificado en doce tamaños y al redimensionar; sin desbordamiento horizontal. Se comprobaron los enlaces internos animados, el regreso al inicio, movimiento reducido y la navegación al analizador. Compilación y lint completados; sin infracciones de accesibilidad detectadas en escritorio y móvil.

### Marca y navegación al inicio del footer

El bloque con la marca Remira, enlaces, lema y regreso al inicio se mueve al comienzo del footer, antes de la llamada a analizar y del paisaje. La llamada mantiene su posición sobre el cielo en escritorio, dentro de un contenedor propio, para evitar superponerla a los enlaces. La ilustración continúa completa y de pared a pared. Se revisó el orden y la ausencia de superposiciones y desbordamiento en 1920, 1440, 390 y 320 px; compilación y lint completados correctamente.

### Menos espacio antes del footer

La transición conserva sus 21 tonos y la curva gradual del degradado. Su altura pasa de 420–760 px a 180–320 px; también se reduce el espacio inferior de la sección de alcances a 40 px en escritorio y 32 px en móvil. Así el footer queda más cerca del último contenido sin eliminar el degradado. Se revisaron escritorio y móvil, el mantenimiento de los tonos y la ausencia de desbordamiento horizontal; compilación y lint completados correctamente.
