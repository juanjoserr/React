// src/pages/TasksPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';

// Componente hijo para mostrar una tarea individual
const TaskItem = ({ task, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3>{task.title}</h3>
      <p>{task.completed ? '✅ Completada' : '⏳ Pendiente'}</p>
      
      {/* Botón Ver más / Ver menos */}
      <button 
        onClick={() => setShowDetails(!showDetails)}
        style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}
      >
        {showDetails ? '🔼 Ver menos' : '🔽 Ver más'}
      </button>
      
      {/* Detalles de la tarea (se muestran al hacer clic en Ver más) */}
      {showDetails && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #ddd' }}>
          <p><strong>Descripción:</strong> {task.description}</p>
          <p><strong>Fecha de creación:</strong> {task.createdAt || 'No especificada'}</p>
          <p><strong>ID:</strong> {task.id}</p>
        </div>
      )}
      
      <button 
        onClick={() => onDelete(task.id)}
        style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        🗑️ Eliminar
      </button>
    </div>
  );
};

// Barra de navegación superior con botón de Login
const Navbar = () => {
  return (
    <nav style={{ 
      backgroundColor: '#333', 
      color: 'white', 
      padding: '15px 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '20px',
      borderRadius: '8px'
    }}>
      <div>
        <h2 style={{ margin: 0 }}>📋 Gestor de Tareas</h2>
      </div>
      <div>
        <button 
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onClick={() => alert('Funcionalidad de Login en desarrollo 👤')}
        >
          👤 Usuario / Login
        </button>
      </div>
    </nav>
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
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>Cargando tus tareas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '0 20px' }}>
        <h1>Mis Tareas</h1>
        <Link 
          to="/nueva-tarea" 
          style={{ 
            display: 'inline-block', 
            padding: '10px 20px', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}
        >
          ➕ Crear Nueva Tarea
        </Link>
        <div>
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '50px', color: '#666' }}>No hay tareas aún. ¡Crea una!</p>
          ) : (
            tasks.map(task => (
              <TaskItem key={task.id} task={task} onDelete={handleDeleteTask} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

