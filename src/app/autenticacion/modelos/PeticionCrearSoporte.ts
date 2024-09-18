export interface PeticionCrearSoporte{
    nit: string
    telefono?: string
    correo: string
    descripcion: string
    adjunto?: File
    razonSocial: string
    errorAcceso: string
}