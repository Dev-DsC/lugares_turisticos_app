import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioModel } from '../models/usuario.model';

const router = Router();
const JWT_SECRET = process.env['JWT_SECRET'] || 'changeme';

router.post('/registro', async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ mensaje: 'Email es obligatorio' });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res
      .status(400)
      .json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const existing = await UsuarioModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing) {
      return res.status(409).json({ mensaje: 'El email ya está registrado' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const usuario = await UsuarioModel.create({
      email: email.toLowerCase().trim(),
      passwordHash,
    });

    const token = jwt.sign(
      { userId: usuario._id.toString(), role: usuario.role },
      JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    return res.status(201).json({
      token,
      usuario: { _id: usuario._id, email: usuario.email, role: usuario.role },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: 'No fue posible registrar el usuario' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res
      .status(400)
      .json({ mensaje: 'Email y contraseña son obligatorios' });
  }

  try {
    const usuario = await UsuarioModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, usuario.passwordHash);
    if (!match) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: usuario._id.toString(), role: usuario.role },
      JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    return res.json({
      token,
      usuario: { _id: usuario._id, email: usuario.email, role: usuario.role },
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error en el inicio de sesión' });
  }
});

export default router;
