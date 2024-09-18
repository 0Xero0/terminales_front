export interface OpcionesPopup{
    texto?: string
    titulo?: string
    icono: IconoPopup
    alCerrar?: ()=> void
}

export type IconoPopup = 'advertencia' | 'exitoso' | 'error'