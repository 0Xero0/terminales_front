export interface GuardarPoliza{
    polizaContractual:{
        numero: string
        aseguradoraId: string
        inicioVigencia: string
        finVigencia: string
        amparos:AmparosModel[]
        responsabilidad?: ResponsabilidadModel
        caratula?: CaratulaModel
        tieneResponsabilidad: boolean
    }
    polizaExtracontractual:{
        numero: string
        aseguradoraId: string
        inicioVigencia: string
        finVigencia: string
        amparos:AmparosModel[]
        responsabilidad?: ResponsabilidadModel
        caratula?: CaratulaModel
        tieneResponsabilidad: boolean
    }
}

export interface PolizaJsonModel {
    polizaContractual: PolizaContractualModel,
    polizaExtracontractual?: PolizaExtracontractualModel
}

export interface PolizaContractualModel{
    numero: string
    aseguradoraId: string
        inicioVigencia: string
        finVigencia: string
        amparos:AmparosModel[]
        responsabilidad?: ResponsabilidadModel
        caratula?: CaratulaModel
        tieneResponsabilidad: boolean
}

export interface PolizaExtracontractualModel{
    numero: string
        aseguradoraId: string
        inicioVigencia: string
        finVigencia: string
        amparos:AmparosModel[]
        responsabilidad?: ResponsabilidadModel
        caratula?: CaratulaModel
        tieneResponsabilidad: boolean
}

export interface AmparosModel{
    coberturaId: string
    valorAsegurado: string
    limite: string
    deducible: string
}

export interface ResponsabilidadModel{
    fechaConstitucion: string
    resolucion: string
    fechaResolucion: string
    valorReserva: string
    fechaReserva: string
    informacion: string
    operacion: string
    valorCumplimientoUno: string
    valorCumplimientoDos: string
}

export interface CaratulaModel{
    nombre?: string
    nombreOriginal?: string
    ruta?: string
}
