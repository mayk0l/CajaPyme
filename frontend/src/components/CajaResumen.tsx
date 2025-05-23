import { useEffect, useState } from 'react';
import { useCajaStore } from '../store/useStore';
import { useConfigStore } from '../store/configStore';
import type { Movimiento } from '../store/useStore';
import { saveAs } from 'file-saver';
import * as api from '../api/movimientosApi';
import type { MovimientoInput } from '../api/movimientosApi';

const PAGE_SIZE = 10;

type MovimientoId = number;

export function CajaResumen() {
  const { saldo, ingresos, egresos, movimientos, reset, setMovimientos, isLoading, setLoading } = useCajaStore();
  const store = useConfigStore();

  // Estados para formularios y UI
  const [monto, setMonto] = useState('0');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('general');
  const [error, setError] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [toast, setToast] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<MovimientoId | null>(null);
  const [deleteTargetDesc, setDeleteTargetDesc] = useState('');
  // Edición
  const [editandoId, setEditandoId] = useState<MovimientoId | null>(null);
  const [editMonto, setEditMonto] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editFecha, setEditFecha] = useState('');
  const [editCategoria, setEditCategoria] = useState('general');

  const formatoCLP = (valor: number) => valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
  const montoNumber = Number(monto);

  // Sincroniza movimientos desde API si es necesario
  useEffect(() => {
    const syncMovimientosFromApi = async () => {
      try {
        setLoading(true);
        const movs = await api.obtenerMovimientos();
        setMovimientos(movs);
        const ingresos = movs.filter((m: Movimiento) => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
        const egresos = movs.filter((m: Movimiento) => m.tipo === 'egreso').reduce((acc, m) => acc + m.monto, 0);
        const saldo = ingresos - egresos;
        useCajaStore.setState({ ingresos, egresos, saldo });
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

  // Sincroniza movimientos y totales tras cambios
  const syncMovimientosYTotales = async () => {
    try {
      setLoading(true);
      const movs = await api.obtenerMovimientos();
      setMovimientos(movs);
      const ingresos = movs.filter((m: Movimiento) => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
      const egresos = movs.filter((m: Movimiento) => m.tipo === 'egreso').reduce((acc, m) => acc + m.monto, 0);
      const saldo = ingresos - egresos;
      useCajaStore.setState({ ingresos, egresos, saldo });
    } catch {
      setToast('Error al sincronizar. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Agregar movimiento
  const onIngreso = async () => {
    if (montoNumber > 0 && descripcion.trim() !== '') {
      try {
        setLoading(true);
        const nuevo: MovimientoInput = {
          tipo: 'ingreso',
          monto: montoNumber,
          descripcion,
          fecha: new Date().toISOString(),
          categoria,
        };
        await api.agregarMovimiento(nuevo);
        await syncMovimientosYTotales();
        setMonto('0');
        setDescripcion('');
        setCategoria('general');
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
      setTimeout(() => setError(''), 3000);
    }
  };

  const onEgreso = async () => {
    if (montoNumber > 0 && descripcion.trim() !== '') {
      try {
        setLoading(true);
        const nuevo: MovimientoInput = {
          tipo: 'egreso',
          monto: montoNumber,
          descripcion,
          fecha: new Date().toISOString(),
          categoria,
        };
        await api.agregarMovimiento(nuevo);
        await syncMovimientosYTotales();
        setMonto('0');
        setDescripcion('');
        setCategoria('general');
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
      setTimeout(() => setError(''), 3000);
    }
  };

  // Reset de caja
  const handleReset = () => setShowResetModal(true);
  const confirmReset = async () => {
    try {
      setLoading(true);
      reset();
      for (const mov of movimientos) {
        await api.eliminarMovimientoApi(mov.id);
      }
      useCajaStore.setState({ ingresos: 0, egresos: 0, saldo: 0 });
      setToast('Caja reiniciada');
      setShowResetModal(false);
      await syncMovimientosYTotales();
      setTimeout(() => setToast(''), 2000);
    } catch {
      setToast('Error al reiniciar. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  };
  const cancelReset = () => setShowResetModal(false);

  // Eliminar movimiento
  const handleEliminarMovimiento = (id: MovimientoId, desc: string) => {
    setDeleteTargetId(id);
    setDeleteTargetDesc(desc);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (deleteTargetId == null) return;
    try {
      setLoading(true);
      await api.eliminarMovimientoApi(deleteTargetId);
      setToast('Movimiento eliminado');
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      setDeleteTargetDesc('');
      await syncMovimientosYTotales();
      setTimeout(() => setToast(''), 2000);
    } catch {
      setToast('Error al eliminar. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
    setDeleteTargetDesc('');
  };

  // Edición de movimiento
  const handleEditar = (mov: Movimiento) => {
    setEditandoId(mov.id);
    setEditMonto(mov.monto.toString());
    setEditDescripcion(mov.descripcion);
    setEditFecha(mov.fecha.slice(0, 16)); // formato yyyy-MM-ddTHH:mm
    setEditCategoria(mov.categoria || 'general');
  };
  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setEditMonto('');
    setEditDescripcion('');
    setEditFecha('');
    setEditCategoria('general');
  };
  const handleGuardarEdicion = async (id: MovimientoId) => {
    try {
      setLoading(true);
      await api.editarMovimiento(id, {
        monto: Number(editMonto),
        descripcion: editDescripcion,
        fecha: editFecha,
        categoria: editCategoria,
      });
      setToast('Movimiento editado');
      setEditandoId(null);
      setEditMonto('');
      setEditDescripcion('');
      setEditFecha('');
      setEditCategoria('general');
      await syncMovimientosYTotales();
      setTimeout(() => setToast(''), 2000);
    } catch {
      setToast('Error al editar. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Filtros (incluye categoría)
  const movimientosFiltrados = movimientos.filter((m) => {
    const tipoOk = filtroTipo === 'todos' || m.tipo === filtroTipo;
    const categoriaOk = filtroCategoria === 'todas' || m.categoria === filtroCategoria;
    const textoOk = m.descripcion.toLowerCase().includes(filtroTexto.toLowerCase());
    const fechaOk = !filtroFecha || m.fecha.slice(0, 10) === filtroFecha;
    return tipoOk && categoriaOk && textoOk && fechaOk;
  });

  // Totales filtrados
  const totalIngresos = movimientosFiltrados.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
  const totalEgresos = movimientosFiltrados.filter(m => m.tipo === 'egreso').reduce((acc, m) => acc + m.monto, 0);
  const saldoFiltrado = totalIngresos - totalEgresos;
  
  // Paginación
  useEffect(() => {
    setTotalPaginas(Math.max(1, Math.ceil(movimientosFiltrados.length / PAGE_SIZE)));
    if (pagina > Math.ceil(movimientosFiltrados.length / PAGE_SIZE)) {
      setPagina(1);
    }
  }, [movimientosFiltrados, pagina]);

  const movimientosPagina = movimientosFiltrados.slice((pagina - 1) * PAGE_SIZE, pagina * PAGE_SIZE);

  // Obtener categorías únicas para el filtro
  const categoriasUnicas = ['todas', ...new Set(movimientos.map((m) => m.categoria || 'general'))];

  // Exportar CSV
  const exportarCSV = () => {
    try {
      // Información de la empresa y reporte
      const empresa = store.nombreEmpresa || 'CajaPyme';
      const fechaGeneracion = new Date().toLocaleString('es-CL');
      
      // Encabezado con metadatos
      let encabezado = `"${empresa} - Reporte de Movimientos",""\n`;
      encabezado += `"Fecha de generación:","${fechaGeneracion}"\n`;
      
      // Información de filtros aplicados
      if (filtroTipo !== 'todos' || filtroCategoria !== 'todas' || filtroFecha || filtroTexto) {
        encabezado += '"Filtros aplicados:",""\n';
        if (filtroTipo !== 'todos') encabezado += `"Tipo:","${filtroTipo}"\n`;
        if (filtroCategoria !== 'todas') encabezado += `"Categoría:","${filtroCategoria}"\n`;
        if (filtroFecha) encabezado += `"Fecha:","${filtroFecha}"\n`;
        if (filtroTexto) encabezado += `"Búsqueda:","${filtroTexto}"\n`;
      }
      
      // Resumen financiero
      encabezado += '"Resumen",""\n';
      encabezado += `"Saldo total:","${formatoCLP(saldoFiltrado).replace('$', '')}"\n`;
      encabezado += `"Total ingresos:","${formatoCLP(totalIngresos).replace('$', '')}"\n`;
      encabezado += `"Total egresos:","${formatoCLP(totalEgresos).replace('$', '')}"\n\n`;
      
      // Encabezado de la tabla de movimientos
      encabezado += '"ID","Fecha","Tipo","Categoría","Monto","Descripción"\n';
      
      // Filas con los movimientos
      const filas = movimientosFiltrados.map((mov) =>
        [
          mov.id,
          `"${new Date(mov.fecha).toLocaleString('es-CL')}"`,
          `"${mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}"`,
          `"${(mov.categoria || 'General').charAt(0).toUpperCase() + (mov.categoria || 'General').slice(1)}"`,
          `"${mov.tipo === 'ingreso' ? '+' : '-'}${mov.monto.toLocaleString('es-CL', { minimumFractionDigits: 0 })}"`,
          `"${mov.descripcion.replace(/"/g, '""')}"`,
        ].join(',')
      );
      
      const csv = encabezado + filas.join('\n');
      
      // Añadir BOM para que Excel interprete correctamente los caracteres UTF-8
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
      
      saveAs(blob, `${empresa.replace(/\s+/g, '_')}_Movimientos_${new Date().toISOString().slice(0, 10)}.csv`);
      setToast('Exportación CSV exitosa');
      setTimeout(() => setToast(''), 2000);
    } catch (error) {
      console.error('Error CSV:', error);
      setToast('Error al exportar CSV. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    }
  };

  // Exportar PDF
  const exportarPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      // Crear nuevo documento PDF
      const doc = new jsPDF();
      
      // Agregar encabezado
      const empresa = store.nombreEmpresa || 'CajaPyme';
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text(empresa, 105, 15, { align: 'center' });
      
      // Subtítulo
      doc.setFontSize(14);
      doc.setTextColor(80, 80, 80);
      doc.text('Movimientos de Caja', 105, 25, { align: 'center' });
      
      // Fecha y filtros aplicados
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const fechaActual = new Date().toLocaleDateString('es-CL');
      doc.text(`Generado: ${fechaActual}`, 105, 32, { align: 'center' });
      
      // Información de filtros aplicados
      let infoFiltros = '';
      if (filtroTipo !== 'todos') infoFiltros += `Tipo: ${filtroTipo}, `;
      if (filtroCategoria !== 'todas') infoFiltros += `Categoría: ${filtroCategoria}, `;
      if (filtroFecha) infoFiltros += `Fecha: ${filtroFecha}, `;
      if (filtroTexto) infoFiltros += `Búsqueda: ${filtroTexto}, `;
      if (infoFiltros) {
        infoFiltros = 'Filtros: ' + infoFiltros.slice(0, -2);
        doc.text(infoFiltros, 105, 38, { align: 'center' });
      }
      
      // Resumen financiero
      doc.setFillColor(240, 240, 240);
      doc.rect(14, 45, 182, 20, 'F');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('Resumen:', 16, 53);
      doc.text(`Saldo: ${formatoCLP(saldoFiltrado)}`, 16, 60);
      doc.text(`Ingresos: ${formatoCLP(totalIngresos)}`, 90, 60);
      doc.text(`Egresos: ${formatoCLP(totalEgresos)}`, 160, 60);
      
      // Generar tabla de movimientos con autoTable
      autoTable(doc, {
        startY: 70,
        head: [['Fecha', 'Tipo', 'Categoría', 'Monto', 'Descripción']],
        body: movimientosFiltrados.map((mov) => [
          new Date(mov.fecha).toLocaleString('es-CL'),
          mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso',
          mov.categoria || 'General',
          formatoCLP(mov.monto),
          mov.descripcion
        ]),
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { 
          fillColor: [59, 130, 246], 
          textColor: [255, 255, 255],
          fontStyle: 'bold' 
        },
        alternateRowStyles: { fillColor: [245, 250, 254] },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25, halign: 'right' },
          4: { cellWidth: 'auto' }
        },
        margin: { top: 70 }
      });
      
      // Pie de página
      // @ts-expect-error: Las definiciones de tipos de jsPDF no incluyen todos los métodos internos
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${pageCount} - CajaPyme - ${fechaActual}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      doc.save(`movimientos_caja_${new Date().toISOString().slice(0, 10)}.pdf`);
      setToast('Exportación PDF exitosa');
      setTimeout(() => setToast(''), 2000);
    } catch (error) {
      console.error('Error PDF:', error);
      setToast('Error al exportar PDF. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    }
  };

  // Exportar Word
  const exportarWord = async () => {
    try {
      const empresa = store.nombreEmpresa || 'CajaPyme';
      const fechaActual = new Date().toLocaleDateString('es-CL');
      const estilos = `
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #2563EB; margin-bottom: 5px; }
          h2 { color: #4B5563; font-weight: normal; margin-top: 0; }
          .fecha { color: #6B7280; margin-bottom: 20px; font-size: 14px; }
          .filtros { background-color: #F3F4F6; padding: 10px 15px; border-radius: 4px; margin-bottom: 25px; font-size: 14px; }
          .resumen { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .resumen-item { text-align: center; padding: 15px; border: 1px solid #E5E7EB; border-radius: 5px; flex: 1; margin: 0 10px; }
          .resumen-item.saldo { border-left: 5px solid #2563EB; }
          .resumen-item.ingresos { border-left: 5px solid #10B981; }
          .resumen-item.egresos { border-left: 5px solid #EF4444; }
          .resumen-label { font-size: 14px; color: #6B7280; margin-bottom: 8px; }
          .resumen-valor { font-size: 20px; font-weight: bold; }
          .saldo-valor { color: #2563EB; }
          .ingresos-valor { color: #10B981; }
          .egresos-valor { color: #EF4444; }
          table { width: 100%; border-collapse: collapse; }
          th { background-color: #2563EB; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #E5E7EB; }
          tr:nth-child(even) { background-color: #F9FAFB; }
          .ingreso { color: #10B981; }
          .egreso { color: #EF4444; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #9CA3AF; }
        </style>
      `;
      
      // Información de filtros
      let infoFiltros = '';
      if (filtroTipo !== 'todos') infoFiltros += `<b>Tipo:</b> ${filtroTipo}, `;
      if (filtroCategoria !== 'todas') infoFiltros += `<b>Categoría:</b> ${filtroCategoria}, `;
      if (filtroFecha) infoFiltros += `<b>Fecha:</b> ${filtroFecha}, `;
      if (filtroTexto) infoFiltros += `<b>Búsqueda:</b> ${filtroTexto}, `;
      
      // Header y resumen
      let contenido = `
        <div class="header">
          <h1>${empresa}</h1>
          <h2>Movimientos de Caja</h2>
          <p class="fecha">Generado: ${fechaActual}</p>
          ${infoFiltros ? `<div class="filtros">Filtros: ${infoFiltros.slice(0, -2)}</div>` : ''}
        </div>
        
        <div class="resumen">
          <div class="resumen-item saldo">
            <div class="resumen-label">Saldo</div>
            <div class="resumen-valor saldo-valor">${formatoCLP(saldoFiltrado)}</div>
          </div>
          <div class="resumen-item ingresos">
            <div class="resumen-label">Ingresos</div>
            <div class="resumen-valor ingresos-valor">${formatoCLP(totalIngresos)}</div>
          </div>
          <div class="resumen-item egresos">
            <div class="resumen-label">Egresos</div>
            <div class="resumen-valor egresos-valor">${formatoCLP(totalEgresos)}</div>
          </div>
        </div>
      `;
      
      // Tabla de movimientos
      contenido += `
        <table>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th>Monto</th>
            <th>Descripción</th>
          </tr>
      `;
      
      movimientosFiltrados.forEach((mov) => {
        const tipoClase = mov.tipo === 'ingreso' ? 'ingreso' : 'egreso';
        const signo = mov.tipo === 'ingreso' ? '+' : '-';
        contenido += `
          <tr>
            <td>${new Date(mov.fecha).toLocaleString('es-CL')}</td>
            <td>${mov.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}</td>
            <td>${(mov.categoria || 'General').charAt(0).toUpperCase() + (mov.categoria || 'General').slice(1)}</td>
            <td class="${tipoClase}">${signo}${formatoCLP(mov.monto)}</td>
            <td>${mov.descripcion}</td>
          </tr>
        `;
      });
      
      contenido += `</table>
        <div class="footer">
          <p>CajaPyme - Sistema de Control de Caja - ${fechaActual}</p>
        </div>
      `;
      
      // Crear blob y descargar
      const blob = new Blob([
        `<!DOCTYPE html><html><head><meta charset='utf-8'>${estilos}</head><body>${contenido}</body></html>`
      ], { type: 'application/msword' });
      
      saveAs(blob, `movimientos_caja_${new Date().toISOString().slice(0, 10)}.doc`);
      setToast('Exportación Word exitosa');
      setTimeout(() => setToast(''), 2000);
    } catch (error) {
      console.error('Error Word:', error);
      setToast('Error al exportar Word. Intente nuevamente.');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <div className="text-gray-700 font-medium text-lg">Cargando...</div>
          </div>
        </div>
      )}

      {/* Título principal */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V3m0 18v-3" />
          </svg>
          Resumen Caja Diaria
        </h2>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Tarjeta de saldo */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 overflow-hidden">
          <div className="p-5">
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <span className="inline-block w-5 h-5 text-blue-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V3m0 18v-3" />
                </svg>
              </span>
              Saldo
            </p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">{formatoCLP(saldo)}</h3>
          </div>
        </div>

        {/* Tarjeta de ingresos */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 overflow-hidden">
          <div className="p-5">
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <span className="inline-block w-5 h-5 text-green-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              Ingresos
            </p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">+{formatoCLP(ingresos)}</h3>
          </div>
        </div>

        {/* Tarjeta de egresos */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-red-500 overflow-hidden">
          <div className="p-5">
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <span className="inline-block w-5 h-5 text-red-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </span>
              Egresos
            </p>
            <h3 className="text-3xl font-bold text-red-600 mt-2">-{formatoCLP(egresos)}</h3>
          </div>
        </div>
      </div>

      {/* Registro de movimientos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Registrar Movimiento
        </h3>
        
        <form className="grid grid-cols-1 md:grid-cols-3 gap-5" onSubmit={e => e.preventDefault()}>
          {/* Campo Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                min="0"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                className="block w-full pl-8 pr-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          
          {/* Campo Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción del movimiento"
            />
          </div>
          
          {/* Campo Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              className="block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">General</option>
              <option value="ventas">Ventas</option>
              <option value="compras">Compras</option>
              <option value="servicios">Servicios</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          
          {/* Botones */}
          <div className="md:col-span-3 flex flex-wrap gap-3 mt-2">
            <button
              type="button"
              onClick={onIngreso}
              className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ingreso
            </button>
            
            <button
              type="button"
              onClick={onEgreso}
              className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
              Egreso
            </button>
            
            <button 
              onClick={handleReset}
              className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-colors ml-auto"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.635 19.364A9 9 0 104.582 9.582" />
              </svg>
              Reiniciar
            </button>
          </div>
          
          {/* Mensaje de error */}
          {error && (
            <div className="md:col-span-3 text-sm text-red-600 bg-red-50 p-3 rounded-md border-l-4 border-red-500">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Historial de movimientos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historial de Movimientos
          </h3>
        </div>

        {/* Filtros */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Filtro por texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input 
                type="text" 
                value={filtroTexto} 
                onChange={e => setFiltroTexto(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Buscar por descripción..."
              />
            </div>
            
            {/* Filtro por tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select 
                value={filtroTipo} 
                onChange={e => setFiltroTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="todos">Todos</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
            </div>
            
            {/* Filtro por categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select 
                value={filtroCategoria} 
                onChange={e => setFiltroCategoria(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {categoriasUnicas.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            
            {/* Filtro por fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input 
                type="date" 
                value={filtroFecha} 
                onChange={e => setFiltroFecha(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Exportación */}
          <div className="flex flex-wrap items-center justify-between mt-5 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3 text-sm mb-3 sm:mb-0">
              <span className="flex items-center">
                <span className="text-gray-600">Ingresos:</span>
                <span className="ml-1 font-semibold text-green-600">{formatoCLP(totalIngresos)}</span>
              </span>
              <span className="flex items-center">
                <span className="text-gray-600">Egresos:</span>
                <span className="ml-1 font-semibold text-red-600">{formatoCLP(totalEgresos)}</span>
              </span>
              <span className="flex items-center">
                <span className="text-gray-600">Saldo filtrado:</span>
                <span className={`ml-1 font-semibold ${saldoFiltrado >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatoCLP(saldoFiltrado)}
                </span>
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => exportarCSV()}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                CSV
              </button>
              <button 
                onClick={() => exportarPDF()}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PDF
              </button>
              <button 
                onClick={() => exportarWord()}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Word
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de movimientos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movimientosPagina.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No hay movimientos que coincidan con los filtros
                  </td>
                </tr>
              )}

              {movimientosPagina.map((mov) => (
                <tr key={mov.id} className={`hover:bg-gray-50 transition-colors ${editandoId === mov.id ? 'bg-blue-50' : ''}`}>
                  {editandoId === mov.id ? (
                    /* Modo edición */
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="datetime-local"
                          value={editFecha}
                          onChange={e => setEditFecha(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {mov.tipo === 'ingreso' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ingreso
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                            Egreso
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editCategoria}
                          onChange={e => setEditCategoria(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="general">General</option>
                          <option value="ventas">Ventas</option>
                          <option value="compras">Compras</option>
                          <option value="servicios">Servicios</option>
                          <option value="otros">Otros</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={editMonto}
                          onChange={e => setEditMonto(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={editDescripcion}
                          onChange={e => setEditDescripcion(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">
                        <button 
                          onClick={() => handleGuardarEdicion(Number(mov.id))} 
                          className="text-green-600 hover:text-green-900 text-sm font-medium mr-2"
                        >
                          Guardar
                        </button>
                        <button 
                          onClick={handleCancelarEdicion} 
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    /* Vista normal */
                    <>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {new Date(mov.fecha).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {mov.tipo === 'ingreso' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ingreso
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                            Egreso
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium 
                          ${mov.categoria === 'ventas' ? 'bg-blue-100 text-blue-800' : ''}
                          ${mov.categoria === 'compras' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${mov.categoria === 'servicios' ? 'bg-purple-100 text-purple-800' : ''}
                          ${mov.categoria === 'otros' ? 'bg-gray-100 text-gray-800' : ''}
                          ${mov.categoria === 'general' || !mov.categoria ? 'bg-green-100 text-green-800' : ''}
                        `}>
                          {mov.categoria ? mov.categoria.charAt(0).toUpperCase() + mov.categoria.slice(1) : 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                        <span className={mov.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'}>
                          {mov.tipo === 'ingreso' ? '+' : '-'}{formatoCLP(mov.monto)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">
                        {mov.descripcion}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button 
                          onClick={() => handleEditar(mov)} 
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium mr-2"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleEliminarMovimiento(Number(mov.id), mov.descripcion)} 
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{movimientosFiltrados.length ? (pagina - 1) * PAGE_SIZE + 1 : 0}</span> a <span className="font-medium">{Math.min(pagina * PAGE_SIZE, movimientosFiltrados.length)}</span> de <span className="font-medium">{movimientosFiltrados.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={pagina === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {[...Array(totalPaginas)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPagina(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${pagina === pageNumber ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={pagina === totalPaginas}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Siguiente</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
          <div className="flex sm:hidden justify-between w-full">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in transition-opacity">
          {toast}
        </div>
      )}

      {/* Modal Reiniciar */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Estás seguro?</h3>
              <p className="text-gray-700 mb-6">
                Se eliminarán <span className="font-semibold text-red-600">todos los movimientos</span>. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={confirmReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold shadow-sm transition-colors"
                >
                  Sí, reiniciar todo
                </button>
                <button
                  onClick={cancelReset}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar movimiento?</h3>
              <p className="text-gray-700 mb-6">
                ¿Estás seguro que deseas eliminar el movimiento "<span className="font-semibold text-red-600">{deleteTargetDesc}</span>"?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold shadow-sm transition-colors"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
