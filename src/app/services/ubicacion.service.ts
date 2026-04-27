import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Municipio, Provincia } from '../models/ubicacion.model';

@Injectable({ providedIn: 'root' })
export class UbicacionService {
  private readonly base = `${environment.apiUrl}/CubaGeo`;

  constructor(private http: HttpClient) {}

  provincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.base}/db/provincias`);
  }

  municipios(provinciaId?: number): Observable<Municipio[]> {
    let params = new HttpParams();
    if (provinciaId != null) params = params.set('provinciaId', String(provinciaId));
    return this.http.get<Municipio[]>(`${this.base}/db/municipios`, { params });
  }
}
