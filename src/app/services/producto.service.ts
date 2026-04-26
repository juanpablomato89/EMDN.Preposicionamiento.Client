import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Producto } from '../models/producto.model';
import { Organismo } from '../models/organismo.model';
import {
  PagedResult,
  ProductoCreateUpdate,
  ProductoFilter,
} from '../models/request/producto-filter';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly base = `${environment.apiUrl}/Productos`;

  constructor(private http: HttpClient) {}

  list(filter: ProductoFilter = {}): Observable<PagedResult<Producto>> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<PagedResult<Producto>>(this.base, { params });
  }

  getById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  create(data: ProductoCreateUpdate): Observable<Producto> {
    return this.http.post<Producto>(this.base, data);
  }

  update(id: string, data: ProductoCreateUpdate): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  organismos(): Observable<Organismo[]> {
    return this.http.get<Organismo[]>(`${this.base}/organismos`);
  }
}
