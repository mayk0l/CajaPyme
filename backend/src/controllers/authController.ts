import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password) {
    res.status(400).json({ message: 'Faltan campos obligatorios' });
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
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
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
};
