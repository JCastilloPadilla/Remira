# Cuenta y conexiones: diseño editorial de Remira

Fecha: 13 de octubre de 2026. Ruta: `/cuenta`.

La página conserva la separación entre identidad y autorización del correo.
Se rediseña con papel neutro `#f7f8f6`, tinta `#132f50`, azul `#2457c5`, hoja
`#fffefa` y bruma `#e5edf2`. Fraunces identifica la marca; Georgia da forma a
los títulos y Manrope a controles y explicaciones.

## Composición

- Encabezado integrado, sin divisor; navegación centrada en escritorio y menú
  desplegable en teléfono, con acceso directo al analizador.
- Entrada breve con animación por palabras de React Bits, respetando movimiento reducido.
- Acceso a la cuenta como ficha abierta; conexión con Gmail sobre una hoja de
  correspondencia, con estado visible y acciones separadas.
- Nota lateral ilustrada: dos cartas y una llave representan las decisiones
  distintas de iniciar sesión y autorizar Gmail.
- Sobres y recorridos de avión estáticos en el fondo. Footer reutilizado mediante
  `IllustratedFooter`, con las mismas imágenes de escritorio y móvil del inicio
  y una transición corta hacia su azul nocturno.

En teléfono, cuenta, conexión y nota se leen en una columna. Las etiquetas de
estado ocupan su propia fila para no comprimir los títulos. Los botones tienen
un mínimo de 44 px de alto y la ilustración se muestra completa, sin recorte,
a 250 px de ancho. En escritorio se distribuyen ajustes y nota en dos columnas.

## Comportamiento conservado

No se inicia una sesión real ni se solicitan permisos de Google. Se conserva
el diálogo de conexión, la conexión ficticia, la confirmación y cancelación de
desconexión, los avisos accesibles y el reinicio al recargar o salir. La identidad
de ejemplo no se persiste y los enlaces a login y bandeja siguen disponibles.

## Ilustración nueva

Archivo: `frontend/public/illustrations/account-correspondence-v1.webp`.
768 × 512 px, canal alfa, 75 078 bytes. Su composición compacta permite utilizar
el mismo activo en PC y móvil sin ocultar objetos.

Generada con ImageGen; `guide-private-letter-v1.webp` se proporcionó únicamente
como referencia del estilo. El original se conserva en:
`C:/Users/joose/.codex/generated_images/01a0f076-b655-7f70-bf70-54844aea57a1/exec-db3b3d6e-f477-459e-a531-2934e01da332.png`.
La versión web se redujo y comprimió conservando transparencia.

Prompt utilizado:

> Use case: illustration-story. Create a NEW Remira account-and-permissions
> editorial illustration. Supplied image is STYLE REFERENCE ONLY: fine navy
> etched ink lines, cobalt blue watercolor, neutral ivory paper and restrained
> brass gold. Isolated compact landscape 3:2 composition on genuinely transparent
> background: two ivory correspondence envelopes side by side, one closed with
> a tiny navy wax seal, one open cobalt envelope with a letter; a small elegant
> antique brass key lies BETWEEN them, delicate blue olive sprig on one side,
> a navy fountain pen on the other. Visual idea: identity and mail access are
> separate decisions. All objects complete, 12% transparent margin, graceful
> hand-drawn slightly imperfect craftsmanship, legible when displayed 240px
> wide. No text, no lettering, no logos, no shields, no lock icons, no desk,
> no landscape, no people, no background rectangle, no outer shadows or glow.
> Follow existing Remira illustration style closely but different composition.

## Verificación

Compilación de producción y lint; revisión en navegador a 320, 390, 768, 1024,
1440 y 1920 px, carga de imágenes y ausencia de desbordamiento horizontal.
Revisión de capturas en PC y teléfono, de ambos estados de conexión, menú móvil,
diálogo, confirmación/cancelación, avisos y reinicio al recargar. Comprobaciones
automáticas axe de WCAG A/AA en pantalla y diálogos, incluido movimiento reducido.
Estas comprobaciones no sustituyen una auditoría manual completa.

Scripts y capturas en `tmp/landing-qa`, ignorados por Git. No se añadieron
dependencias al producto.
