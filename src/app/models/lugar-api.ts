export interface ComentarioApi {
  _id?: string;
  texto: string;
  fechaCreacion: string;
  autor?: { _id: string; email: string } | string;
}

export interface LugarApi {
  _id: string;
  nombre: string;
  imagen: string;
  comentarios: ComentarioApi[];
  createdAt?: string;
  updatedAt?: string;
}
