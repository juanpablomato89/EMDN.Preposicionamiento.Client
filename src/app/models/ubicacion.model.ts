export interface Provincia {
  id: number;
  descripcion: string;
  codigoProvincia?: string;
  lat: number;
  lng: number;
}

export interface Municipio {
  id: number;
  descripcion: string;
  codigoMunicipio?: string;
  provinciaId: number;
  lat: number;
  lng: number;
}
