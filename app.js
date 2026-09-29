/**
 * TaskFlow - Gestión de Tareas
 * Cumplimiento de consigna: POO, ES6+, Manipulación del DOM, Asincronía y LocalStorage
 */

// =============================================================================
// 1. ORIENTACIÓN A OBJETOS (POO) & ES6+
// =============================================================================

class Tarea {
  constructor({ id = Date.now().toString(), descripcion, estado = 'pendiente', fechaCreacion = new Date().toISOString(), fechaLimite = null }) {
    this.id = id;
    this.descripcion = descripcion;
    this.estado = estado; // 'pendiente' | 'completada'
    this.fechaCreacion = fechaCreacion;
    this.fechaLimite = fechaLimite;
  }

  cambiarEstado() {
    this.estado = this.estado === 'pendiente' ? 'completada' : 'pendiente';
  }
}

class GestorTareas {
  constructor() {
    this.tareas = [];
    this.cargarStorage();
  }

  agregarTarea(tarea) {
    this.tareas = [tarea, ...this.tareas]; // Spread operator
    this.sincronizarStorage();
  }

  eliminarTarea(id) {
    this.tareas = this.tareas.filter((t) => t.id !== id);
    this.sincronizarStorage();
  }

  obtenerTarea(id) {
    return this.tareas.find((t) => t.id === id);
  }

  sincronizarStorage() {
    localStorage.setItem('taskflow_tareas', JSON.stringify(this.tareas));
  }

  cargarStorage() {
    const datos = localStorage.getItem('taskflow_tareas');
    if (datos) {
      try {
        const tareasParseadas = JSON.parse(datos);
        this.tareas = tareasParseadas.map((item) => new Tarea(item));
      } catch (e) {
        console.error('Error al parsear tareas de localStorage:', e);
        this.tareas = [];
      }
    }
  }

  filtrar({ busqueda = '', filtro = 'todas' }) {
    return this.tareas.filter((tarea) => {
      const coincideTexto = tarea.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado = filtro === 'todas' ? true : tarea.estado === filtro;
      return coincideTexto && coincideEstado;
    });
  }
}

// =============================================================================
// 2. MANIPULACIÓN DEL DOM Y EVENTOS
// =============================================================================

const gestor = new GestorTareas();

// Referencias del DOM
const form = document.getElementById('task-form');
const inputDescripcion = document.getElementById('descripcion');
const inputFechaLimite = document.getElementById('fecha-limite');
const formError = document.getElementById('form-error');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const statsElement = document.getElementById('stats');
const searchInput = document.getElementById('buscador');
const filterContainer = document.getElementById('filtros');
const filterButtons = document.querySelectorAll('.filter-btn');
const toastContainer = document.getElementById('toast-container');
const btnSpinner = document.getElementById('btn-spinner');
const btnLabel = document.querySelector('.btn__label');

let filtroActual = 'todas';
let busquedaActual = '';

// Notificación flotante temporal (Requisito 4: 2 segundos)
const mostrarToast = (mensaje) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensaje;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
};

// Actualizar estadísticas en el header
const actualizarEstadisticas = () => {
  const total = gestor.tareas.length;
  const pendientes = gestor.tareas.filter((t) => t.estado === 'pendiente').length;
  statsElement.textContent = `${total} tareas · ${pendientes} pendientes`;
};

// Renderizar la lista de tareas en el DOM
const renderizarTareas = () => {
  const tareasFiltradas = gestor.filtrar({
    busqueda: busquedaActual,
    filtro: filtroActual
  });

  taskList.innerHTML = '';

  if (tareasFiltradas.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;

    tareasFiltradas.forEach((tarea) => {
      // Destructuring ES6+
      const { id, descripcion, estado, fechaLimite } = tarea;
      const esCompletada = estado === 'completada';

      const li = document.createElement('li');
      li.className = `task-item ${esCompletada ? 'is-completed' : ''}`;
      li.dataset.id = id;

      // Template Literals ES6+
      li.innerHTML = `
        <div class="task-item__content">
          <input 
            type="checkbox" 
            class="task-item__check" 
            ${esCompletada ? 'checked' : ''} 
            aria-label="Marcar tarea como completada"
          />
          <span class="task-item__text">${descripcion}</span>
        </div>
        <div class="task-item__actions">
          ${fechaLimite ? `<span class="task-item__deadline">📅 ${fechaLimite.replace('T', ' ')}</span>` : ''}
          <button type="button" class="btn-delete" aria-label="Eliminar tarea">✕</button>
        </div>
      `;

      // Eventos mouseover y mouseout para interactividad
      li.addEventListener('mouseover', () => li.classList.add('task-item--hover'));
      li.addEventListener('mouseout', () => li.classList.remove('task-item--hover'));

      taskList.appendChild(li);
    });
  }

  actualizarEstadisticas();
};

// Manejo del formulario (Submit con retardo asíncrono simulado)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const descripcion = inputDescripcion.value.trim();
  const fechaLimite = inputFechaLimite.value;

  if (!descripcion) {
    formError.textContent = 'Por favor, escribe una descripción para la tarea.';
    formError.hidden = false;
    inputDescripcion.focus();
    return;
  }

  formError.hidden = true;

  // Feedback de carga (simulando retardo)
  btnSpinner.hidden = false;
  btnLabel.textContent = 'Guardando...';

  setTimeout(() => {
    const nuevaTarea = new Tarea({ descripcion, fechaLimite });
    gestor.agregarTarea(nuevaTarea);

    renderizarTareas();
    mostrarToast('¡Tarea agregada exitosamente!');

    form.reset();
    btnSpinner.hidden = true;
    btnLabel.textContent = 'Agregar';
    inputDescripcion.focus();
  }, 400);
});

// Delegación de eventos en la lista de tareas (click)
taskList.addEventListener('click', (e) => {
  const taskItem = e.target.closest('.task-item');
  if (!taskItem) return;

  const id = taskItem.dataset.id;
  const tarea = gestor.obtenerTarea(id);

  // Marcar como completada
  if (e.target.classList.contains('task-item__check')) {
    tarea.cambiarEstado();
    gestor.sincronizarStorage();
    renderizarTareas();
  }

  // Eliminar tarea
  if (e.target.classList.contains('btn-delete')) {
    gestor.eliminarTarea(id);
    renderizarTareas();
    mostrarToast('Tarea eliminada');
  }
});

// Evento keyup en el buscador para filtrar en tiempo real
searchInput.addEventListener('keyup', (e) => {
  busquedaActual = e.target.value;
  renderizarTareas();
});

// Filtrar por estado (Todas / Pendientes / Completadas)
filterContainer.addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter-btn')) return;

  filterButtons.forEach((btn) => btn.classList.remove('is-active'));
  e.target.classList.add('is-active');

  filtroActual = e.target.dataset.filtro;
  renderizarTareas();
});

// Carga inicial al abrir el navegador
document.addEventListener('DOMContentLoaded', () => {
  renderizarTareas();
});