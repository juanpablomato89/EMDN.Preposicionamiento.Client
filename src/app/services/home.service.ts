import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HomeMapaResponse } from '../models/almacen-mapa.model';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly base = `${environment.apiUrl}/home`;

  constructor(private http: HttpClient) {}

  getMapa(): Observable<HomeMapaResponse> {
    return this.http.get<HomeMapaResponse>(`${this.base}/mapa`);
  }
}
