import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminUsuarios from './AdminUsuarios';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock useUsuarios to control data and loading state
vi.mock('../hooks/useUsuarios', () => ({
  useUsuarios: () => ({
    usuarios: [
      { id: '1', nombre: 'Juan', email: 'juan@mail.com', rol: 'admin' },
      { id: '2', nombre: 'Ana', email: 'ana@mail.com', rol: 'cajero' },
    ],
    loading: false,
    error: '',
    crearUsuario: vi.fn(),
    editarUsuario: vi.fn(),
    eliminarUsuario: vi.fn(),
  }),
}));

describe('AdminUsuarios page', () => {
  it('renders user table with users', () => {
    render(
      <MemoryRouter>
        <AdminUsuarios />
      </MemoryRouter>
    );
    expect(screen.getByText('Administración de Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('cajero')).toBeInTheDocument();
  });
});
