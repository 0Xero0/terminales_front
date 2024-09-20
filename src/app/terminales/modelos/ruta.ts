export interface Ruta {
  id_ruta: string | number,
  departamento_origen: string,
  municipio_origen: string,
  departamento_destino: string,
  municipio_destino: string,
  tipo_llegada: number | null,
  direccion: number | null,
  via: string | undefined,
  ruta_activa: number | null,
  n_resolucion_bd: number | null,
  resolucion_corresponde: number | null,
  n_resolucion_actual: number | null,
  pdf: any
}
