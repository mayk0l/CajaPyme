// Middleware para requerir un rol específico en rutas protegidas
// Uso: router.get('/ruta', authMiddleware, requireRole('admin'), handler)

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para restringir acceso a rutas según el rol del usuario autenticado.
 * @param role Rol requerido ("admin" o "cajero")
 * @returns Middleware Express
 */
export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user || !user.rol) {
      res.status(403).json({ message: 'Acceso denegado: usuario no autenticado' });
      return;
    }
    if (user.rol !== role) {
      res.status(403).json({ message: `Acceso denegado: se requiere rol '${role}'` });
      return;
    }
    next();
  };
}

/**
 * Ejemplo de uso en rutas:
 *
 * import { requireRole } from '../middlewares/requireRole';
 * router.get('/solo-admin', authMiddleware, requireRole('admin'), handler);
 */
