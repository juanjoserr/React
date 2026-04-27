// src/pages/NewTaskPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { taskService } from '../services/taskService';
import { useNavigate } from 'react-router-dom';

export const NewTaskPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const navigate = useNavigate(); // Para redirigir después de crear la tarea

  const onSubmit = async (data) => {
    // data contiene { title: '...', description: '...', etc. }
    try {
      const newTask = await taskService.createTask(data);
      console.log('Tarea creada exitosamente:', newTask);
      reset(); // Limpiar el formulario
      // Redirigir al usuario a la página principal para ver la nueva tarea
      navigate('/');
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      alert('Hubo un error al intentar crear la tarea.');
    }
  };

  return (
    <div>
      <h1>Crear Nueva Tarea</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">Título (requerido):</label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'El título es obligatorio' })}
          />
          {errors.title && <span style={{ color: 'red' }}>{errors.title.message}</span>}
        </div>

        <div>
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            {...register('description')}
          />
        </div>
        
        {/* Placeholder para otros campos como 'completed' */}
        <div>
          <label>
          <input id="completed" type="checkbox" {...register('completed')} />
            Marcar como completada
          </label>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Tarea'}
        </button>
        <button type="button" onClick={() => navigate('/')}>Cancelar</button>
      </form>
    </div>
  );
};