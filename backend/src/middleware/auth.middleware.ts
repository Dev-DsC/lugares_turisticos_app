import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { UsuarioModel } from '../models/usuario.model';

const JWT_SECRET = process.env['JWT_SECRET'] || 'changeme';

export interface AuthRequest extends Express.Request {
  userId?: string;
  userRole?: 'user' | 'admin';
}

export const authMiddleware: RequestHandler = async (req: any, res, next) => {
  const authHeader = req.headers?.authorization as string | undefined;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const userId = payload.userId as string | undefined;
    if (!userId) return res.status(401).json({ mensaje: 'Token inválido' });

    // Fetch user to get current role (in case it changed)
    const usuario = await UsuarioModel.findById(userId).select('role');
    if (!usuario)
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });

    req.userId = userId;
    req.userRole = usuario.role;
    return next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};
