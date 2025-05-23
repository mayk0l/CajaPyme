import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import movimientosRoutes from './routes/movimientos.routes';
import adminRoutes from './routes/admin.routes';
import { authMiddleware } from './middlewares/authMiddleware';

dotenv.config();
const app = express();

// Configuración avanzada de CORS para permitir credenciales y orígenes específicos
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev
    'http://localhost:3000', // React dev
    'http://localhost:4000', // API local (si accedes desde otra app)
    'https://caja-pyme.vercel.app', // Dominio de producción real
    'https://cajapyme-frontend.vercel.app' // Dominio de Vercel (ajusta si tu frontend tiene otro subdominio)
  ],
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/admin', adminRoutes);

// Ejemplo de ruta protegida
type UserPayload = { id: number; email: string; rol: string };
app.get('/api/protegido', authMiddleware, (req, res) => {
  const user = (req as any).user as UserPayload;
  res.json({ message: 'Acceso autorizado', user });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
}

export default app;
