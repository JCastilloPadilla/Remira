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

## Recorrido de correspondencia al hacer scroll

La landing conecta las ilustraciones con un avión móvil y sobres que descienden por los márgenes. Se conservan intactas las dos ilustraciones originales, incluido el avión de la portada solicitado por el usuario. El avión móvil es una pieza independiente: aparece al empezar a bajar, sigue curvas por el lateral y termina junto a la persona que lee en el paisaje final. Cuatro sobres en escritorio y dos en móvil acompañan el recorrido y aterrizan en distintos puntos de la ilustración del footer.

`CorrespondenceJourney` utiliza GSAP, ScrollTrigger y MotionPathPlugin de la dependencia existente. El avance responde al scroll, con una interpolación suave de 0.6 segundos y una breve entrada inicial de los sobres. No bloquea ni controla el desplazamiento. Los tamaños y las posiciones se calculan a partir de la altura de la página, el espacio real de los márgenes y la posición de las ilustraciones; se recalculan al cambiar el tamaño. Al salir de la landing se limpian observadores y animaciones. Los elementos son decorativos, están excluidos de lectores de pantalla y permiten interactuar con el contenido que queda debajo.

Con movimiento reducido se oculta la capa animada y permanecen las composiciones estáticas originales. No se incorporaron dependencias nuevas.

### Recursos y generación

- `frontend/public/illustrations/journey-plane-v1.webp`: avión independiente, 360×157 px, con transparencia.
- `frontend/public/illustrations/journey-envelope-v1.webp`: sobre independiente, 240×128 px, con transparencia.

Ambos se generaron con la herramienta integrada de imágenes usando la portada únicamente como referencia de estilo. Se recortaron los márgenes transparentes y se optimizó su tamaño para la web. Los archivos de las ilustraciones originales no se editaron.

Prompt compartido: «Use the referenced image ONLY as a palette and drawing style reference. Do not reproduce or modify the landscape. Generate one isolated illustrated decorative sprite on a genuinely transparent background, no ground, no backdrop, no lettering, no shadow beyond the object, no other objects. Style: fine navy blue ink etching and hand drawn watercolor, warm ivory paper and rich cobalt folds, slightly imperfect professional editorial illustration. Clear silhouette and strong contrast at small sizes. Center the entire object with 10% clear transparent margin.»

Avión: «Subject: one folded paper airplane seen slightly from above, long pointed nose pointing exactly to the right, triangular wings with blue and cream panels, elegant navy folded edges, broad horizontal silhouette. Its nose must point right so it can be rotated along a website scroll path.»

Sobre: «Subject: one closed cream paper mail envelope seen face-on from its back, triangular folded flap outlined in navy ink, tiny cobalt corner detail. Slightly irregular real paper edges with very subtle ink hatching, clean quiet drawing. Horizontal envelope shape. No wax seal, no stamp, no handwriting.»

### Verificación

Se comprobó el recorrido, la llegada de las piezas al paisaje final, su pausa después de detener el scroll y la cantidad de sobres en 1440×900, 768×1024, 390×844 y 320×568 px. Se verificaron movimiento reducido, salida al analizador y regreso a la landing sin errores JavaScript ni capas duplicadas. La revisión de accesibilidad no detectó infracciones en escritorio ni móvil. También se revisó la conservación del ancho y del borde inferior de la portada en doce tamaños. Compilación y lint completados; permanece el aviso previo de tamaño del paquete JavaScript.

## Sustitución del movimiento por fondos estáticos

Esta revisión sustituye el recorrido animado por elección del usuario. Se retiran `CorrespondenceJourney`, sus observadores, el control de scroll y la importación de MotionPathPlugin. Se conservan los dos recursos ilustrados del avión y del sobre.

`CorrespondenceBackdrop` compone dos recorridos punteados con aviones y seis sobres estáticos distribuidos en los márgenes del fondo de las secciones intermedias. La decoración queda detrás del contenido, sin capturar clics ni formar parte del árbol accesible. No se extiende a la ilustración inicial ni a la del footer. En móvil se utiliza un avión con un recorrido breve y dos sobres ubicados en los espacios libres superiores e inferiores, sin añadir altura a las secciones. Las otras animaciones preexistentes de la interfaz permanecen.

