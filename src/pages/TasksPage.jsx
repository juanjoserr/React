// src/pages/TasksPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';

// Componente hijo para mostrar una tarea individual
const TaskItem = ({ task, onDelete }) => {
  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      <h3>{task.title}</h3>
      <p>{task.completed ? '✅ Completada' : '⏳ Pendiente'}</p>
      <button onClick={() => onDelete(task.id)}>Eliminar</button>
    </div>
  );
};

export const TasksPage = () => {
  const [tasks, setTasks] = useState([]); // Estado para las tareas
  const [isLoading, setIsLoading] = useState(true); // Estado para el "cargando..."
  const [error, setError] = useState(null); // Estado para manejar errores

  // useEffect para cargar las tareas cuando el componente se monta
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const fetchedTasks = await taskService.getAllTasks();
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error('Error al cargar las tareas:', err);
        setError('No se pudieron cargar las tareas. ¿El backend está corriendo?');
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []); // El array vacío [] significa que esto se ejecuta una sola vez al inicio

  const handleDeleteTask = async (taskId) => {
    // Mostrar una confirmación antes de eliminar
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await taskService.deleteTask(taskId);
        // Actualizar el estado local para eliminar la tarea de la UI sin recargar
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        alert('Hubo un error al eliminar la tarea.');
      }
    }
  };

  if (isLoading) {
    return <div>Cargando tus tareas...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Mis Tareas</h1>
      <Link to="/nueva-tarea">➕ Crear Nueva Tarea</Link>
      <div>
        {tasks.length === 0 ? (
          <p>No hay tareas aún. ¡Crea una!</p>
        ) : (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} onDelete={handleDeleteTask} />
          ))
        )}
      </div>
    </div>
  );
};