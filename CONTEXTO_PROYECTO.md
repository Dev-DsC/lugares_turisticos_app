# CONTEXTO DEL PROYECTO

**Práctica Ionic - Lugares Turísticos (2026).** Aplicación móvil Ionic/Angular para consultar y administrar lugares turísticos. Cada lugar tiene nombre, imagen y comentarios. La consigna original está en `Practica Ionic - Lugares - 2026 (1).pdf`.

El usuario es junior y quiere aprender implementando personalmente. Codex debe actuar como mentor técnico senior: explicar el porqué, proponer la opción más adecuada y advertir cuando una idea agregue complejidad sin aportar valor. No editar código ni ejecutar cambios por cuenta propia salvo autorización explícita; el usuario escribe el código y ejecuta los comandos.

## Tecnologías y Stack

- Frontend: Ionic 8 + Angular 18 + TypeScript 5.4.5, componentes `standalone` y Capacitor 6.
- Backend: Node.js + Express 5 + TypeScript + `tsx` + Mongoose 9.
- Base de datos: MongoDB local, base `lugares_turisticos`, colección `lugares`.
- Comunicación: API Express en `http://localhost:3000/api`; Ionic en `http://127.0.0.1:4200`.
- Dependencias backend: `express`, `mongoose`, `cors`, `dotenv`; desarrollo: `typescript`, `tsx`, `@types/node`, `@types/express`, `@types/cors`.

## Estado frente a la práctica

| Requisito | Estado actual |
| --- | --- |
| REQ01 a REQ05 local | Funcionan con datos en memoria: lista, detalle, crear, editar, eliminar y comentario. Faltan validaciones/pulido y persistencia desde Ionic. |
| REQ06 - base de datos | Hecho localmente. MongoDB contiene lugares y comentarios embebidos. |
| REQ07 - API | En progreso. CRUD de lugares y crear comentario ya funcionan y fueron probados desde PowerShell. Falta la ruta de detalle y conectar Ionic. |
| REQ08 - usuarios/roles | Pendiente. No crear todavía editar/eliminar comentarios: requiere saber el propietario autenticado. |

## Estructura relevante

```text
LugaresTuristicos/
├── src/                         # Frontend Ionic
│   ├── main.ts                  # Providers Angular; HttpClient ya está habilitado
│   ├── environments/
│   │   ├── environment.ts        # apiUrl: http://localhost:3000/api
│   │   └── environment.prod.ts   # apiUrl: /api
│   └── app/
│       ├── models/lugar.ts       # Modelo UI LEGADO: comentarios string[]
│       ├── models/lugar-api.ts   # DTO API creado; refleja _id y comentarios objeto
│       ├── services/lugares.service.ts # Aún usa arreglo local, no HttpClient
│       ├── components/lugares/   # Página lista
│       ├── components/detalle/   # Página detalle
│       └── app.routes.ts         # Aún usa /detalle/:nombre
└── backend/                      # API separada
    ├── .env                      # No compartir ni subir; contiene PORT y MONGODB_URI
    ├── .gitignore                # Debe ignorar node_modules, dist y .env
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── server.ts
        ├── models/lugar.model.ts
        └── routes/lugares.routes.ts
```

## Base de datos MongoDB

- Base activa: `lugares_turisticos`.
- Colección: `lugares`.
- Se insertaron inicialmente Kioto, Los Ángeles y Galápagos mediante `mongosh`.
- Kioto tiene `_id` `6a62542207fd09e7b4e66101` y se le añadió un comentario usando la API.
- Se creó Cartagena como prueba de POST/PUT y luego se eliminó correctamente con DELETE. La segunda eliminación devolvió 404, como corresponde.
- Debe verificarse en la próxima sesión que `db.lugares.countDocuments()` sea `3`.
- Se indicó crear índice único por nombre con:

```javascript
db.lugares.createIndex({ nombre: 1 }, { unique: true })
```

No está registrado explícitamente el resultado de `getIndexes()`, así que conviene verificarlo antes de depender de esa regla.

### Forma actual de un documento

```javascript
{
  _id: ObjectId(...),
  nombre: "Kioto",
  imagen: "https://...",
  comentarios: [
    {
      texto: "...",
      fechaCreacion: ISODate(...)
    }
  ]
}
```

Los comentarios están embebidos porque son pocos y pertenecen al lugar. Es correcto para este alcance.

## Backend actual

### Cómo iniciarlo

Desde `backend/`:

```powershell
npx.cmd tsx watch src/server.ts
```

Salida esperada: `Conectado a MongoDB` y `API disponible en http://localhost:3000`.

