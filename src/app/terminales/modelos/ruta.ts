export interface Ruta {
  id_ruta: string | number,
  departamento_origen: string | null,
  municipio_origen: string | null,
  cp_origen: string | null,
  departamento_destino: string | null,
  municipio_destino: string | null,
  cp_destino: string | null,
  tipo_llegada_id: string | number | null,
  direccion_id: number | string | null,
  via: string | undefined,
  ruta_activa: string | null,
  resolucion: number | null,
  corresponde: string | number | null,
  resolucion_actual: number | null,
  direccion_territorial: string | null
  documento?:string,
  nombre_original?:string,
  ruta_archivo?:string,
  direcciones?:Array<{ id: number, descripcion: string }>
  estado?:boolean
}

export interface RutaNueva {
  id_ruta: string | number,
  centro_poblado_origen: string | null,
  centro_poblado_destino: string | null,
  tipo_llegada: string | number | null,
  direccion: string | null,
  via: string | undefined,
  ruta_activa: string | null,
  n_resolucion_actual: number | null,
  dir_territorial: string | null
  nombreDocumento?:string,
  nombreOriginal?:string,
  ruta?:string,
}
