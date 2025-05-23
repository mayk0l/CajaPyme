import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
  nombreEmpresa: string;
  rut: string;
  direccion: string;
  telefono: string;
  email: string;
  logo: string | null;
  setNombreEmpresa: (nombre: string) => void;
  setRut: (rut: string) => void;
  setDireccion: (direccion: string) => void;
  setTelefono: (telefono: string) => void;
  setEmail: (email: string) => void;
  setLogo: (logo: string | null) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      nombreEmpresa: 'CajaPyme',
      rut: '',
      direccion: '',
      telefono: '',
      email: '',
      logo: null,
      setNombreEmpresa: (nombre) => set({ nombreEmpresa: nombre }),
      setRut: (rut) => set({ rut }),
      setDireccion: (direccion) => set({ direccion }),
      setTelefono: (telefono) => set({ telefono }),
      setEmail: (email) => set({ email }),
      setLogo: (logo) => set({ logo }),
    }),
    {
      name: 'config-storage',
    }
  )
);
