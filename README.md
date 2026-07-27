# Lugares Turísticos App

Aplicación móvil desarrollada con Ionic, Angular y Node.js para explorar, crear, editar y comentar lugares turísticos. El proyecto combina una interfaz moderna con un backend REST en Express y MongoDB, ofreciendo una experiencia completa de gestión de contenido desde una app móvil.

## 🚀 Descripción del proyecto

Esta app permite a los usuarios:

- Consultar una lista de lugares turísticos.
- Ver el detalle de cada lugar con información visual y comentarios.
- Crear nuevos lugares desde la interfaz.
- Agregar comentarios asociados a cada lugar.
- Registrar e iniciar sesión con autenticación JWT.
- Gestionar permisos básicos de acceso mediante roles y middleware de autenticación.

El proyecto fue desarrollado como una práctica de arquitectura full-stack, integrando frontend, backend y base de datos NoSQL en un flujo funcional y escalable.

## 🧩 Stack tecnológico

### Frontend
- Ionic 8
- Angular 18
- TypeScript
- Capacitor 6
- RxJS
- Angular Router
- Ionic UI Components

### Backend
- Node.js
- Express 5
- TypeScript
- Mongoose 9
- MongoDB
- JWT para autenticación
- bcrypt para encriptación de contraseñas

## 🏗️ Arquitectura

El proyecto está organizado en dos capas principales:

- Frontend: aplicación móvil híbrida con navegación por páginas y servicios HTTP.
- Backend: API REST que expone rutas para lugares, autenticación y comentarios.

La comunicación se realiza mediante solicitudes HTTP con JSON, y la persistencia de datos se gestiona en MongoDB.

## ✅ Funcionalidades implementadas

### Frontend
- Pantalla de login
- Pantalla de registro
- Listado de lugares turísticos
- Pantalla de detalle por identificador
- Creación de nuevos lugares
- Comentarios por lugar
- Gestión de sesión persistente en almacenamiento local
- Protección de rutas con guard de autenticación

### Backend
- API REST con Express
- Conexión a MongoDB con Mongoose
- CRUD de lugares
- Gestión de comentarios
- Autenticación con JWT
- Registro y login de usuarios
- Middleware de autorización para proteger operaciones sensibles

## 📁 Estructura del proyecto

```text
LugaresTuristicos/
├── src/                     # Frontend Ionic/Angular
├── backend/                 # Backend Express/TypeScript
├── capacitor.config.ts      # Configuración de Capacitor
├── angular.json             # Configuración Angular
├── package.json             # Dependencias frontend
└── README.md                # Documentación principal
```

## ⚙️ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js 18 o superior
- npm o pnpm
- MongoDB en ejecución localmente
- Un editor como VS Code

## ▶️ Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Dev-DsC/lugares_turisticos_app.git
cd lugares_turisticos_app
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 4. Configurar variables de entorno

Crea un archivo .env dentro de la carpeta backend con el siguiente contenido:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/lugares_turisticos
JWT_SECRET=tu_clave_secreta
```

> Nota: para producción, usa un secreto fuerte y gestiona las variables mediante un servicio seguro de entorno.

### 5. Ejecutar el backend

```bash
cd backend
npm run dev
```

### 6. Ejecutar la app frontend

```bash
npm start
```

La API quedará disponible en:

- http://localhost:3000/api/salud

## 🧪 Endpoints principales

### Autenticación
- POST /api/auth/registro
- POST /api/auth/login

### Lugares
- GET /api/lugares
- GET /api/lugares/:id
- POST /api/lugares
- PUT /api/lugares/:id
- DELETE /api/lugares/:id

### Comentarios
- POST /api/lugares/:id/comentarios
- PUT /api/lugares/:id/comentarios/:comentarioId
- DELETE /api/lugares/:id/comentarios/:comentarioId

## 🔐 Seguridad

El proyecto incorpora medidas básicas de seguridad, incluyendo:

- Hash de contraseñas con bcrypt
- Autenticación basada en JWT
- Middleware de autorización para operaciones sensibles
- Variables de entorno para credenciales y secretos

## 📌 Estado del proyecto

Este proyecto se encuentra en una etapa funcional de desarrollo, con un backend en operación y una interfaz móvil navegable. Se ha trabajado en la integración entre frontend y backend, la autenticación de usuarios y la gestión de contenido dinámico.

## 👨‍💻 Sobre el desarrollador

Proyecto desarrollado por Dalton Cornejo, con enfoque en el aprendizaje y la construcción de aplicaciones móviles modernas, APIs REST y soluciones full-stack con tecnologías actuales.

## 🎯 Objetivo profesional

El propósito de este proyecto es demostrar habilidades prácticas en:

- Desarrollo de interfaces móviles con Ionic y Angular
- Consumo de APIs REST
- Diseño de servicios backend con Express y MongoDB
- Implementación de seguridad básica en aplicaciones web y móviles
- Integración de frontend y backend en un producto funcional

## 🤝 Interés para empresas

Este proyecto refleja capacidad para trabajar con stacks modernos, comprender la arquitectura de aplicaciones móviles híbridas y construir soluciones con una base sólida en frontend, backend y bases de datos.

Estoy abierto a oportunidades donde pueda aportar valor en desarrollo full-stack, aplicaciones móviles, APIs y mantenimiento de productos digitales.
