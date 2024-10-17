export interface Paradas {
  parada_id?: number | null //Adicionada por si llega a necesitarse.
  numero: string | number | null
  codigo_departamento: number | string | null
  codigo_municipio: number | string | null
  codigo_cp: number | string | null
  tipo_llegada_id: number | string | null
  direccion_id: number | string | null
  municipios?:Array<{ id: number, codigoMunicipio: string, nombre:string }>
  centrosPoblados?:Array<{ id: number, codigoCentroPoblado: string, nombre:string }>
  direcciones?:Array<{ id: number, descripcion: string }>
}
