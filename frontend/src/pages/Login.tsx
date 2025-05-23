import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export const Login = () => {
  const { login } = useAuthStore();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(usuario, password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos o error de conexión');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xs flex flex-col gap-4 border">
        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Usuario (email)"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          className="border rounded p-2 focus:ring-2 focus:ring-blue-200"
          autoFocus
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded p-2 focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>
        {error && <div className="text-red-500 text-sm text-center animate-pulse">{error}</div>}
        <div className="text-xs text-gray-400 text-center mt-2">Usuario demo: <b>admin@caja.cl</b> / Contraseña: <b>123456</b></div>
      </form>
    </div>
  );
};
