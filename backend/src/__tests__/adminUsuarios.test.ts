import request from 'supertest';
import app from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utilidad para crear y autenticar un admin
async function crearYLoguearAdmin() {
  const email = `admin${Date.now()}@test.com`;
  const password = 'admin1234';
  // Hashear la contraseña antes de guardar
  const bcrypt = require('bcrypt');
  const hashed = await bcrypt.hash(password, 10);
  await prisma.usuario.create({ data: { nombre: 'Admin', email, password: hashed, rol: 'admin' } });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return res.body.token;
}

describe('Admin Usuarios API', () => {
  let token: string;
  let userId: number;

  beforeAll(async () => {
    token = await crearYLoguearAdmin();
  });

  it('debe crear un usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Test', email: `test${Date.now()}@mail.com`, password: '123456', rol: 'cajero' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  it('debe listar usuarios (solo admin)', async () => {
    const res = await request(app)
      .get('/api/admin/usuarios')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('debe editar un usuario', async () => {
    const res = await request(app)
      .put(`/api/admin/usuarios/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Editado', email: `editado${Date.now()}@mail.com`, rol: 'cajero' });
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Editado');
  });

  it('debe eliminar un usuario', async () => {
    const res = await request(app)
      .delete(`/api/admin/usuarios/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('usuario');
  });

  it('test básico', () => {
    expect(1 + 1).toBe(2);
  });
});