Se comprobó que las piezas mantienen posición y rotación al hacer scroll, que no invaden las ilustraciones ni el área de contenido en escritorio y que no producen desbordamiento horizontal en 1920, 1440, 1366, 768, 390 y 320 px. Se revisaron visualmente el conjunto y la versión móvil. Compilación y lint completados correctamente.

## Ejemplo de correo como carta revisada

El bloque «Un correo bajo la lupa» se convierte en una sola hoja de correspondencia, en coherencia con el paisaje ilustrado y los sobres del fondo. Se eliminan el marco redondeado exterior, la cinta, el avatar y los paneles anidados. La hoja marfil tiene una esquina doblada realizada con CSS y un encabezado serif acorde con la composición editorial.

La petición de datos aparece subrayada en ocre; una anotación explica por qué conviene revisarla. La clasificación conserva su texto y el icono de alerta, presentada como un sello de tinta sin fondo rosa. El ejemplo ficticio y su resultado siguen identificados explícitamente. El dominio de ejemplo es texto, sin enlace navegable. No se modifica la lógica de análisis.

Se verificaron legibilidad, límites del sello, separación de palabras, ausencia de desbordamiento horizontal y accesibilidad del bloque en 1440, 768, 390 y 320 px. Se revisaron capturas de escritorio y móvil. Compilación y lint completados; permanece el aviso previo de tamaño del paquete JavaScript.

## Adaptación de la landing a teléfonos

La portada utiliza una ilustración vertical específica en pantallas de hasta 767 px en orientación vertical, seleccionada con `picture`. En escritorio y orientación horizontal conserva el paisaje original. La versión móvil mantiene el taller, el puente, el lago, los sobres, la persona que revisa la correspondencia y el avión de papel. El cielo permite superponer el título sin cubrir los elementos principales. La escena llega al borde inferior del viewport inicial mediante `100svh`; no se deforma y ocupa el ancho completo. En pantallas verticales más anchas se limita el cielo que excede la sección, conservando el paisaje inferior.

El header de hasta 639 px pasa a una fila con marca, menú desplegable nativo y acceso directo al analizador. El menú conserva Cómo funciona, El proyecto e Iniciar sesión; se cierra al seleccionar un enlace y las anclas mantienen el scroll suave. Los controles móviles principales tienen 44 px de altura. Se mejora el tamaño de lectura de los pasos y se reduce la altura del bloque TechText sin cambiar su velocidad de 0.5.

En móvil se muestran los seis sobres y los dos recorridos estáticos del avión detrás de las secciones. Los sobres tienen 15% de opacidad y los aviones 28%, con dimensiones mayores que antes para que sean reconocibles. La capa permanece decorativa, fuera del árbol accesible y sin interceptar toques. La carta de ejemplo y el bloque TechText conservan sus fondos sólidos.

### Recurso generado

`frontend/public/illustrations/correspondence-hero-mobile-v1.webp`: 1024×1536 px, aproximadamente 275 KiB, optimizado en WebP a partir del PNG generado con la herramienta integrada de imágenes. Referencia: `correspondence-hero-v1.webp`. El original de escritorio no se modifica.

Prompt: «Create a MOBILE PORTRAIT variant of the referenced Remira website illustration. Input image is a style and subject reference; preserve the same correspondence landscape identity, not a screenshot or UI. Output portrait 2:3 aspect ratio. Fine navy ink engraving and softly imperfect watercolor, warm ivory paper #f7f4e9, cobalt blue envelopes, golden windows, professional clean editorial illustration. COMPOSITION CRITICAL: the upper 55 percent of the entire canvas must be virtually empty uniform warm ivory sky for actual website text to be overlaid later. Do not draw text, symbols, clouds, birds, lettering or UI in that upper 55%. Compact but richly detailed scene entirely in lower45%: stone workshop with golden arches and mail shelves on lower left, winding stone bridge covered with ivory letters and cobalt envelopes over lake across foreground, a seated person examining mail with magnifying glass by a large blue open envelope on lower right. Compress and rearrange these familiar reference elements for portrait composition so ALL main subjects remain visible together in a phone screen. Small original-style cobalt paper airplane with subtle dotted flight line in the sky just ABOVE the buildings, but BELOW the empty upper55%. Distant lake and mountains connect both sides. Scene extends fully to left/right canvas edges, no frame, no rectangular panel, no border. Lower foreground delicately dissolves into the same warm ivory paper at very bottom as reference. No cropped person or central bridge, no new branding or extra subjects.»

