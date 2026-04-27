# Resumen Conceptual: Frontend React para Sistema de Tareas

Este documento explica los conceptos fundamentales de desarrollo frontend con React y cómo se aplican en la construcción del frontend del sistema de tareas, conectándose con el backend ya desarrollado.

---

## 1. SPA (Single Page Application)

Una **SPA** es una aplicación web que carga una sola página HTML y actualiza dinámicamente el contenido conforme el usuario interactúa con ella, sin necesidad de recargar la página completa desde el servidor.

En este proyecto, React Router Dom se encarga de la navegación entre las vistas (lista de tareas y formulario de nueva tarea) sin recargar el navegador. Esto proporciona una experiencia de usuario más fluida y rápida, similar a una aplicación de escritorio o móvil.

**Relación con el backend:** El frontend consume los endpoints REST del backend (`GET /tareas`, `POST /tareas`, `DELETE /tareas/:id`) mediante peticiones asíncronas, obteniendo o enviando datos JSON sin interrumpir la navegación del usuario.

---

## 2. Estructura del Proyecto

La organización de carpetas sigue una arquitectura clara y escalable:

```
src/
├── App.jsx              # Componente raíz que monta el router
├── AppRouter.jsx        # Definición de rutas de la aplicación
├── main.jsx             # Punto de entrada que renderiza App en el DOM
├── pages/               # Vistas completas de cada pantalla
│   ├── TasksPage.jsx    # Página principal: listado de tareas
│   └── NewTaskPage.jsx  # Página de creación de nueva tarea
├── services/            # Lógica de comunicación con el backend
│   └── taskService.js   # Funciones para CRUD de tareas (axios + mock)
└── assets/              # Recursos estáticos (imágenes, íconos)
```

**Beneficio:** Separar páginas (`pages/`) de servicios (`services/`) permite mantener el código ordenado. Las páginas se enfocan en la UI y la experiencia del usuario, mientras que los servicios encapsulan toda la lógica de comunicación HTTP con el backend. Esto facilita el mantenimiento y las pruebas unitarias.

---

## 3. Componentes

React se basa en la construcción de ** componentes reutilizables**, que son bloques independientes de UI que reciben entradas (`props`) y retornan elementos de React (JSX).

En este proyecto:
- **`App`**: Componente raíz que contiene el `AppRouter`.
- **`TasksPage`**: Componente de página que muestra el listado completo.
- **`TaskItem`**: Componente hijo dentro de `TasksPage` que representa una tarea individual. Es reutilizable por cada elemento del array de tareas.
- **`NewTaskPage`**: Componente de página con el formulario de creación.

**Relación con el backend:** Los componentes son la capa de presentación. No conocen directamente la base de datos del backend, pero a través de los servicios, solicitan los datos necesarios para renderizarse y envían los datos del usuario para que el backend los procese y almacene.

---

## 4. Estado (State) con useState

El **estado** es un objeto que almacena datos que pueden cambiar durante la vida de un componente y determinan qué se muestra en la UI.

En `TasksPage` se utilizan varios estados:
- `tasks`: Array que guarda las tareas obtenidas del backend.
- `isLoading`: Booleano que indica si se están cargando los datos.
- `error`: Guarda mensajes de error si falla la petición al backend.

Cuando el estado cambia (por ejemplo, después de eliminar una tarea), React vuelve a renderizar automáticamente el componente para reflejar la nueva información en pantalla.

**Relación con el backend:** El estado `tasks` se sincroniza con los datos del backend. Al cargar la página, se hace una petición `GET` y el resultado se guarda en el estado. Al eliminar una tarea, se envía una petición `DELETE` al backend y luego se actualiza el estado local para mantener la UI sincronizada.

---

## 5. Hooks: useEffect

Los **hooks** son funciones que permiten usar estado y otras características de React en componentes funcionales.

**`useEffect`** permite ejecutar efectos secundarios, como llamadas a APIs, suscripciones o manipulación manual del DOM. En `TasksPage`:

