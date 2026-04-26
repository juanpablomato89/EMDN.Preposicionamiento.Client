export interface ProductoFilter {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  provinciaId?: number;
  municipioId?: number;
  organismoId?: number;
  orderBy?: string;
  ascending?: boolean;
}

export interface ProductoCreateUpdate {
  descripcion: string;
  unidadMedida?: string;
  organismoId?: number;
  fechaIngreso: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}
