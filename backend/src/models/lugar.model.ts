import { Document, model, Schema } from 'mongoose';

interface Comentario {
  texto: string;
  fechaCreacion: Date;
  autor?: any;
}

export interface Lugar extends Document {
  nombre: string;
  imagen: string;
  comentarios: Comentario[];
  autor?: any;
}

const comentarioSchema = new Schema<Comentario>({
  texto: {
    type: String,
    required: true,
    trim: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false,
  },
});

const lugarSchema = new Schema<Lugar>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    imagen: {
      type: String,
      required: true,
      trim: true,
    },
    autor: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false,
    },
    comentarios: {
      type: [comentarioSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const LugarModel = model<Lugar>('Lugar', lugarSchema, 'lugares');
