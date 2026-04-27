import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Almacen, AlmacenStock } from '../models/almacen.model';
import {
  AlmacenCreateUpdate,
  AlmacenFilter,
  AsignarProducto,
} from '../models/request/almacen-filter';
import { PagedResult } from '../models/request/producto-filter';

@Injectable({ providedIn: 'root' })
export class AlmacenService {
  private readonly base = `${environment.apiUrl}/Almacenes`;

  constructor(private http: HttpClient) {}

  list(filter: AlmacenFilter = {}): Observable<PagedResult<Almacen>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<PagedResult<Almacen>>(this.base, { params });
  }

  getById(id: number): Observable<Almacen> {
    return this.http.get<Almacen>(`${this.base}/${id}`);
  }

  create(data: AlmacenCreateUpdate): Observable<Almacen> {
    return this.http.post<Almacen>(this.base, data);
  }

  update(id: number, data: AlmacenCreateUpdate): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  productos(id: number): Observable<AlmacenStock[]> {
    return this.http.get<AlmacenStock[]>(`${this.base}/${id}/productos`);
  }

  asignarProducto(id: number, data: AsignarProducto): Observable<void> {
    return this.http.post<void>(`${this.base}/${id}/productos`, data);
  }

  removerProducto(id: number, productoId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}/productos/${productoId}`);
  }
}
