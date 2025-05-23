import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" /></svg>
  ) },
  { to: '/caja', label: 'Caja', icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
  ) },
  { to: '/configuracion', label: 'Configuración', icon: (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) },
];

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold tracking-wide flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" /></svg>
            CajaPyme
          </h1>
          {/* Botón hamburguesa para móviles */}
          <button
            className="md:hidden flex items-center px-2 py-1 border rounded text-blue-100 border-blue-300 hover:bg-blue-800 focus:outline-none"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Abrir menú de navegación"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {/* Navegación desktop */}
          <nav className="hidden md:flex gap-2">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-3 py-1.5 rounded transition-colors font-medium text-sm ${location.pathname.startsWith(item.to) ? 'bg-blue-700 text-white' : 'hover:bg-blue-800 text-blue-100'}`}
              >
                {item.icon}{item.label}
              </Link>
            ))}
            <Link to="/login" className="ml-4 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-medium text-sm">Salir</Link>
          </nav>
        </div>
        {/* Navegación móvil */}
        {navOpen && (
          <nav className="md:hidden flex flex-col gap-2 px-4 pb-4 animate-fade-in">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setNavOpen(false)}
                className={`flex items-center px-3 py-2 rounded transition-colors font-medium text-base ${location.pathname.startsWith(item.to) ? 'bg-blue-700 text-white' : 'hover:bg-blue-800 text-blue-100'}`}
              >
                {item.icon}{item.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setNavOpen(false)} className="mt-2 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium text-base">Salir</Link>
          </nav>
        )}
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>
      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white">&copy; {new Date().getFullYear()} CajaPyme</footer>
    </div>
  );
};
