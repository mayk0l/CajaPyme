import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquemas Zod para validación
const registerSchema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  rol: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
      return;
    }
    const { nombre, email, password, rol } = parsed.data;

    // Solo permitir crear un admin si no existe ningún admin (solo para entorno demo o registro público)
    // Elimina o comenta este bloque para producción si quieres permitir que admins creen otros admins desde el panel
    if ((rol === 'admin' || !rol) && (await prisma.usuario.count({ where: { rol: 'admin' } })) > 0) {
      res.status(403).json({ message: 'No está permitido registrar más administradores desde el registro público.' });
      return;
    }

    const userExists = await prisma.usuario.findUnique({ where: { email } });
    if (userExists) {
      res.status(409).json({ message: 'Email ya registrado' });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.usuario.create({
      data: { nombre, email, password: hashed, rol: rol || 'cajero' }
    });
    res.status(201).json({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol });
  } catch (error) {
    res.status(500).json({ message: 'Error interno en registro', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: parsed.error.flatten() });
      return;
    }
    const { email, password } = parsed.data;
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: '12h' }
    );
    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (error) {
    res.status(500).json({ message: 'Error interno en login', error: (error as Error).message });
  }
};
