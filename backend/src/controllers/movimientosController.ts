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
