import { Router } from 'express';
import { crearMovimiento, listarMovimientos, actualizarMovimiento, eliminarMovimiento } from '../controllers/movimientosController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas de movimientos requieren autenticación
router.post('/', authMiddleware, crearMovimiento);
router.get('/', authMiddleware, listarMovimientos);
// PUT /:id
router.put('/:id', authMiddleware, actualizarMovimiento);
// DELETE /:id
router.delete('/:id', authMiddleware, eliminarMovimiento);

export default router;
