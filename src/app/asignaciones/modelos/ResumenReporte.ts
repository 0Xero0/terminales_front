export interface ResumenReporte {
    solicitudId: number;
    nit: string;
    razonSocial: string;
    fechaRegistro?: string;
    modulo: string;
    estadoCargue: string;
    estadoValidacion: string;
    verificadorAsignado?: number | string | null;
    estadoAsignacion: boolean;
    fechaAsignacion?: string;
}
