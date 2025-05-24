import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const rol = useAuthStore((state) => state.rol);
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-100" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 6 9-6" />
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">CajaPyme</span>
          </h1>
          {/* Botón hamburguesa para móviles */}
          <button
            className="md:hidden flex items-center px-3 py-2 border rounded-lg text-blue-100 border-blue-400 hover:bg-blue-700 focus:outline-none transition-all"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Abrir menú de navegación"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Navegación desktop */}
          <nav id="navbar" className="hidden md:flex gap-3 items-center">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-2 rounded-md transition-all font-medium text-sm gap-2 ${
                location.pathname.startsWith('/dashboard') 
                  ? 'bg-white text-blue-700 shadow-md' 
                  : 'hover:bg-blue-700 text-white'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/caja"
              className={`flex items-center px-4 py-2 rounded-md transition-all font-medium text-sm gap-2 ${
                location.pathname.startsWith('/caja') 
                  ? 'bg-white text-blue-700 shadow-md' 
                  : 'hover:bg-blue-700 text-white'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V3m0 18v-3" />
              </svg>
              Caja
            </Link>
            <Link
              to="/configuracion"
              className={`flex items-center px-4 py-2 rounded-md transition-all font-medium text-sm gap-2 ${
                location.pathname.startsWith('/configuracion') 
                  ? 'bg-white text-blue-700 shadow-md' 
                  : 'hover:bg-blue-700 text-white'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración
            </Link>
            {rol === 'admin' && (
              <Link
                to="/admin/usuarios"
                className={`flex items-center px-4 py-2 rounded-md transition-all font-medium text-sm gap-2 ${
                  location.pathname.startsWith('/admin/usuarios') 
                    ? 'bg-white text-blue-700 shadow-md' 
                    : 'hover:bg-blue-700 text-white'
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 3.87V4a4 4 0 10-8 0v16m8 0a4 4 0 01-8 0" />
                </svg>
                Usuarios
              </Link>
            )}
          </nav>
        </div>
        {/* Navegación móvil */}
        {navOpen && (
          <nav className="md:hidden bg-blue-700 px-4 py-3 flex flex-col gap-2">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-2 rounded-md transition-all font-medium text-sm gap-2 ${
                location.pathname.startsWith('/dashboard') 
                  ? 'bg-white text-blue-700 shadow-md' 
                  : 'hover:bg-blue-800 text-white'
              }`}
              onClick={() => setNavOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/caja"
              className={`flex items-center px-4 py-2 rounded-md transition-all font-medium text-sm gap-2 ${
                location.pathname.startsWith('/caja') 
                  ? 'bg-white text-blue-700 shadow-md' 
                  : 'hover:bg-blue-800 text-white'
              }`}
              onClick={() => setNavOpen(false)}
            >
              Caja
            </Link>
            <Link
              to="/configuracion"
              className={`flex items-center px-4 py-2 rounded-md transition-all font-medium text-sm gap-2 ${
                location.pathname.startsWith('/configuracion') 
                  ? 'bg-white text-blue-700 shadow-md' 
                  : 'hover:bg-blue-800 text-white'
              }`}
              onClick={() => setNavOpen(false)}
            >
              Configuración
            </Link>
            {rol === 'admin' && (
              <Link
                to="/admin/usuarios"
                className={`flex items-center px-4 py-2 rounded-md transition-all font-medium text-sm gap-2 ${
                  location.pathname.startsWith('/admin/usuarios') 
                    ? 'bg-white text-blue-700 shadow-md' 
                    : 'hover:bg-blue-800 text-white'
                }`}
                onClick={() => setNavOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6 3.87V4a4 4 0 10-8 0v16m8 0a4 4 0 01-8 0" />
                </svg>
                Usuarios
              </Link>
            )}
          </nav>
        )}
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="bg-blue-900 text-blue-100 text-center py-4 text-xs mt-8">
        &copy; {new Date().getFullYear()} CajaPyme. Todos los derechos reservados.
      </footer>
    </div>
  );
};
