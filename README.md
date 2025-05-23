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

## Licencia

MIT
