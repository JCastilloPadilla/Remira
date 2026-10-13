# Bandeja: una mesa de correspondencia

Fecha: 13 de octubre de 2026. Ruta: `/bandeja`.

La bandeja adopta el diseño editorial de Remira sin cambiar los mensajes de
ejemplo ni su clasificación simulada. El encabezado integra la marca Fraunces,
navegación y acceso al analizador; el título entra por palabras con `SplitText`
de React Bits. Georgia se usa en asuntos y títulos y Manrope en lectura y controles.

Papel `#f7f8f6`, hoja `#fffefa`, tinta `#132f50`, azul `#2457c5` y bruma
`#e5edf2` mantienen la paleta. Verde `#1b694f` y granate `#92374b` distinguen
resultados, siempre acompañados por texto.

## Composición y adaptación

En escritorio, lista a la izquierda y correo abierto sobre una hoja a la derecha.
La lista conserva búsqueda y selector de filtro. La selección se distingue con
tinta azul en el margen. El resultado aparece debajo del texto, con un sello
de revisión y su confianza identificada como ilustrativa.

En teléfono se muestra la lista o el correo seleccionado. La vuelta a mensajes
conserva búsqueda, filtro y resultados; devuelve el foco al título de la lista
y desplaza la vista después de actualizar el contenido. Abrir un correo lleva
al detalle con foco y desplazamiento suave. Se respeta movimiento reducido.

La ilustración nueva acompaña la espera en escritorio y la lista inicial en
móvil, completa y sin recorte. Sobres y recorridos de avión quedan como fondo
estático. El footer utiliza `IllustratedFooter` y sus mismas imágenes adaptadas
de inicio, ayuda y cuenta, con una transición corta a azul nocturno.

## Funcionalidad conservada

Dos mensajes ficticios; búsqueda por asunto o remitente; filtros de todos,
pendientes, legítimos y potencialmente maliciosos; estado sin coincidencias y
restablecimiento. Selección, carga, bloqueo mientras se analiza, resultado,
repetición y cancelación de la solicitud al abandonar la página. El diálogo de
Gmail explica la demostración y permite ir a login, sin solicitar permisos.
Recargar reinicia mensajes analizados, filtros y selección; no hay persistencia
ni acceso a correos reales.

## Ilustración

Activo: `frontend/public/illustrations/inbox-correspondence-v1.webp`, 768 × 512,
transparencia, 91 488 bytes. Generado con ImageGen usando
`correspondence-guide-v1.webp` como referencia de estilo. La misma composición
se muestra a 310 px en escritorio y 190 px en móvil.

Original conservado en:
`C:/Users/joose/.codex/generated_images/01a0f076-b655-7f70-bf70-54844aea57a1/exec-ec230c80-f0c3-438c-9abb-d9e5b76e1ada.png`.
La versión web se redujo y comprimió conservando alfa.

Prompt utilizado:

> Use case: illustration-story. New isolated Remira inbox editorial vignette.
> Supplied image is ONLY a STYLE reference: fine hand-etched navy ink, detailed
> cobalt watercolor, neutral ivory paper, modest brass gold, gently imperfect
> professional hand drawing. NEW compact landscape 3:2 composition on truly
> transparent background: a low blue wooden correspondence tray with three
> ivory envelopes loosely stacked inside, one open blue envelope standing
> behind, a small folded cobalt paper airplane resting beside the tray, tiny
> brass letter opener and a delicate blue olive sprig. No desk/table, no people,
> no landscape, no magnifying glass, no text/readable handwriting/logos, no
> border, no background rectangle, no glow, no shadow outside objects. Complete
> objects with generous 12% transparent margin. At 220px wide the tray, letters
> and plane must remain clear. A quiet tactile invitation to open a letter,
> fits existing Remira illustrations, not flat clipart.

## Verificación

Compilación y lint; navegador a 320, 390, 768, 1024, 1440 y 1920 px, imágenes
cargadas, sin desbordamiento horizontal. Revisión visual de capturas en PC y
teléfono y recorridos de búsqueda, filtros, ambos resultados (93 % y 97 %),
carga, repetición, diálogo, menú móvil, regreso con foco y reinicio al recargar.
Comprobaciones axe WCAG A/AA en pantalla y estados principales; movimiento reducido.
Las comprobaciones automáticas no sustituyen una auditoría manual completa.

Scripts y capturas en `tmp/landing-qa`, ignorados por Git. Sin dependencias nuevas
para el producto.
