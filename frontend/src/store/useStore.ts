import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type Movimiento = {
  id: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  descripcion: string;
  fecha: string; // ISO string
};

interface CajaState {
  saldo: number;
  ingresos: number;
  egresos: number;
  movimientos: Movimiento[];
  isLoading: boolean;
  agregarIngreso: (monto: number, descripcion: string, fecha?: string) => void;
  agregarEgreso: (monto: number, descripcion: string, fecha?: string) => void;
  eliminarMovimiento: (id: string) => void;
  editarMovimiento: (id: string, cambios: Partial<Movimiento>) => void;
  setMovimientos: (movs: Movimiento[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useCajaStore = create<CajaState>()(
  persist(
    (set) => ({
      saldo: 0,
      ingresos: 0,
      egresos: 0,
      movimientos: [],
      isLoading: false,
      agregarIngreso: (monto, descripcion, fecha) =>
        set((state) => ({
          ingresos: state.ingresos + monto,
          saldo: state.saldo + monto,
          movimientos: [
            {
              id: uuidv4(),
              tipo: 'ingreso',
              monto,
              descripcion,
              fecha: fecha || new Date().toISOString(),
            },
            ...state.movimientos,
          ],
        })),
      agregarEgreso: (monto, descripcion, fecha) =>
        set((state) => ({
          egresos: state.egresos + monto,
          saldo: state.saldo - monto,
          movimientos: [
            {
              id: uuidv4(),
              tipo: 'egreso',
              monto,
              descripcion,
              fecha: fecha || new Date().toISOString(),
            },
            ...state.movimientos,
          ],
        })),
      eliminarMovimiento: (id) =>
        set((state) => {
          const mov = state.movimientos.find((m) => m.id === id);
          if (!mov) return {};
          let ingresos = state.ingresos;
          let egresos = state.egresos;
          let saldo = state.saldo;
          if (mov.tipo === 'ingreso') {
            ingresos -= mov.monto;
            saldo -= mov.monto;
          } else {
            egresos -= mov.monto;
            saldo += mov.monto;
          }
          return {
            movimientos: state.movimientos.filter((m) => m.id !== id),
            ingresos,
            egresos,
            saldo,
          };
        }),
      editarMovimiento: (id, cambios) =>
        set((state) => {
          const movAntiguo = state.movimientos.find((m) => m.id === id);
          if (!movAntiguo) return {};
          let ingresos = state.ingresos;
          let egresos = state.egresos;
          let saldo = state.saldo;
          if (movAntiguo.tipo === 'ingreso') {
            ingresos = ingresos - movAntiguo.monto + (cambios.monto ?? movAntiguo.monto);
            saldo = saldo - movAntiguo.monto + (cambios.monto ?? movAntiguo.monto);
          } else {
            egresos = egresos - movAntiguo.monto + (cambios.monto ?? movAntiguo.monto);
            saldo = saldo + movAntiguo.monto - (cambios.monto ?? movAntiguo.monto);
          }
          return {
            movimientos: state.movimientos.map((m) =>
              m.id === id ? { ...m, ...cambios } : m
            ),
            ingresos,
            egresos,
            saldo,
          };
        }),
      setMovimientos: (movs) => set(() => ({ movimientos: movs })),
      setLoading: (loading) => set(() => ({ isLoading: loading })),
      reset: () =>
        set({
          saldo: 0,
          ingresos: 0,
          egresos: 0,
          movimientos: [],
        }),
    }),
    {
      name: 'cajapyme-storage',
      partialize: (state) => ({ 
        saldo: state.saldo, 
        ingresos: state.ingresos, 
        egresos: state.egresos, 
        movimientos: state.movimientos 
      }),
    }
  )
);
