export interface AlmacenFilter {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  provinciaId?: number;
  municipioId?: number;
  orderBy?: string;
  ascending?: boolean;
}

export interface AlmacenCreateUpdate {
  nombre?: string;
  municipioId: number;
}

export interface AsignarProducto {
  productoId: string;
  cantidad: number;
  fechaIngreso?: string;
}
