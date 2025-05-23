import { useEffect, useState } from 'react';
import { useCajaStore } from '../store/useStore';
import type { Movimiento } from '../store/useStore';
import { saveAs } from 'file-saver';
import * as api from '../api/movimientosApi';

const PAGE_SIZE = 10;

export function CajaResumen() {
  const { saldo, ingresos, egresos, movimientos, reset, setMovimientos, isLoading, setLoading } = useCajaStore();

  const [monto, setMonto] = useState<string>('0');
  const [descripcion, setDescripcion] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroTexto, setFiltroTexto] = useState<string>('');
  const [filtroFecha, setFiltroFecha] = useState<string>('');
  const [toast, setToast] = useState<string>('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editMonto, setEditMonto] = useState<string>('');
  const [editDescripcion, setEditDescripcion] = useState<string>('');
  const [editFecha, setEditFecha] = useState<string>('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<null | string>(null);
  const [deleteTargetDesc, setDeleteTargetDesc] = useState<string>('');

  const formatoCLP = (valor: number) => valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
  const montoNumber = Number(monto);

  useEffect(() => {
    const syncMovimientosFromApi = async () => {
      try {
        setLoading(true);
        const localData = localStorage.getItem('cajapyme-storage');
        if (!localData || JSON.parse(localData).state.movimientos.length === 0) {
          const movs = await api.obtenerMovimientos();
          setMovimientos(movs);
          const ingresos = movs.filter((m: Movimiento) => m.tipo === 'ingreso').reduce((acc: number, m: Movimiento) => acc + m.monto, 0);
          const egresos = movs.filter((m: Movimiento) => m.tipo === 'egreso').reduce((acc: number, m: Movimiento) => acc + m.monto, 0);
          const saldo = ingresos - egresos;
          useCajaStore.setState({ ingresos, egresos, saldo });
        }
      } catch {
        setToast('Error al cargar datos. Intente nuevamente.');
        setTimeout(() => setToast(''), 3000);
      } finally {
        setLoading(false);
      }
    };
    syncMovimientosFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncMovimientosYTotales = async () => {
    try {
      setLoading(true);
      const movs = await api.obtenerMovimientos();
      setMovimientos(movs);
      const ingresos = movs.filter((m: Movimiento) => m.tipo === 'ingreso').reduce((acc: number, m: Movimiento) => acc + m.monto, 0);
      const egresos = movs.filter((m: Movimiento) => m.tipo === 'egreso').reduce((acc: number, m: Movimiento) => acc + m.monto, 0);
      const saldo = ingresos - egresos;
      useCajaStore.setState({ ingresos, egresos, saldo });
    } catch {
      setToast('Error al sincronizar. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const onIngreso = async () => {
    if (montoNumber > 0 && descripcion.trim() !== '') {
      try {
        setLoading(true);
        const nuevo = {
          id: crypto.randomUUID(),
          tipo: 'ingreso' as const,
          monto: montoNumber,
          descripcion,
          fecha: new Date().toISOString(),
        };
        await api.agregarMovimiento(nuevo);
        await syncMovimientosYTotales();
        setMonto('0');
        setDescripcion('');
        setError('');
        setToast('Ingreso registrado');
        setTimeout(() => setToast(''), 2000);
      } catch {
        setToast('Error al registrar. Intente nuevamente.');
        setTimeout(() => setToast(''), 3000);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Debes ingresar un monto mayor a 0 y una descripción.');
    }
  };

  const onEgreso = async () => {
    if (montoNumber > 0 && descripcion.trim() !== '') {
      try {
        setLoading(true);
        const nuevo = {
          id: crypto.randomUUID(),
          tipo: 'egreso' as const,
          monto: montoNumber,
          descripcion,
          fecha: new Date().toISOString(),
        };
        await api.agregarMovimiento(nuevo);
        await syncMovimientosYTotales();
        setMonto('0');
        setDescripcion('');
        setError('');
        setToast('Egreso registrado');
        setTimeout(() => setToast(''), 2000);
      } catch {
        setToast('Error al registrar. Intente nuevamente.');
        setTimeout(() => setToast(''), 3000);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Debes ingresar un monto mayor a 0 y una descripción.');
    }
  };

  const movimientosFiltrados = movimientos.filter((mov: Movimiento) => {
    const coincideTipo = filtroTipo === 'todos' || mov.tipo === filtroTipo;
    const coincideTexto = filtroTexto.trim() === '' || mov.descripcion.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideFecha = filtroFecha === '' || mov.fecha.slice(0, 10) === filtroFecha;
    return coincideTipo && coincideTexto && coincideFecha;
  });

  const totalIngresos = movimientosFiltrados.filter((m: Movimiento) => m.tipo === 'ingreso').reduce((acc: number, m: Movimiento) => acc + m.monto, 0);
  const totalEgresos = movimientosFiltrados.filter((m: Movimiento) => m.tipo === 'egreso').reduce((acc: number, m: Movimiento) => acc + m.monto, 0);
  const saldoFiltrado = totalIngresos - totalEgresos;

  const handleEditar = (mov: Movimiento) => {
    setEditandoId(mov.id);
    setEditMonto(mov.monto.toString());
    setEditDescripcion(mov.descripcion);
    setEditFecha(mov.fecha.slice(0, 16));
  };

  const handleGuardarEdicion = async (id: string) => {
    if (Number(editMonto) > 0 && editDescripcion.trim() !== '' && editFecha) {
      try {
        setLoading(true);
        await api.editarMovimiento(id, {
          monto: Number(editMonto),
          descripcion: editDescripcion,
          fecha: new Date(editFecha).toISOString(),
        });
        await syncMovimientosYTotales();
        setEditandoId(null);
        setEditMonto('');
        setEditDescripcion('');
        setEditFecha('');
        setToast('Movimiento editado');
        setTimeout(() => setToast(''), 2000);
      } catch {
        setToast('Error al editar. Intente nuevamente.');
        setTimeout(() => setToast(''), 3000);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Debes ingresar monto, descripción y fecha válidos.');
    }
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setEditMonto('');
    setEditDescripcion('');
    setEditFecha('');
  };

  const handleEliminarMovimiento = (id: string, descripcion: string) => {
    setShowDeleteModal(id);
    setDeleteTargetDesc(descripcion);
  };
  const confirmDelete = async () => {
    if (showDeleteModal) {
      try {
        setLoading(true);
        await api.eliminarMovimientoApi(showDeleteModal);
        await syncMovimientosYTotales();
        setToast('Movimiento eliminado');
        setShowDeleteModal(null);
        setTimeout(() => setToast(''), 2000);
      } catch {
        setToast('Error al eliminar. Intente nuevamente.');
        setTimeout(() => setToast(''), 3000);
      } finally {
        setLoading(false);
      }
    }
  };
  const cancelDelete = () => setShowDeleteModal(null);

  const handleReset = () => setShowResetModal(true);
  const confirmReset = async () => {
    try {
      setLoading(true);
      reset();
      const allMovimientos = [...movimientos];
      for (const mov of allMovimientos) {
        await api.eliminarMovimientoApi(mov.id);
      }
      useCajaStore.setState({ ingresos: 0, egresos: 0, saldo: 0 });
      setToast('Caja reiniciada');
      setShowResetModal(false);
      setTimeout(() => setToast(''), 2000);
    } catch {
      setToast('Error al reiniciar. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  };
  const cancelReset = () => setShowResetModal(false);

  const exportarCSV = () => {
    try {
      const encabezado = 'Fecha,Tipo,Monto,Descripción\n';
      const filas = movimientosFiltrados.map((mov) =>
        [
          new Date(mov.fecha).toLocaleString(),
          mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso',
          mov.monto.toFixed(2),
          '"' + mov.descripcion.replace(/"/g, '""') + '"',
        ].join(',')
      );
      const csv = encabezado + filas.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `movimientos_caja_${new Date().toISOString().slice(0, 10)}.csv`);
      setToast('Exportación exitosa');
      setTimeout(() => setToast(''), 2000);
    } catch {
      setToast('Error al exportar. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    }
  };

  useEffect(() => {
    setTotalPaginas(Math.max(1, Math.ceil(movimientosFiltrados.length / PAGE_SIZE)));
    if (pagina > Math.ceil(movimientosFiltrados.length / PAGE_SIZE)) {
      setPagina(1);
    }
  }, [movimientosFiltrados.length, pagina]);

  const movimientosPagina = movimientosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  return (
    <div className="p-6 border rounded-2xl shadow-xl max-w-2xl mx-auto bg-white animate-fade-in relative">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
            <div className="text-gray-700 font-medium">Cargando...</div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m-7-7h14" /></svg>
        Resumen Caja Diaria
      </h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex-1 min-w-[120px] text-center">
          <div className="text-xs text-blue-600">Saldo</div>
          <div className="text-xl font-bold text-blue-900">{formatoCLP(saldo)}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex-1 min-w-[120px] text-center">
          <div className="text-xs text-green-600">Ingresos</div>
          <div className="text-lg font-semibold text-green-800">+{formatoCLP(ingresos)}</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex-1 min-w-[120px] text-center">
          <div className="text-xs text-red-600">Egresos</div>
          <div className="text-lg font-semibold text-red-800">-{formatoCLP(egresos)}</div>
        </div>
      </div>
      {/* Formulario de ingreso/egreso */}
      <form className="flex flex-col md:flex-row gap-2 mb-2" onSubmit={e => e.preventDefault()}>
        <input
          type="number"
          min="0"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="border p-2 rounded w-full md:w-32 focus:ring-2 focus:ring-blue-200"
          placeholder="Monto"
        />
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-200"
          placeholder="Descripción"
        />
        <button
          type="button"
          onClick={onIngreso}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold shadow"
        >
          + Ingreso
        </button>
        <button
          type="button"
          onClick={onEgreso}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold shadow"
        >
          - Egreso
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold shadow focus:ring-2 focus:ring-red-300"
        >
          Reset
        </button>
      </form>
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      {toast && <div className="fixed top-4 right-4 bg-blue-700 text-white px-4 py-2 rounded shadow z-50 animate-fade-in">{toast}</div>}
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mt-6 mb-2 items-end">
        <label className="text-sm">Tipo:
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="ml-1 border rounded p-1">
            <option value="todos">Todos</option>
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </select>
        </label>
        <label className="text-sm">Descripción:
          <input type="text" value={filtroTexto} onChange={e => setFiltroTexto(e.target.value)} className="ml-1 border rounded p-1" placeholder="Buscar..." />
        </label>
        <label className="text-sm">Fecha:
          <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} className="ml-1 border rounded p-1" />
        </label>
        <button onClick={exportarCSV} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm ml-auto">Exportar CSV</button>
      </div>
      {/* Totales filtrados */}
      <div className="flex gap-4 mt-2 text-sm">
        <span>Ingresos filtrados: <span className="font-semibold text-green-700">{formatoCLP(totalIngresos)}</span></span>
        <span>Egresos filtrados: <span className="font-semibold text-red-700">{formatoCLP(totalEgresos)}</span></span>
        <span>Saldo filtrado: <span className="font-semibold">{formatoCLP(saldoFiltrado)}</span></span>
      </div>
      <h3 className="text-lg font-semibold mt-4 mb-2 text-blue-800 flex items-center gap-2">
        Historial de movimientos
      </h3>
      <table className="min-w-full text-sm border border-gray-200 bg-white" role="table" aria-label="Historial de movimientos">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-2 py-1 border" scope="col">Fecha</th>
            <th className="px-2 py-1 border" scope="col">Tipo</th>
            <th className="px-2 py-1 border" scope="col">Monto</th>
            <th className="px-2 py-1 border">Descripción</th>
            <th className="px-2 py-1 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientosPagina.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-2 text-gray-400">Sin movimientos</td>
            </tr>
          )}
          {movimientosPagina.map((mov) => (
            <tr key={mov.id} className={mov.tipo === 'ingreso' ? 'bg-green-50 transition-colors duration-300' : 'bg-red-50 transition-colors duration-300'}>
              {editandoId === mov.id ? (
                <>
                  <td className="border px-2 py-1">
                    <input
                      type="datetime-local"
                      value={editFecha}
                      onChange={e => setEditFecha(e.target.value)}
                      className="border p-1 rounded w-full"
                      aria-label="Editar fecha"
                    />
                  </td>
                  <td className="border px-2 py-1 font-bold text-center">
                    {mov.tipo === 'ingreso' ? (
                      <span className="inline-flex items-center gap-1 text-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Ingreso
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        Egreso
                      </span>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-right">
                    <input
                      type="number"
                      min="0"
                      value={editMonto}
                      onChange={e => setEditMonto(e.target.value)}
                      className="border p-1 rounded w-20 text-right"
                      aria-label="Editar monto"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      value={editDescripcion}
                      onChange={e => setEditDescripcion(e.target.value)}
                      className="border p-1 rounded w-full"
                      aria-label="Editar descripción"
                    />
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button onClick={() => handleGuardarEdicion(mov.id)} className="text-xs text-green-700 hover:underline mr-2">Guardar</button>
                    <button onClick={handleCancelarEdicion} className="text-xs text-gray-500 hover:underline">Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border px-2 py-1">{new Date(mov.fecha).toLocaleString()}</td>
                  <td className="border px-2 py-1 font-bold text-center">
                    {mov.tipo === 'ingreso' ? (
                      <span className="inline-flex items-center gap-1 text-green-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Ingreso
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        Egreso
                      </span>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-right">{formatoCLP(mov.monto)}</td>
                  <td className="border px-2 py-1">{mov.descripcion}</td>
                  <td className="border px-2 py-1 text-center">
                    <button onClick={() => handleEditar(mov)} className="text-xs text-blue-600 hover:underline mr-2">Editar</button>
                    <button onClick={() => handleEliminarMovimiento(mov.id, mov.descripcion)} className="text-xs text-red-600 hover:underline">Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          disabled={pagina === 1}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          aria-label="Página anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm">Página {pagina} de {totalPaginas}</span>
        <button
          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          disabled={pagina === totalPaginas}
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          aria-label="Página siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      {/* Modal de reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm border border-red-200 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <svg className="h-10 w-10 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-lg font-bold text-red-700 mb-2">¿Estás seguro?</h3>
              <p className="text-sm text-gray-700 mb-4">Se perderán <span className="font-semibold text-red-600">todos los movimientos del día</span>. Esta acción no se puede deshacer.</p>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button onClick={confirmReset} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold shadow">Sí, reiniciar</button>
                <button onClick={cancelReset} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded font-semibold">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm border border-red-200 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <svg className="h-10 w-10 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-lg font-bold text-red-700 mb-2">¿Eliminar movimiento?</h3>
              <p className="text-sm text-gray-700 mb-4">¿Seguro que deseas eliminar <span className="font-semibold text-red-600">"{deleteTargetDesc}"</span>? Esta acción no se puede deshacer.</p>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-semibold shadow">Sí, eliminar</button>
                <button onClick={cancelDelete} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded font-semibold">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
