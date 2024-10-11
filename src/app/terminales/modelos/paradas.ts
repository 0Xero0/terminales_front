export interface Paradas {
  id_parada?: number | null //Adicionada por si llega a necesitarse.
  numero: string | number | null
  departamento: number | string | null
  municipio: number | string | null
  centroPoblado: number | string | null
  tipoLlegada: number | string | null
  direccion: number | string | null
}
