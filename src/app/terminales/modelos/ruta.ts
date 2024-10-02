export interface Ruta {
  id_ruta: string | number,
  departamento_origen: string,
  municipio_origen: string,
  departamento_destino: string,
  municipio_destino: string,
  tipo_llegada: string | null,
  direccion: string | null,
  via: string | undefined,
  ruta_activa: string | null,
  n_resolucion_bd: number | null,
  resolucion_corresponde: number | null,
  n_resolucion_actual: number | null,
  dir_territorial: string | null
  pdf: any
  direcciones?:Array<{ id: number, nombre: string }>
}
