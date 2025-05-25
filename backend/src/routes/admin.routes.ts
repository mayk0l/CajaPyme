import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/requireRole';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Ruta de ejemplo: solo administradores pueden listar usuarios
router.get('/usuarios', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nombre: true, email: true, rol: true }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: (error as Error).message });
  }
});

// Eliminar usuario (solo admin, no puede eliminarse a sí mismo)
router.delete('/usuarios/:id', authMiddleware, requireRole('admin'), (req, res) => {
  (async () => {
    const { id } = req.params;
    const user = (req as any).user;
    // id es string, pero en tu modelo es Int
    const idInt = parseInt(id, 10);
    if (user.id === idInt) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario.' });
    }
    try {
      const usuario = await prisma.usuario.delete({
        where: { id: idInt },
        select: { id: true, nombre: true, email: true, rol: true }
      });
      res.json({ message: 'Usuario eliminado', usuario });
    } catch (error) {
      res.status(404).json({ message: 'Usuario no encontrado o no se pudo eliminar', error: (error as Error).message });
    }
  })();
});

// Actualizar usuario (solo admin)
router.put('/usuarios/:id', authMiddleware, requireRole('admin'), (req, res) => {
  (async () => {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;
    const idInt = parseInt(id, 10);

    // Solo para la versión demo: proteger la cuenta admin@caja.cl para que no pueda ser editada
    // BORRAR este bloque si pasa a producción real
    const usuarioActual = await prisma.usuario.findUnique({ where: { id: idInt } });
    if (usuarioActual && usuarioActual.email === 'admin@caja.cl') {
      return res.status(403).json({ message: 'No está permitido editar la cuenta admin@caja.cl en la versión demo.' });
    }

    if (!nombre || !email || !rol) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    try {
      const usuario = await prisma.usuario.update({
        where: { id: idInt },
        data: { nombre, email, rol },
        select: { id: true, nombre: true, email: true, rol: true }
      });
      res.json(usuario);
    } catch (error) {
      res.status(404).json({ message: 'Usuario no encontrado o no se pudo actualizar', error: (error as Error).message });
    }
  })();
});

export default router;
