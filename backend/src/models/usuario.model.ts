import { Document, model, Schema } from 'mongoose';

export interface Usuario extends Document {
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

const usuarioSchema = new Schema<Usuario>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true },
);

export const UsuarioModel = model<Usuario>(
  'Usuario',
  usuarioSchema,
  'usuarios',
);
