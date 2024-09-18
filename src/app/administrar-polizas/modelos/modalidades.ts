export interface ModalidadesModel{
    estado: boolean,
    id: number,
    nombre: string,
}

export interface CapacidadesModel{
    capacidades: ModalidadModel[]
}

export interface ModalidadModel{
    numero?: number,
    vigencia?: string,
    modalidadId?: number,
    nombre?: string,
    nombreOriginal?: string,
    ruta?: string
}