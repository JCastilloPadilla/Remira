# Desplazamiento suave entre secciones

Fecha: 13 de octubre de 2026.

Se unifica el desplazamiento interno de las siete páginas de Remira mediante
`html { scroll-behavior: smooth; }` en el CSS global. Antes, esa regla solo se
activaba mientras estaban montadas Inicio o Cómo funciona; los enlaces internos
del resto de pantallas saltaban directamente al destino.

Se eliminan las clases temporales `landing-scroll` y `help-scroll`, sus efectos
de montaje y sus reglas duplicadas. La preferencia de movimiento reducido queda
cubierta por la regla global existente, que desactiva el scroll animado.

## Enlaces y controles revisados

- Inicio: Cómo funciona, El proyecto, enlace del hero, menú móvil y regreso desde el footer.
- Cómo funciona: Empieza por aquí, regreso al inicio y Ayuda en su propio footer.
- Analizador: regreso al inicio; Analizador y Probar el analizador en su propio
  footer ahora apuntan al contenido mediante un ancla. Se conserva el borrador.
- Cuenta, Bandeja, Historial y Login: regreso desde el footer y enlace accesible
  Ir al contenido.
- Bandeja móvil: selección y vuelta a mensajes conservan foco y desplazamiento
  suave después de actualizar la vista.
- Analizador móvil: llegada al resultado conserva su desplazamiento suave
  después de actualizar el contenido.

Las animaciones de preguntas frecuentes y resultados se mantienen. La apertura
de otra página sigue iniciándola arriba, y los enlaces externos mantienen su
comportamiento. Los enlaces internos conservan su hash, destinos y navegación
nativa; no se interceptan mediante un controlador global de clics.

## Verificación

Compilación y lint. Navegador real a 1440 y 390 px en las siete rutas, con y sin
preferencia de movimiento reducido. Las pruebas registran posiciones de scroll
en fotogramas sucesivos para comprobar que existe recorrido intermedio, llegada
correcta al destino y desplazamiento inmediato únicamente con movimiento reducido.
Se revisan enlaces principales de Inicio y Ayuda, regreso desde todos los footers,
acción del analizador en su propio footer y mantenimiento del comportamiento tras
navegación de React Router. Se conserva la revisión funcional de desplazamiento
al resultado y retorno a mensajes en móvil.

Scripts de comprobación en `tmp/landing-qa`, ignorados por Git. No hay nuevas
dependencias ni cambios de diseño o almacenamiento.
