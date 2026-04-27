export type EstadoAlmacen = 'ok' | 'warn' | 'err';

export interface AlmacenMapa {
  id: number;
  nombre: string;
  provincia: string;
  lat: number;
  lng: number;
  stockTotal: number;
  totalProductos: number;
  estado: EstadoAlmacen;
  ultimaSync: string;
  organismo: string;
}

export interface HomeKpis {
  totalAlmacenes: number;
  totalProductos: number;
  totalProvincias: number;
  totalProvinciasPosibles: number;
  alertasCriticas: number;
}

export interface HomeMapaResponse {
  kpis: HomeKpis;
  almacenes: AlmacenMapa[];
}
