export interface Ruta {
  id_ruta: string | number,
  departamento_origen: string | null,
  municipio_origen: string | null,
  centro_poblado_origen: string | null,
  departamento_destino: string | null,
  municipio_destino: string | null,
  centro_poblado_destino: string | null,
  tipo_llegada: string | null,
  direccion: string | null,
  via: string | undefined,
  ruta_activa: string | null,
  n_resolucion_bd: number | null,
  resolucion_corresponde: string | number | null,
  n_resolucion_actual: number | null,
  dir_territorial: string | null
  nombreDocumento?:string,
  nombreOriginal?:string,
  ruta?:string,
  direcciones?:Array<{ id: number, descripcion: string }>
}

export interface RutaNueva {
  id_ruta: string | number,
  centro_poblado_origen: string | null,
  centro_poblado_destino: string | null,
  tipo_llegada: string | null,
  direccion: string | null,
  via: string | undefined,
  ruta_activa: string | null,
  n_resolucion_actual: number | null,
  dir_territorial: string | null
  nombreDocumento?:string,
  nombreOriginal?:string,
  ruta?:string,
}
