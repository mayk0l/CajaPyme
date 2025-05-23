import request from 'supertest';
import app from '../index';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Genera un JWT válido para pruebas (ajusta el secret si es necesario)
const JWT_SECRET = process.env.JWT_SECRET || 'un_secreto_seguro_aqui';
const testUser = { id: 9999, email: 'test@cajapyme.cl', rol: 'admin' };
const token = jwt.sign(testUser, JWT_SECRET, { expiresIn: '1h' });

beforeAll(async () => {
  // Crea el usuario de prueba con id fijo (si no existe)
  const hash = await bcrypt.hash('admin1234', 10);
  await prisma.usuario.upsert({
    where: { id: testUser.id },
    update: {},
    create: {
      id: testUser.id,
      nombre: 'Test User',
      email: testUser.email,
      password: hash,
      rol: testUser.rol,
    },
  });
});

afterAll(async () => {
  await prisma.movimiento.deleteMany({ where: { usuarioId: testUser.id } });
  await prisma.usuario.deleteMany({ where: { id: testUser.id } });
  await prisma.$disconnect();
});

describe('Movimientos API', () => {
  it('rechaza crear movimiento con monto negativo', async () => {
    const res = await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${token}`)
      .send({ tipo: 'ingreso', monto: -100, categoria: 'ventas' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Datos inválidos');
    expect(res.body.errors.fieldErrors.monto).toBeDefined();
  });

  it('crea movimiento válido', async () => {
    const res = await request(app)
      .post('/api/movimientos')
      .set('Authorization', `Bearer ${token}`)
      .send({ tipo: 'ingreso', monto: 1000, categoria: 'ventas', descripcion: 'Test', fecha: '2025-05-23T12:00:00.000Z' });
    expect(res.status).toBe(201);
    expect(res.body.monto).toBe(1000);
    expect(res.body.categoria).toBe('ventas');
    expect(res.body.usuarioId).toBe(testUser.id);
  });
});