### Verificación

Se comprobaron 320×568, 390×844, 430×932, 600×800, 767×1024, 844×390 y 1440×900 px: selección del recurso según orientación, carga de imagen, ancho completo, ausencia de desbordamiento horizontal y errores JavaScript. Se verificó el borde inferior del viewport en los tres tamaños de teléfono, el menú móvil, su cierre al seleccionar una sección y el desplazamiento suave. Los seis sobres permanecen visibles en móvil. La revisión de accesibilidad de la landing a 390 px no detectó infracciones; las capturas de portada y secciones se revisaron visualmente. Compilación y lint completados correctamente; permanece el aviso previo de tamaño del paquete JavaScript.

## Papel más neutro en móvil y escritorio

El fondo compartido cambia de `#f7f4e9` a `#f7f8f6` para reducir el matiz amarillo, manteniendo el azul de marca y el contraste del texto. La carta pasa a `#fcfcf9`. La transición hacia las secciones azules utiliza automáticamente el nuevo tono inicial.

Dos filtros SVG de presentación, con interpolación explícita en sRGB, ajustan el papel de las portadas sin regenerar ni editar los archivos. Se calibran por separado porque el cielo original tiene valores medios RGB distintos: aproximadamente (247, 244, 234) en escritorio y (250, 248, 237) en móvil. La transformación lineal de cada canal aproxima el papel a (247, 248, 246) y fija como referencia oscura la tinta (19, 44, 77). La selección del filtro utiliza la misma condición de ancho y orientación que `picture`; no se aplica al footer ni a otras pantallas.

En las capturas finales el fondo mide (247, 248, 246) en ambas vistas; una muestra del cielo central mide (247, 247, 246) en móvil y (247, 247, 247) en escritorio. La textura conserva pequeñas variaciones naturales. Esto armoniza la paleta de la web; los ajustes físicos de cada pantalla pueden seguir cambiando su apariencia.

Se repitieron las comprobaciones de los siete tamaños de la revisión móvil, sin desbordamientos ni errores JavaScript, y la revisión de accesibilidad a 390 px sin infracciones. Se revisó visualmente la nueva portada. Compilación y lint completados correctamente.

## Ilustración vertical del footer

El footer incorpora `frontend/public/illustrations/correspondence-footer-mobile-v1.webp`, generado con la herramienta integrada de imágenes a partir del footer original como referencia. Tiene 1024×1536 px (2:3), aproximadamente 341 KiB en WebP. Recompone el taller, el puente con cartas, el lago, la persona que lee y el avión dentro de una escena vertical; conserva la tinta marfil sobre azul nocturno.

Se selecciona mediante `picture` hasta 767 px en orientación vertical. Escritorio y horizontal conservan el recurso original. La imagen se muestra a ancho completo con altura proporcional. Su cielo se solapa parcialmente con la zona del llamado a la acción para evitar añadir un espacio vacío grande; texto y botón quedan por encima del paisaje. Una transición de color sobre el cielo superior integra el recurso con `#0f2f56`. No se recortan la escena ni sus personajes. La navegación permanece al inicio del footer.

Prompt: «Create a portrait MOBILE footer illustration for Remira, using the supplied image as the exact style, subject and palette reference. Portrait aspect ratio 2:3. Finely hand-engraved ivory ink on deep navy blue #0f2f56, slightly imperfect professional editorial illustration, subtle warm windows, NO text or UI. Recompose the reference landscape vertically, not a center crop: stone correspondence workshop with illuminated arched windows on middle-left, stone bridge covered with letters crossing lake and descending into foreground, envelopes on both banks, seated person reading a letter on middle-right, distant village, cypress trees, little sailboats and mountains. Entire central bridge and both people remain visible, richly detailed but clean. A small ivory paper airplane follows a delicate dotted path above the bridge, within the illustration. Upper 30% of canvas is quiet, uniform deep navy #0f2f56 sky, very few marks; this is intended for a website heading and button overlaid later. Scene occupies lower70% and extends fully left to right edge. The top edge must match solid #0f2f56 with no visible border, glow or lighter rectangle. Bottom ends with a natural lake surface fading gently into same deep navy at final 5% of canvas. Preserve original nocturnal ivory-on-navy identity. Avoid cropped bridge, cropped person, border, frame, typography, logos, giant blank sky, new objects.»

