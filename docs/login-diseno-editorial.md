# Inicio de sesión: una hoja de bienvenida

Fecha: 13 de octubre de 2026. Ruta: `/login`.

Última pantalla del rediseño visual de Remira. Mantiene papel neutro `#f7f8f6`,
hoja `#fffefa`, tinta `#132f50`, acción `#2457c5` y bruma `#e5edf2`. Fraunces
identifica la marca, Georgia da forma a títulos y Manrope a controles y lectura.

## Composición

Encabezado sin divisor con marca y regreso al inicio. En escritorio, bienvenida
ilustrada a la izquierda y acceso sobre papel a la derecha. El título principal
entra por palabras mediante `SplitText` de React Bits. La ilustración presenta
una puerta azul abierta a un espacio de correspondencia.

Google y acceso sin cuenta son las acciones principales. La bandeja de ejemplo
queda como acceso secundario. Los permisos de Gmail se explican separados de
la identidad. Se eliminan el bloque de funciones futuras y la etiqueta de maqueta;
se conserva la explicación breve y explícita de que el acceso es una demostración.

En móvil la bienvenida se conserva, con ilustración de 160 px y una sola columna.
El acceso se adapta al ancho disponible. Botones de al menos 44 px, foco visible,
texto legible y movimiento reducido. No se añadieron campos de contraseña ni
requisitos de cuenta para el analizador.

Sobres y recorridos de avión estáticos acompañan el fondo. El footer utiliza
`IllustratedFooter`, las imágenes de escritorio y móvil del inicio y la misma
transición corta hacia azul nocturno.

## Comportamiento

Continuar con Google muestra un aviso accesible; no autentica, no abre un flujo
externo ni solicita permisos. Repetir el clic conserva un único aviso. Continuar
sin cuenta abre `/analizar`; la bandeja de demostración abre `/bandeja`; volver al
inicio abre `/`. Recargar o salir borra el aviso. La conexión real de Google
sigue fuera del alcance de la maqueta.

## Ilustración generada

Activo: `frontend/public/illustrations/login-welcome-v1.webp`, 768 × 512 px,
canal alfa, 101 556 bytes. Generado con ImageGen usando
`correspondence-guide-v1.webp` únicamente como referencia de estilo. Se muestra
completo a 360 px en PC y 160 px en móvil.

Original conservado en:
`C:/Users/joose/.codex/generated_images/01a0f076-b655-7f70-bf70-54844aea57a1/exec-ec409154-430f-457e-b36a-64758095d00f.png`.
La versión web se redujo y comprimió conservando transparencia.

Prompt utilizado:

> Use case: illustration-story. NEW isolated Remira welcome/sign-in vignette.
> Provided image is STYLE REFERENCE ONLY: finely etched navy ink, cobalt
> watercolor, neutral ivory stone/paper, restrained brass accents, slightly
> imperfect hand drawn professional craft. Compact landscape 3:2 on genuinely
> transparent background. A tiny graceful freestanding arched cobalt blue
> doorway, partly open, with two low ivory stone steps and a slim olive sprig
> growing beside it; inside the arch is a hint of neatly arranged ivory
> correspondence envelopes on navy shelves, one complete folded blue paper
> airplane resting on the lower step. Welcoming quiet entrance to a correspondence
> reading room, no people, no text/lettering/logos, no key, no shield, no padlock,
> no background walls or landscape, no sky, no outer shadow or glow, no background
> rectangle. Every object complete with generous 12% transparent margins.
> Readable at 160px wide. Match Remira handcrafted editorial illustration style,
> subtle and professional, not flat clipart or futuristic.

## Verificación

Compilación de producción y lint. Navegador a 320, 390, 768, 1024, 1440 y
1920 px: imágenes cargadas, sin desbordamiento horizontal y revisión de capturas.
Aviso de Google, clic repetido, permanencia en login sin autenticación, reinicio
al recargar y navegación a analizador, bandeja e inicio. Axe WCAG A/AA en pantalla
y aviso; también movimiento reducido. Las comprobaciones automáticas no sustituyen
una auditoría manual completa.

Scripts y capturas en `tmp/landing-qa`, ignorados por Git. Sin dependencias nuevas
para el producto.