`backend/.env` debe contener, sin publicar sus secretos:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/lugares_turisticos
```

### Rutas implementadas y probadas

| Método y ruta | Acción |
| --- | --- |
| `GET /api/salud` | Prueba de que Express funciona. |
| `GET /api/lugares` | Devuelve todos los lugares, ordenados por nombre. |
| `POST /api/lugares` | Crea lugar. Valida `nombre` e `imagen`. |
| `PUT /api/lugares/:id` | Modifica nombre e imagen. Valida ObjectId y campos. |
| `DELETE /api/lugares/:id` | Elimina un lugar. Responde 404 si no existe. |
| `POST /api/lugares/:id/comentarios` | Añade comentario con texto y fecha al lugar. |

### Rutas pendientes y decisión técnica

**Falta implementar y probar `GET /api/lugares/:id`.** Es necesario antes de conectar la pantalla detalle de Ionic: debe retornar un lugar junto con sus comentarios.

No crear por ahora `GET /api/lugares/:id/comentarios`. Los comentarios ya vienen incluidos al pedir el detalle del lugar. Una ruta exclusiva tendría sentido solo con muchos comentarios, paginación, filtros o carga diferida.

No crear aún rutas para editar/eliminar comentarios. REQ08 exige permitir esas acciones solo al propietario del comentario, y todavía no existen usuarios ni autenticación.

### Modelo Mongoose

`backend/src/models/lugar.model.ts` define `LugarModel` sobre la colección exacta `lugares`, con:

- `nombre`: obligatorio, `trim`, único.
- `imagen`: obligatoria, `trim`.
- `comentarios`: subdocumentos `{ texto, fechaCreacion }`.
- `timestamps: true`: los lugares creados mediante Mongoose tienen `createdAt` y `updatedAt`.

### Pendiente técnico backend

`backend/tsconfig.json` tiene `"module": "commonjs"` y `"moduleResolution": "bundler"`. La recomendación es cambiar `moduleResolution` a `"node"` antes de compilar el backend con `tsc`; actualmente `tsx watch` funciona, pero la combinación no es la configuración apropiada para Express/CommonJS.

También faltan scripts en `backend/package.json`; más adelante añadir `dev`, `build` y `start`.

## Frontend actual y plan de integración

El frontend **todavía no consume la API**. `LugaresService` conserva un arreglo local síncrono, `Lugar` usa `comentarios: string[]` y el detalle busca por `nombre` en la ruta `/detalle/:nombre`.

Ya se hizo lo siguiente:

- `provideHttpClient()` fue agregado en `src/main.ts`.
- Se agregaron `apiUrl` en ambos archivos de entorno.
- Se creó `src/app/models/lugar-api.ts`:

```ts
export interface ComentarioApi {
  _id?: string;
  texto: string;
  fechaCreacion: string;
}

export interface LugarApi {
  _id: string;
  nombre: string;
  imagen: string;
  comentarios: ComentarioApi[];
  createdAt?: string;
  updatedAt?: string;
}
```

### Próximo paso recomendado

1. Implementar y probar `GET /api/lugares/:id` en el backend.
2. Cambiar la navegación de Ionic para identificar el detalle por un identificador estable, no por nombre.
3. Reescribir `LugaresService` para usar `HttpClient` y devolver `Observable`.
4. Actualizar páginas lista y detalle para suscribirse a la API y usar el formato de comentarios objeto.
5. Reemplazar los métodos locales de crear, editar, eliminar y comentar por los endpoints ya existentes.
6. Probar cada flujo contra MongoDB, no contra el arreglo local.

Decisión de diseño: para esta práctica se puede usar `_id` directamente en el frontend y migrar la ruta a `/detalle/:id`. Un backend de producción normalmente expondría un `id` propio, pero añadir esa transformación ahora no aporta valor suficiente para esta entrega.

## Reglas de estilo y trabajo

- Componentes Angular `standalone`; usar componentes de interfaz de Ionic.
- Tipar propiedades, parámetros y retornos. Evitar `any`.
- Las páginas manejan UI; servicios manejan HTTP/datos; modelos definen contratos.
- Métodos en minúscula inicial (`agregarLugar`).
- Validar entradas y usar mensajes claros; confirmar acciones destructivas.
- Evitar estilos inline cuando puedan vivir en `.scss`.
- No añadir dependencias sin necesidad.
- PowerShell puede mostrar caracteres UTF-8 como `Ã³`; verificar antes de modificar textos. Los archivos revisados están guardados como UTF-8.
- En PowerShell, usar `npm.cmd` / `npx.cmd` si la política bloquea los scripts `.ps1`.

## Historial de incidencias resueltas

- Se eliminó la propiedad accidental `c` de `LugaresService` y se renombró `AgregarLugar` a `agregarLugar`.
- Se añadió tipado básico a métodos de `LugaresPage`.
- `ignoreDeprecations: "6.0"` en el `tsconfig.json` raíz causaba `TS5103` con TypeScript 5.4.5. Fue eliminado y Ionic volvió a compilar.
- No confundir los avisos de sandbox/iframe del simulador con errores de compilación.

## Cómo retomar

Leer este archivo primero. Confirmar que MongoDB, backend e Ionic estén encendidos. No repetir la exploración de todo el proyecto: avanzar desde “Próximo paso recomendado”, guiando al usuario para que haga cada cambio y verificando el resultado antes de continuar.
