export interface Comentario {
  _id?: string;
  texto: string;
  fechaCreacion: string;
}

export interface Lugar {
  _id: string;
  nombre: string;
  imagen: string;
  comentarios: Comentario[];
}