Verificación en 320×568, 390×844, 430×932, 600×800, 767×1024, 844×390 y 1440×900 px: selección y carga de imagen, proporción completa, ancho de pared a pared, navegación antes del llamado a la acción, botón por encima del paisaje y ausencia de desbordamiento y errores JavaScript. Revisión de accesibilidad del footer a 390 px sin infracciones y revisión visual de la composición. Compilación y lint completados correctamente.

## Unión inferior de la portada en escritorio

El borde inferior de la portada horizontal se integra con el fondo mediante una máscara CSS de transparencia gradual, limitada a los últimos 16–32 px según el ancho. Suaviza la tinta que alcanzaba el límite rectangular de la imagen. La composición, el ancho y la posición de la ilustración permanecen iguales; la portada vertical conserva su terminación natural.

Se revisó visualmente la unión en una captura a 1920 px. La última fila de imagen presenta una desviación máxima de cuatro unidades RGB respecto del fondo, sin el corte anterior. También se comprobó que la máscara está desactivada en la versión vertical. Compilación y lint completados correctamente.

## Portada de escritorio regenerada con borde ilustrado

Esta revisión sustituye la máscara de la revisión anterior, rechazada por el usuario. La herramienta integrada de imágenes regeneró la portada horizontal tomando `correspondence-hero-v1.webp` como imagen a editar y `correspondence-hero-mobile-v1.webp` como referencia exclusivamente para la terminación inferior.

`frontend/public/illustrations/correspondence-hero-v2.webp`: 2172×724 px, proporción 3:1, aproximadamente 303 KiB en WebP. Conserva la composición del taller, el puente con correspondencia, el lago, la persona que examina cartas y el avión. El primer plano termina en siluetas irregulares y pequeños trazos de tinta, dejando una franja de papel limpio por debajo. El acabado forma parte del dibujo. Se retira `mask-image` y se recalibra el ajuste sRGB de escritorio para el papel neutro de la nueva imagen. El recurso vertical sigue siendo el mismo.

Prompt: «EDIT the FIRST reference image (wide desktop landscape), retaining its original ULTRAWIDE 3:1 aspect ratio, framing, scale, composition and all subjects. The SECOND reference (portrait mobile) is ONLY a reference for the NATURAL DRAWN LOWER EDGE, never for layout. Keep the first image's arched workshop on left, mail-covered stone bridge across lake, village/mountains, person examining letters inside huge blue envelope on right, original small paper airplane and dotted trail. Preserve fine navy ink etching, cobalt blues and gold highlights, ample blank sky. REQUEST: redraw only the LOWEST 8–12 percent of the wide landscape so it ends organically on paper EXACTLY like the portrait reference: irregular silhouettes of plants, rocks, letters and small delicate ink strokes peter out into completely clean paper, with varied scalloped/jagged drawn edge heights. The LOWERMOST 2–3 percent must be clean uninterrupted paper across full width, including both corners. No foliage, envelopes or ink can touch the bottom border. Extend/rearrange the very lowest foreground details upward a little if needed; do not crop central bridge or person. NO white fog, NO blur, NO smooth horizontal opacity gradient, NO soft airbrush strip, NO rectangular dividing line. This is an intentional illustrated vignette with sharply drawn small details ending sparsely and irregularly, just like the second reference, then bare paper. Paper everywhere (sky and bottom margin) should be neutral near-white #f7f8f6, without yellow tint or shadows. Do not add text, logo, border or new subjects. Preserve the complete first image landscape and ultrawide 3:1 shape.»

Verificación en 1920×914, 1440×900, 1366×768, 844×390 y 390×844 px: recurso generado seleccionado en escritorio, versión vertical conservada, ausencia de máscara y alineación con el borde inferior del viewport. Se revisaron la imagen generada y su composición dentro de la landing. La última fila contiene papel limpio, sin trazos oscuros que lleguen al borde. Compilación y lint completados correctamente.
