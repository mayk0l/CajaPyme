## Setup Inicial Profesional (Frontend + Backend + Control de Versiones)

---

### 🧭 1. Crea un repositorio Git central con 2 carpetas:





`mkdir cajapyme 
`cd cajapyme `
`git init`

Estructura base:



`cajapyme/ ├── frontend/ 
		   `└── backend/`

---

## 🎨 FRONTEND (React + Vite + Tailwind + TypeScript)

### 2. Crear el proyecto Vite con React y TypeScript





`cd cajapyme npm create vite@latest frontend -- --template react-ts cd frontend npm install`

### 3. Instalar TailwindCSS





`npm install -D tailwindcss postcss autoprefixer npx tailwindcss init -p`

### 4. Configurar Tailwind

📄 `tailwind.config.js`

js



`/** @type {import('tailwindcss').Config} */ export default {   content: [     "./index.html",     "./src/**/*.{js,ts,jsx,tsx}",   ],   theme: {     extend: {},   },   plugins: [], }`

📄 `src/index.css`

css



`@tailwind base; @tailwind components; @tailwind utilities;`

### 5. Prueba inicial





`npm run dev`

🔍 Asegúrate de ver el sitio corriendo en `http://localhost:5173`.

---

## 🧱 BACKEND (Node + Express + TypeScript + Prisma + JWT)

### 6. Crear el backend con Node + TypeScript





`cd ../ mkdir backend cd backend npm init -y npm install express cors dotenv jsonwebtoken bcrypt zod npm install -D typescript ts-node-dev @types/express @types/node @types/jsonwebtoken @types/bcrypt npx tsc --init`

### 7. Estructura de carpetas

pgsql



`backend/ ├── src/ │   ├── controllers/ │   ├── routes/ │   ├── middlewares/ │   ├── prisma/ │   ├── types/ │   └── index.ts ├── .env └── tsconfig.json`

### 8. Instala Prisma y PostgreSQL (usa Railway o localmente)





`npm install prisma @prisma/client npx prisma init`

📄 `.env`

env



`DATABASE_URL="postgresql://usuario:clave@localhost:5432/cajapyme" JWT_SECRET="un_secreto_seguro_aqui"`

📄 `prisma/schema.prisma`

prisma



`generator client {   provider = "prisma-client-js" }  datasource db {   provider = "postgresql"   url      = env("DATABASE_URL") }  model User {   id        String   @id @default(uuid())   email     String   @unique   password  String   role      String   // admin o cajero   createdAt DateTime @default(now()) }  model Movimiento {   id        String   @id @default(uuid())   tipo      String   // ingreso o egreso   monto     Float   descripcion String   fecha     DateTime @default(now())   userId    String   user      User     @relation(fields: [userId], references: [id]) }`

### 9. Crear base de datos y aplicar migración





`npx prisma migrate dev --name init npx prisma generate`

---

## 🧪 10. Corre el backend

📄 `src/index.ts`

ts



`import express from "express"; import cors from "cors"; import dotenv from "dotenv";  dotenv.config(); const app = express(); app.use(cors()); app.use(express.json());  app.get("/", (req, res) => res.send("CajaPyme backend OK")); app.listen(3000, () => console.log("Server on http://localhost:3000"));`





`npx ts-node-dev src/index.ts`

---

## 🔀 11. Configura Git

Desde raíz:





`git add . git commit -m "🎉 Proyecto CajaPyme iniciado con frontend y backend básicos" git branch -M main git remote add origin <url-del-repo-en-GitHub> git push -u origin main`

---

## ✅ Hasta aquí tenemos:

- Frontend React corriendo localmente con Tailwind.
    
- Backend Express con TypeScript y conexión PostgreSQL con Prisma.
    
- Estructura profesional, versión inicial lista para trabajo en ramas feature.
    

---

### 🧩 Próximo paso (Fase 2):

> 🔐 Implementar Autenticación JWT (registro/login de usuarios con roles)  
> 🚪 Crear rutas protegidas y middleware de auth  
> 📥 API REST para movimientos de caja  
> 📊 Dashboard con resumen diario/mensual  
> 🧪 Tests y despliegue inicial a Railway y Vercel