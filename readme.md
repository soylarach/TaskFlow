# Informe del Proyecto: TaskFlow

## ¿De qué trata el proyecto?

**TaskFlow** es una aplicación web sencilla, rápida y moderna diseñada para ayudar a las personas a organizar sus pendientes del día a día. Permite crear tareas, indicarles una fecha límite opcional, marcarlas como completadas, filtrarlas y borrarlas, todo desde una interfaz limpia y sin recargar la página.

---

## ¿Cómo está construida y qué funcionalidades incluye?

* **Estructura organizada (Objetos):** La aplicación trata cada pendiente como una "Tarea" individual con su propia información (nombre, fecha y estado) y utiliza un "Gestor" central que las reúne, las ordena y se encarga de guardar los cambios.
* **JavaScript moderno:** Se utilizaron las formas actuales de escribir código para que el programa sea más claro, ordenado y fácil de mantener en el tiempo.
* **Interactividad y respuesta en vivo:**
* Al enviar el formulario, la nueva tarea aparece directamente en pantalla.
* Se puede marcar como lista con un clic sobre el selector o eliminar con el botón lateral.
* El buscador filtra los pendientes en tiempo real a medida que escribes cada letra.
* Al pasar el cursor sobre cada elemento se generan efectos visuales suaves para mejorar la experiencia de uso.


* **Sensación de aplicación real (Asincronía):**
* Al guardar una tarea, el botón muestra brevemente un indicador de carga antes de agregarla, simulando la conexión con un servidor.
* Aparece un mensaje flotante de confirmación ("¡Tarea agregada exitosamente!") que desaparece de forma automática tras dos segundos.


* **Los datos no se pierden:** La aplicación guarda la lista directamente en la memoria del navegador (`localStorage`), de modo que si el usuario recarga la página o cierra la pestaña, sus tareas siguen intactas al volver.

---

## ¿Cómo probar la aplicación?

1. Abre la carpeta del proyecto en **Visual Studio Code**.
2. Haz clic derecho sobre el archivo `index.html` y selecciona **Open with Live Server** (o ábrelo directamente en tu navegador habitual).
3. Prueba agregando una tarea, escribiendo en el buscador para filtrar y recargando la página para comprobar que la información se mantiene guardada.
