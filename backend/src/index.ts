import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import movimientosRoutes from './routes/movimientos.routes';
import { authMiddleware } from './middlewares/authMiddleware';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movimientos', movimientosRoutes);

// Ejemplo de ruta protegida
type UserPayload = { id: number; email: string; rol: string };
app.get('/api/protegido', authMiddleware, (req, res) => {
  const user = (req as any).user as UserPayload;
  res.json({ message: 'Acceso autorizado', user });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
