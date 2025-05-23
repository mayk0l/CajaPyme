# CajaPyme

**CajaPyme** es una plataforma web open source para la gestión de caja diaria, ingresos, egresos y reportes financieros de PYMEs chilenas.  
Desarrollada con un stack moderno y buenas prácticas, pensada para ser fácil de usar, auditable y extensible.

---

## 🚀 Demo en producción

[https://caja-pyme.vercel.app/](https://caja-pyme.vercel.app/)

---

## 🏗️ Estructura del proyecto

```
cajapyme/
├── backend/   # API RESTful Node.js + Express + Prisma + PostgreSQL
├── frontend/  # React + TypeScript + Zustand + TailwindCSS
├── docs/      # Documentación técnica y funcional
└── README.md
```

---

## ✨ Funcionalidades principales

- Registro y login seguro (JWT)
- Gestión de ingresos y egresos diarios
- Reportes diarios y mensuales exportables (CSV, PDF, Word)
- UI responsive y moderna (mobile first)
- Administración de usuarios y roles (admin/cajero)
- API documentada y validada con Zod
- Filtros avanzados y paginación en historial de movimientos

---

## ⚙️ Stack Tecnológico

- **Frontend:** React + Vite + TypeScript + Zustand + TailwindCSS + React Router
- **Backend:** Node.js + Express + TypeScript + Prisma ORM + PostgreSQL + JWT + Zod
- **Testing:** Vitest + Testing Library
- **DevOps:** GitHub Actions, Vercel (frontend), Railway (backend/db)

---

## 🛠️ Instalación y uso local

```sh
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

---

## 📚 Documentación

- [docs/ARQUITECTURA_SISTEMA.md](docs/ARQUITECTURA_SISTEMA.md): Arquitectura y decisiones técnicas
- [docs/CASOS_DE_USO.md](docs/CASOS_DE_USO.md): Casos de uso principales
- [docs/FLUJO_AUTENTICACION.md](docs/FLUJO_AUTENTICACION.md): Flujo de autenticación JWT
- [docs/CHECKLIST_CRITERIOS_EXITO.md](docs/CHECKLIST_CRITERIOS_EXITO.md): Checklist de criterios de éxito

---

## 🧩 Próximas integraciones y mejoras

- [ ] Integrar TanStack Query para manejo eficiente de datos y sincronización frontend-backend.
- [ ] Mejorar cobertura de tests unitarios y de integración.
- [ ] Agregar internacionalización (i18n) para soporte multilenguaje.
- [ ] Implementar notificaciones en tiempo real (WebSocket o similar).
- [ ] Mejorar la documentación OpenAPI/Swagger del backend.
- [ ] Agregar más reportes y visualizaciones gráficas.
- [ ] Mejorar la experiencia móvil y accesibilidad (a11y).
- [ ] Automatizar despliegues y CI/CD para ambos entornos.
- [ ] Permitir configuración avanzada de roles y permisos.
- [ ] Agregar soporte para multiempresa/multisucursal.

---

## 🧑‍💻 Contribuciones y feedback

¡Toda sugerencia, issue o PR es bienvenida!  
Si tienes ideas, encuentras bugs o quieres aportar, abre un issue o un pull request.  
Este proyecto busca ser útil para la comunidad de PYMEs y desarrolladores de Chile y Latinoamérica.

---

## 📢 Créditos y licencia

Desarrollado por [@mayk0l](https://github.com/mayk0l) y comunidad.  
Licencia MIT.

---

## 🌎 ¿Te sirvió?

Si te ayudó, dale una estrella ⭐ en GitHub y compártelo con otros emprendedores o desarrolladores.