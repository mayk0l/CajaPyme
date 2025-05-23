// Estructura base para movimientosController (CRUD básico)
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquema Zod para movimiento
const movimientoSchema = z.object({
  tipo: z.enum(['ingreso', 'egreso']),
  monto: z.number().positive(),
  categoria: z.string().min(2),
  descripcion: z.string().optional(),
  fecha: z.string().datetime().optional()
});

export const crearMovimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = movimientoSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
      return;
    }
    const { tipo, monto, categoria, descripcion, fecha } = parsed.data;
    const usuarioId = (req as any).user.id;
    const movimiento = await prisma.movimiento.create({
      data: {
        tipo,
        monto,
        categoria,
        descripcion,
        fecha: fecha ? new Date(fecha) : undefined,
        usuarioId
      }
    });
    res.status(201).json(movimiento);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear movimiento', error: (error as Error).message });
  }
};

export const listarMovimientos = async (req: Request, res: Response): Promise<void> => {
  const usuarioId = (req as any).user.id;
  try {
    const movimientos = await prisma.movimiento.findMany({
      where: { usuarioId },
      orderBy: { fecha: 'desc' }
    });
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener movimientos' });
  }
};

export const actualizarMovimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = movimientoSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
      return;
    }
    const { id } = req.params;
    const usuarioId = (req as any).user.id;
    const updateData = parsed.data;
    const movimiento = await prisma.movimiento.updateMany({
      where: { id: Number(id), usuarioId },
      data: updateData
    });
    if (movimiento.count === 0) {
      res.status(404).json({ message: 'Movimiento no encontrado o sin permisos' });
      return;
    }
    res.json({ message: 'Movimiento actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar movimiento', error: (error as Error).message });
  }
};

export const eliminarMovimiento = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const usuarioId = (req as any).user.id;
  try {
    const movimiento = await prisma.movimiento.deleteMany({
      where: { id: Number(id), usuarioId }
    });
    if (movimiento.count === 0) {
      res.status(404).json({ message: 'Movimiento no encontrado o sin permisos' });
      return;
    }
    res.json({ message: 'Movimiento eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar movimiento' });
  }
};
