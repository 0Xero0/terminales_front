export interface Clases {
  clase_id?: string | number | null
  ruta_id?: any
  clase?: string | null
  id_ruta_vehiculos?: number | string | null
  tipo_vehiculo_id?: number | string | null
  tipo_vehiculo_id_temp?: number | string | null
  estado?: boolean | string | null
  tipoVehiculo?: Array<{descripcion: string | null, id: number | null, idClasePorGrupo: number | null}>
}

export interface Clase {
  grupoId?: string | number | null,
  tipoVehiculoId?: string | number | null
}
