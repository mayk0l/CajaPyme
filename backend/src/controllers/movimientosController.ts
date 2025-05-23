// Estructura base para movimientosController (CRUD básico)
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearMovimiento = async (req: Request, res: Response): Promise<void> => {
  const { tipo, monto, categoria, descripcion, fecha } = req.body;
  const usuarioId = (req as any).user.id;
  if (!tipo || !monto || !categoria) {
    res.status(400).json({ message: 'Faltan campos obligatorios' });
    return;
  }
  try {
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
    res.status(500).json({ message: 'Error al crear movimiento' });
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
  const { id } = req.params;
  const usuarioId = (req as any).user.id;
  const { tipo, monto, categoria, descripcion, fecha } = req.body;
  try {
    const movimiento = await prisma.movimiento.updateMany({
      where: { id: Number(id), usuarioId },
      data: { tipo, monto, categoria, descripcion, fecha: fecha ? new Date(fecha) : undefined }
    });
    if (movimiento.count === 0) {
      res.status(404).json({ message: 'Movimiento no encontrado o sin permisos' });
      return;
    }
    res.json({ message: 'Movimiento actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar movimiento' });
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
