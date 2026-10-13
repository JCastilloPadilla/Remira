# Historial: el registro de tus miradas

Fecha: 13 de octubre de 2026. Ruta: `/historial`.

El historial adopta el lenguaje de correspondencia de Remira: papel neutro
`#f7f8f6`, hoja `#fffefa`, tinta `#132f50`, azul `#2457c5` y bruma `#e5edf2`.
Georgia destaca títulos y asuntos; Manrope presenta datos y controles; Fraunces
conserva la identidad de marca.

## Composición

Encabezado integrado sin divisor, navegación centrada en escritorio y menú en
teléfono. El título entra por palabras con `SplitText` de React Bits. Una caja
de archivo con cartas acompaña la cabecera y el estado vacío.

Los registros se presentan sobre una hoja con borde de tinta azul. La tabla
de escritorio conserva columnas de correo, fecha, clasificación, confianza y
detalle. En teléfono cada fila se convierte en una ficha: asunto, fecha y
confianza, clasificación y acceso al detalle. Se conserva la estructura
semántica de tabla y sus encabezados accesibles.

Búsqueda y clasificación ocupan todo el ancho en teléfono. Las fechas comparten
una fila desde 480 px; por debajo se apilan para mostrar la fecha completa.
Los controles conservan altura de al menos 44 px y tamaño
de texto de 16 px en móvil. El diálogo se desplaza dentro de la pantalla; el
resultado permanece visible independientemente del desplazamiento del documento.
La entrada breve del resultado respeta movimiento reducido.

Sobres y recorridos de avión estáticos acompañan el fondo. Se reutiliza
`IllustratedFooter`, sus imágenes de PC y móvil y la transición corta al azul
nocturno del inicio.

## Funcionamiento conservado

Se mantienen búsqueda por asunto, clasificación, fechas inicial y final,
validación del intervalo, contador, restablecimiento de filtros, historial vacío
y recuperación de ejemplos. Los detalles muestran mensaje, fecha, origen y
resultado preparado: legítimo al 93 % y potencialmente malicioso al 97 %.
Los enlaces de los mensajes permanecen como texto.

Los dos registros siguen siendo ficticios. Esta pantalla no guarda ni recibe
los análisis del analizador o de la bandeja. Recargar o salir reinicia filtros,
selección y visualización de ejemplos. No se incorporó almacenamiento ni backend.

## Ilustración generada

Activo: `frontend/public/illustrations/history-archive-v1.webp`, 768 × 512 px,
canal alfa, 99 656 bytes. Generado con ImageGen y
`correspondence-guide-v1.webp` como referencia exclusiva de estilo. La misma
composición completa se muestra en cabecera a 190 px en PC y 180 px en móvil,
y a 220 px en el estado vacío.

Original conservado en:
`C:/Users/joose/.codex/generated_images/01a0f076-b655-7f70-bf70-54844aea57a1/exec-204488e8-8771-4ae7-afb2-618b7518c1c3.png`.
Se redujo y comprimió a WebP conservando transparencia.

Prompt utilizado:

> Use case: illustration-story. New isolated editorial vignette for Remira
> analysis history, archival correspondence theme. Provided reference is STYLE
> ONLY: fine etched navy ink, cobalt blue watercolor, neutral ivory paper and
> modest brass gold, slightly imperfect hand drawn craft. Landscape 3:2 genuinely
> transparent background. A compact CLOSED navy-blue archival correspondence
> box with a tiny blank brass label, two complete ivory envelopes resting on
> its lid tied together with a thin navy ribbon, a small ivory index card
> leaning against the box, a brass bookmark and a delicate blue olive sprig
> beside it. Keep box visibly different from an open incoming mail tray. Calm
> visual of keeping a record and looking back. No text, readable lettering,
> logos, icons, magnifying glass, people, desk, landscape, background rectangle,
> glow, outer shadow. Complete objects, 12% transparent margins; readable at
> 180px wide. Match Remira professional ink-and-watercolor illustrations closely,
> no flat clipart.

## Verificación

Compilación de producción y lint. Revisión en navegador a 320, 390, 768, 1024,
1440 y 1920 px, imágenes cargadas y sin desbordamiento horizontal. Búsqueda sin
distinguir mayúsculas, filtros combinados, fechas inclusivas, intervalo inválido,
restablecimiento, ambos detalles y resultados, historial vacío, recuperación de
ejemplos, navegación móvil y reinicio al recargar. Axe WCAG A/AA en pantalla,
vacío, error y diálogos; también se comprueba movimiento reducido. Las pruebas
automáticas no sustituyen una auditoría manual completa.

Scripts y capturas en `tmp/landing-qa`, carpeta ignorada por Git. No hay
dependencias nuevas para el producto.
