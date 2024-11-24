export interface Via {
  via?: any,
  corresponde?: string | number | null,
  viaNueva?: any,
  id?: number | null,
  paradas?: Paradas2[]
  paradaNueva: ParadaNueva
  pageParadas?: string | number
  itemsPerPageParadas?: string | number
  idPaginador?: string
}

export interface Paradas2 {
  parada_id?: number | null //Adicionada por si llega a necesitarse.
  ruta_id?: any
  numero?: string | number | null
  departamento?: number | string | null
  municipio?: number | string | null
  centro_poblado?: number | string | null
  codigo_cp?: number | string | null
  tipollegada_id?: number | string | null
  direccion_id?: number | string | null
  via_id?: number | null
  nodo_despacho_id?: number | string | null
  tiposLlegada?: Array<{ id: number, descripcion: string }>
  direcciones?: Array<{ id: number, descripcion: string }>
}

export interface ParadaNueva {
  habilitarParadaNueva?: boolean | null
  departamento_id?: number | string | null
  municipio_id?: number | string | null
  centro_poblado_id?: number | string | null
  tipollegada_id?: number | string | null
  direccion_id?: number | string | null
  direcciones?: Array<{ id: number, descripcion: string }>
  tiposLlegada?: Array<{ id: number, descripcion: string }>
  direccionesP?: Array<{ id: number, descripcion: string }>
  departamentos?: Array<{ codigoDepartamento: number, nombre: string }>
  municipios?: Array<{ codigoMunicipio: number, nombre: string }>
  centrosPoblados?: Array<{ codigoCentroPoblado: number, nombre: string }>
}
