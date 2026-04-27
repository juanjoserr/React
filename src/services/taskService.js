// src/services/taskService.js
// axios es una librería para hacer peticiones HTTP mucho más cómoda que fetch
import axios from 'axios';

// Crea una instancia de axios con la URL base de tu backend
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // ¡Cámbiala por la URL de tu backend!
  headers: {
    'Content-Type': 'application/json',
  },
});

// Datos de prueba para demo (mock)
let mockTasks = [
  { id: 1, title: 'Investigar React Router', description: 'Ver documentación oficial y ejemplos de React Router Dom para manejar la navegación entre páginas en una SPA.', completed: true, createdAt: '2025-05-01' },
  { id: 2, title: 'Crear componente TaskItem', description: 'Diseñar la tarjeta de tarea individual con estilos CSS y botones de acción (eliminar y ver detalles).', completed: false, createdAt: '2025-05-03' },
  { id: 3, title: 'Configurar Vite + React', description: 'Levantar el proyecto frontend usando Vite como bundler y React como librería de componentes.', completed: true, createdAt: '2025-05-05' },
  { id: 4, title: 'Conectar con backend', description: 'Implementar axios para realizar llamadas API al servidor de tareas (GET, POST, DELETE).', completed: false, createdAt: '2025-05-07' },
];

// Cambia esto a false cuando tengas el backend corriendo
const USE_MOCK = true;

export const taskService = {
  // Obtener todas las tareas (GET)
  getAllTasks: async () => {
    if (USE_MOCK) {
      // Simula delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...mockTasks];
    }
    const response = await apiClient.get('/tareas');
    return response.data;
  },

  // Crear una nueva tarea (POST)
  createTask: async (newTaskData) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newTask = {
        id: mockTasks.length > 0 ? Math.max(...mockTasks.map(t => t.id)) + 1 : 1,
        ...newTaskData,
      };
      mockTasks.push(newTask);
      return newTask;
    }
    const response = await apiClient.post('/tareas', newTaskData);
    return response.data;
  },

  // Eliminar una tarea (DELETE)
  deleteTask: async (taskId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      mockTasks = mockTasks.filter(task => task.id !== taskId);
      return { success: true };
    }
    const response = await apiClient.delete(`/tareas/${taskId}`);
    return response.data;
  }
};
