// Integración robusta de driver.js compatible con Vite + ESM/CJS
// Importa el CSS normalmente
import 'driver.js/dist/driver.css';
import * as DriverNS from 'driver.js';

// Driver.js v1.3.x ESM: export function driver(options): Driver
// Usar la función driver, no new Driver()

import type { Side } from 'driver.js';

export function useTour() {
  // Utilidad para filtrar pasos según la pantalla
  function getStepsFor(page: 'login' | 'dashboard' | 'caja') {
    if (page === 'login') {
      return steps.slice(0, 4); // Solo pasos de login
    }
    if (page === 'dashboard') {
      // Dashboard: saldo, ingresos, egresos, ultimos movimientos, resumen, ir a caja, navbar
      return steps.slice(4, 11);
    }
    if (page === 'caja') {
      // Caja: resumen diaria, monto, descripcion, categoria, ingreso, egreso, reiniciar, historial, filtros, exportar, acciones
      return steps.slice(11);
    }
    return steps;
  }

  /**
   * page: 'login' | 'dashboard' | 'caja'
   * Llama startTour('dashboard') para mostrar solo el tour de dashboard
   */
  const startTour = (page: 'login' | 'dashboard' | 'caja' = 'dashboard') => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    // Singleton para evitar múltiples instancias
    // @ts-expect-error: Driver.js instancia global para evitar duplicados
    if (window.__driverInstance) {
      // @ts-expect-error: Driver.js instancia global para evitar duplicados
      window.__driverInstance.destroy();
      // @ts-expect-error: Driver.js instancia global para evitar duplicados
      window.__driverInstance = null;
    }
    // Usar la función driver, no new Driver()
    const driver = DriverNS.driver({
      animate: true,
      overlayOpacity: 0.75,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Entendido',
      // closeBtnText no existe en la API, se omite
    });
    const filteredSteps = getStepsFor(page);
    driver.setSteps(filteredSteps);

    driver.drive(0); // Inicia el tour desde el primer paso
  };

  // Corrige los pasos: usa 'side' con tipo 'Side' explícito
  const steps = [
    // LOGIN
    {
      element: '#email-input',
      popover: {
        title: 'Correo Electrónico',
        description: 'Ingresa tu correo electrónico registrado para acceder.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#password-input',
      popover: {
        title: 'Contraseña',
        description: 'Escribe tu contraseña para iniciar sesión.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#login-button',
      popover: {
        title: 'Iniciar sesión',
        description: 'Haz clic aquí para entrar al sistema.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#demo-access',
      popover: {
        title: 'Acceso demo',
        description: 'Puedes probar el sistema con el usuario y contraseña de ejemplo.',
        side: 'top' as Side,
      },
    },
    // DASHBOARD
    {
      element: '#saldo-actual',
      popover: {
        title: 'Saldo Actual',
        description: 'Aquí ves el dinero disponible en tu caja.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#ingresos-totales',
      popover: {
        title: 'Ingresos Totales',
        description: 'Suma de todos los ingresos registrados.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#egresos-totales',
      popover: {
        title: 'Egresos Totales',
        description: 'Suma de todos los egresos registrados.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#ultimos-movimientos',
      popover: {
        title: 'Últimos Movimientos',
        description: 'Aquí puedes ver los movimientos más recientes. Haz clic en "Ver todos" para ir al historial completo.',
        side: 'top' as Side,
      },
    },
    {
      element: '#resumen-actividad',
      popover: {
        title: 'Resumen de Actividad',
        description: 'Visualiza la cantidad de movimientos y el balance entre ingresos y egresos.',
        side: 'top' as Side,
      },
    },
    {
      element: '#ir-a-caja',
      popover: {
        title: 'Ir a Caja',
        description: 'Haz clic aquí para registrar nuevos movimientos o ver el historial detallado.',
        side: 'top' as Side,
      },
    },
    {
      element: '#navbar',
      popover: {
        title: 'Menú de Navegación',
        description: 'Desde aquí puedes acceder al Dashboard, Caja, Configuración y Usuarios.',
        side: 'bottom' as Side,
      },
    },
    // CAJA
    {
      element: '#resumen-caja-diaria',
      popover: {
        title: 'Resumen Caja Diaria',
        description: 'Saldo, ingresos y egresos del día actual.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#monto-input',
      popover: {
        title: 'Monto',
        description: 'Ingresa el monto del movimiento.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#descripcion-input',
      popover: {
        title: 'Descripción',
        description: 'Describe brevemente el movimiento.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#categoria-select',
      popover: {
        title: 'Categoría',
        description: 'Selecciona la categoría correspondiente.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#btn-ingreso',
      popover: {
        title: 'Registrar Ingreso',
        description: 'Haz clic aquí para registrar un ingreso.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#btn-egreso',
      popover: {
        title: 'Registrar Egreso',
        description: 'Haz clic aquí para registrar un egreso.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#btn-reiniciar',
      popover: {
        title: 'Reiniciar',
        description: 'Limpia los campos del formulario para ingresar un nuevo movimiento.',
        side: 'bottom' as Side,
      },
    },
    {
      element: '#historial-movimientos',
      popover: {
        title: 'Historial de Movimientos',
        description: 'Aquí puedes ver todos los movimientos del día.',
        side: 'top' as Side,
      },
    },
    {
      element: '#filtros-historial',
      popover: {
        title: 'Filtros',
        description: 'Filtra los movimientos por descripción, tipo, categoría o fecha.',
        side: 'top' as Side,
      },
    },
    {
      element: '#exportar-reportes',
      popover: {
        title: 'Exportar Reportes',
        description: 'Descarga el historial en formato CSV, PDF o Word.',
        side: 'top' as Side,
      },
    },
    {
      element: '#acciones-movimientos',
      popover: {
        title: 'Eliminar Movimiento',
        description: 'Haz clic en "Eliminar" para borrar un movimiento registrado.',
        side: 'top' as Side,
      },
    },
  ];
  return { startTour };
}
