// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TasksPage } from './pages/TasksPage';
import { NewTaskPage } from './pages/NewTaskPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/nueva-tarea" element={<NewTaskPage />} />
        {/* Aquí más rutas como /editar/:id */}
      </Routes>
    </BrowserRouter>
  );
};