class Tarea {
    constructor(id, descripcion) {
        this.id = id;
        this.descripcion = descripcion;
        this.estado = "pendiente"; // "pendiente" o "completada"
        this.fechaCreacion = new Date().toISOString();
    }

    // Método para cambiar el estado de la tarea
    cambiarEstado() {
        this.estado = this.estado === "pendiente" ? "completada" : "pendiente";
    }
}

class GestorTareas {
    constructor() {
        this.tareas = [];
    }

    // Método para agregar tarea  (template literals, let/const)
    agregarTarea(descripcion) {
        const id = Date.now(); // ID único basado en el timestamp actual
        const nuevaTarea = new Tarea(id, descripcion);
        
        // añadir la tarea de forma inmutable
        this.tareas = [...this.tareas, nuevaTarea];
        
        console.log(`Tarea creada exitosamente: ${descripcion}`);
        return nuevaTarea;
    }

    // eliminar tarea usando arrow functions y filter
    eliminarTarea(id) {
        this.tareas = this.tareas.filter(tarea => tarea.id !== id);
    }
}

// Instanciamos nuestro gestor para probarlo
const miGestor = new GestorTareas();

// Prueba rápida en consola
miGestor.agregarTarea("Estructurar el proyecto TaskFlow");
console.log("Estado actual del gestor:", miGestor.tareas);