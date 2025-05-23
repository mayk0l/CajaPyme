# CajaPyme

**CajaPyme** es una plataforma web fullstack para la gestión de caja diaria y reportes financieros de PYMEs chilenas.

---

## Estructura del proyecto

```
cajapyme/
├── backend/   # API RESTful Node.js + Express + Prisma + PostgreSQL
├── frontend/  # React + TypeScript + Zustand + TailwindCSS
├── docs/      # Documentación técnica y funcional
└── README.md
```

## Requisitos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm

## Instalación y uso

```zsh
# Clona el repositorio
 git clone https://github.com/tuusuario/cajapyme.git
 cd cajapyme

# Backend
 cd backend
 cp .env.example .env
 npm install
 npx prisma migrate dev
 npm run dev

# Frontend
 cd ../frontend
 npm install
 npm run dev
```

## Funcionalidades principales

- Registro y login seguro (JWT)
- Gestión de ingresos y egresos
- Reportes diarios y mensuales
- UI responsive y moderna
- API documentada

## Ejemplos de uso de la API y validación

### Registro de usuario (POST /api/auth/register)

Payload válido:
```json
{
  "nombre": "Admin Test",
  "email": "admin@cajapyme.cl",
  "password": "admin1234",
  "rol": "admin"
}
```
Respuesta:
```json
{
  "id": 2,
  "nombre": "Admin Test",
  "email": "admin@cajapyme.cl",
  "rol": "admin"
}
```

Payload inválido (email mal formado):
```json
{
  "nombre": "Test",
  "email": "no-es-email",
  "password": "123456"
}
```
Respuesta:
```json
{
  "message": "Datos inválidos",
  "errors": {
    "formErrors": [],
    "fieldErrors": { "email": ["Invalid email"] }
  }
}
```

### Login (POST /api/auth/login)

Payload válido:
```json
{
  "email": "admin@cajapyme.cl",
  "password": "admin1234"
}
```
Respuesta:
```json
{
  "token": "<JWT>",
  "user": { "id": 2, "nombre": "Admin Test", "email": "admin@cajapyme.cl", "rol": "admin" }
}
```

### Crear movimiento (POST /api/movimientos)

Headers:
```
Authorization: Bearer <JWT>
Content-Type: application/json
```
Payload válido:
```json
{
  "tipo": "ingreso",
  "monto": 10000,
  "categoria": "ventas",
  "descripcion": "Venta de producto",
  "fecha": "2025-05-23T12:00:00.000Z"
}
```
Respuesta:
```json
{
  "id": 12,
  "tipo": "ingreso",
  "monto": 10000,
  "categoria": "ventas",
  "descripcion": "Venta de producto",
  "fecha": "2025-05-23T12:00:00.000Z",
  "usuarioId": 2
}
```

Payload inválido (monto negativo):
```json
{
  "tipo": "ingreso",
  "monto": -100,
  "categoria": "ventas"
}
```
Respuesta:
```json
{
  "message": "Datos inválidos",
  "errors": {
    "formErrors": [],
    "fieldErrors": { "monto": ["Number must be greater than 0"] }
  }
}
```

---

La API valida todos los datos de entrada usando [Zod](https://zod.dev/) y retorna errores claros y estructurados. Esto asegura robustez y seguridad en el backend.

## Rutas protegidas por rol (admin)

Ejemplo: solo administradores pueden listar usuarios

```
GET /api/admin/usuarios
Authorization: Bearer <JWT de admin>
```

Respuesta:
```json
[
  { "id": 1, "nombre": "Admin", "email": "admin@cajapyme.cl", "rol": "admin" },
  { "id": 2, "nombre": "Cajero", "email": "cajero@cajapyme.cl", "rol": "cajero" }
]
```

Si el usuario no es admin:
```json
{
  "message": "Acceso denegado: se requiere rol 'admin'"
}
```

---

## CRUD de usuarios (solo admin)

### Listar usuarios

```
GET /api/admin/usuarios
Authorization: Bearer <JWT de admin>
```
Respuesta:
```json
[
  { "id": 1, "nombre": "Admin", "email": "admin@cajapyme.cl", "rol": "admin" },
  { "id": 2, "nombre": "Cajero", "email": "cajero@cajapyme.cl", "rol": "cajero" }
]
```

### Crear usuario

```
POST /api/auth/register
Content-Type: application/json
```
Payload:
```json
{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@cajapyme.cl",
  "password": "123456",
  "rol": "cajero"
}
```
Respuesta:
```json
{
  "id": 3,
  "nombre": "Nuevo Usuario",
  "email": "nuevo@cajapyme.cl",
  "rol": "cajero"
}
```

### Editar usuario

```
PUT /api/admin/usuarios/:id
Authorization: Bearer <JWT de admin>
Content-Type: application/json
```
Payload:
```json
{
  "nombre": "Usuario Editado",
  "email": "editado@cajapyme.cl",
  "rol": "admin"
}
```
Respuesta:
```json
{
  "id": 3,
  "nombre": "Usuario Editado",
  "email": "editado@cajapyme.cl",
  "rol": "admin"
}
```

### Eliminar usuario

```
DELETE /api/admin/usuarios/:id
Authorization: Bearer <JWT de admin>
```
Respuesta:
```json
{
  "message": "Usuario eliminado",
  "usuario": { "id": 3, "nombre": "Usuario Editado", "email": "editado@cajapyme.cl", "rol": "admin" }
}
```

Notas:
- Solo un admin puede acceder a estas rutas.
- No es posible eliminar el usuario propio (el backend lo previene).
- Todos los endpoints retornan errores claros y estructurados.

---

## Licencia

MIT
