// services/nominatim.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class NominatimService {

  constructor(private http: HttpClient) { }

  reverseGeocode(lat: number, lon: number): Observable<any> {
    const url = `${environment.nominatimUrl}?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    return this.http.get<any>(url);
  }
}