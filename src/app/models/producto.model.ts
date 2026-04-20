export interface Producto {
    id: string;
    descripcion: string;
    unidadMedida?: string;
    organismoId?: number;
    organismo?: string;
    creado: Date;
    modificado: Date;
    fechaIngreso: Date;
}