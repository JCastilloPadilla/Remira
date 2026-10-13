# Navegación compartida y orientación en Remira

Fecha: 13 de octubre de 2026.

## Problema observado

Las páginas mantenían encabezados independientes. Los destinos cambiaban de
orden, el analizador faltaba en algunos menús, el login solo ofrecía volver al
inicio y el analizador utilizaba «Cómo funciona» para abrir una ayuda en diálogo.
Los indicadores de página actual variaban o faltaban. Eso hacía más difícil
aprender la navegación y saber dónde se estaba.

## Cambio

Las siete páginas utilizan `SiteHeader`, con una única lista de destinos:

| Nombre | Destino | Uso |
| --- | --- | --- |
| Inicio | `/` | Presentación de Remira. |
| Analizador | `/analizar` | Pegar un correo y explorar el análisis. |
| Bandeja | `/bandeja` | Leer los correos de ejemplo. |
| Historial | `/historial` | Consultar los registros de ejemplo. |
| Cuenta | `/cuenta` | Revisar acceso y conexiones. |
| Cómo funciona | `/como-funciona` | Leer la guía y los límites. |
| Iniciar sesión | `/login` | Explorar el acceso y continuar sin cuenta. |

Orden y nombres permanecen estables en todo el sitio. La página activa tiene
`aria-current="page"`, tinta azul y el delineado dorado de Inicio, ahora persistente.
La misma línea entra suavemente al pasar el cursor o enfocar un enlace.

En escritorio se mantiene el conjunto centrado, sin línea divisora; el acceso
queda distinguido como botón. Por debajo de 960 px se utiliza el mismo menú
desplegable en todas las páginas. El encabezado muestra «Estás en» y la página
actual antes de abrirlo; dentro del menú, el destino activo indica «Estás aquí».
El menú cierra al navegar, al pulsar Escape o al tocar fuera; Escape devuelve
el foco al control de apertura. El contenido conserva sus encabezados propios.

La ayuda en diálogo del analizador se conserva junto a su introducción y pasa
a llamarse «Ayuda rápida». Abrirla conserva el borrador; el enlace a la guía
completa mantiene la apertura en otra pestaña. «Cómo funciona» tiene el mismo
nombre en header y footer y siempre identifica la guía.

Los enlaces a secciones informativas de Inicio siguen en el hero y footer,
con su desplazamiento suave. «Volver al inicio» conserva el regreso al comienzo
del documento, incluyendo el header. No se añadieron pantallas, autenticación,
almacenamiento ni permisos reales.

## Implementación y verificación

Componente y estilos en `frontend/src/components/SiteHeader.tsx` y
`site-header.css`. Se eliminan listas, encabezados y estilos locales duplicados.
Se ajusta la altura de referencia de la portada para mantener la ilustración
adaptada al viewport con el nuevo header de 88 px.

Compilación, lint y navegador a 320, 390, 768, 959, 960, 1024 y 1440 px en
las siete rutas. Comprobación de mismos enlaces y orden, único indicador activo,
ausencia de desbordamiento, cierre y teclado del menú móvil, recorridos completos
sin recargar, accesibilidad automática axe del encabezado, ayuda rápida que
conserva el borrador y preguntas frecuentes conservadas. Se revisan capturas
de escritorio, teléfono y menú abierto. Las pruebas automáticas no sustituyen
una auditoría de accesibilidad ni un estudio de usabilidad con usuarios.

Scripts y capturas en `tmp/landing-qa`, ignorados por Git. Sin dependencias nuevas.
