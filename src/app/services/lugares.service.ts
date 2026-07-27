import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LugarApi } from '../models/lugar-api';

@Injectable({
  providedIn: 'root',
})
export class LugaresService {
  private apiUrl = environment.apiUrl + '/lugares';

  constructor(private http: HttpClient) {}

  getLugares(): Observable<LugarApi[]> {
    return this.http.get<LugarApi[]>(this.apiUrl);
  }

  getLugar(id: string): Observable<LugarApi> {
    return this.http.get<LugarApi>(`${this.apiUrl}/${id}`);
  }

  agregarLugar(lugar: {
    nombre: string;
    imagen: string;
  }): Observable<LugarApi> {
    return this.http.post<LugarApi>(this.apiUrl, lugar);
  }

  eliminarLugar(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  modificarLugar(
    id: string,
    lugarModificado: { nombre: string; imagen: string },
  ): Observable<LugarApi> {
    return this.http.put<LugarApi>(`${this.apiUrl}/${id}`, lugarModificado);
  }

  agregarComentario(id: string, texto: string): Observable<LugarApi> {
    return this.http.post<LugarApi>(`${this.apiUrl}/${id}/comentarios`, {
      texto,
    });
  }

  modificarComentario(
    lugarId: string,
    comentarioId: string,
    texto: string,
  ): Observable<LugarApi> {
    return this.http.put<LugarApi>(
      `${this.apiUrl}/${lugarId}/comentarios/${comentarioId}`,
      { texto },
    );
  }

  eliminarComentario(
    lugarId: string,
    comentarioId: string,
  ): Observable<LugarApi> {
    return this.http.delete<LugarApi>(
      `${this.apiUrl}/${lugarId}/comentarios/${comentarioId}`,
    );
  }
}
