import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Validación básica de datos podría agregarse aquí con middleware
router.post('/register', register);
router.post('/login', login);

export default router;
