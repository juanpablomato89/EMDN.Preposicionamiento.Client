export interface Almacen {
  id: number;
  nombre: string;
  municipioId?: number;
  municipio?: string;
  provinciaId?: number;
  provincia?: string;
  lat: number;
  lng: number;
  totalProductos: number;
  stockTotal: number;
  creado: string;
  modificado: string;
}

export interface AlmacenStock {
  productoId: string;
  productoDescripcion: string;
  unidadMedida?: string;
  organismo?: string;
  organismoId?: number;
  cantidad: number;
  fechaIngreso: string;
}
