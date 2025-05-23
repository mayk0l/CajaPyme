import { Router } from 'express';
import { crearMovimiento, listarMovimientos } from '../controllers/movimientosController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas de movimientos requieren autenticación
router.post('/', authMiddleware, crearMovimiento);
router.get('/', authMiddleware, listarMovimientos);

export default router;