```javascript
useEffect(() => {
  const loadTasks = async () => {
    const fetchedTasks = await taskService.getAllTasks();
    setTasks(fetchedTasks);
  };
  loadTasks();
}, []);
```

El array vacío `[]` indica que este efecto se ejecuta **solo una vez** al montar el componente, simulando el comportamiento de `componentDidMount` de los componentes de clase. Esto es ideal para la carga inicial de datos desde el backend.

---

## 6. Enrutamiento con React Router Dom

El **enrutamiento** permite navegar entre diferentes vistas de la SPA sin recargar la página.

En `AppRouter.jsx` se definen las rutas:
- `/` → `TasksPage` (listado de tareas)
- `/nueva-tarea` → `NewTaskPage` (formulario de creación)

Se utiliza `BrowserRouter` para manejar URLs limpias y `<Link>` en lugar de `<a>` para evitar recargas completas del navegador, preservando el estado de la aplicación.

**Relación con el backend:** Cada ruta del frontend corresponde a una funcionalidad que consume uno o más endpoints del backend. Por ejemplo, `/nueva-tarea` lleva al formulario que finalmente enviará un `POST` al backend para crear el recurso.

---

## 7. Formularios y Manejo de Eventos

Los formularios en React capturan la entrada del usuario y la envían al backend para procesarla.

En `NewTaskPage.jsx` se usa **`react-hook-form`**, una librería que simplifica la gestión de formularios controlados:
- **`register`**: Conecta los inputs con el estado interno de react-hook-form.
- **`handleSubmit`**: Previene el comportamiento por defecto del formulario y valida los campos antes de ejecutar la función `onSubmit`.
- **Validaciones**: Se define que el título es obligatorio. Si no se completa, se muestra un mensaje de error sin enviar nada al backend.

**Eventos:**
- `onSubmit`: Se dispara al enviar el formulario. Llama a `taskService.createTask(data)` para persistir la nueva tarea en el backend.
- `onClick` en botón Eliminar: Muestra una confirmación (`window.confirm`) y luego llama a `taskService.deleteTask(id)`.

**Relación con el backend:** Los formularios recolectan la entrada del usuario, la validan en el frontend para mejorar la UX, y luego la transforman en peticiones HTTP (`POST`, `DELETE`) que el backend recibe, procesa y responde.

---

## 8. Conexión Frontend ↔ Backend

El frontend y el backend se comunican mediante una **API REST** sobre HTTP:

| Operación | Frontend (taskService.js) | Backend (Endpoint) |
|-----------|---------------------------|-------------------|
| Listar tareas | `axios.get('/tareas')` | `GET /api/tareas` |
| Crear tarea | `axios.post('/tareas', data)` | `POST /api/tareas` |
| Eliminar tarea | `axios.delete('/tareas/:id')` | `DELETE /api/tareas/:id` |

**Axios** se configura con una `baseURL` apuntando a `http://localhost:8080/api`, reutilizando la misma instancia para todas las peticiones. Esto centraliza la configuración (headers, URL base, interceptores) y facilita el mantenimiento.

**Modo Mock:** Para desarrollo sin depender del backend, `taskService.js` incluye datos de prueba (`MOCK_TASKS`) y un flag `USE_MOCK`. Cuando está activo, las funciones retornan Promesas con `setTimeout` que simulan el retardo de red, permitiendo visualizar y probar la UI de forma independiente.

---

## Conclusión

El frontend desarrollado con React implementa una SPA moderna que interactúa con el backend mediante una API REST. Los conceptos de componentes, estado, hooks y enrutamiento se combinan para crear una interfaz dinámica, reactiva y fácil de mantener. La separación en capas (páginas, servicios, componentes) asegura que el proyecto pueda escalar a medida que se agreguen nuevas funcionalidades como edición de tareas, filtros, autenticación de usuarios, etc.

