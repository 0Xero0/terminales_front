export interface Formulario {
  codigo:string,
  id:number,
  nombre:string,
  nombreDocumento:string,
  nombreOriginal:string,
  ruta:string,
  observacion?:string,
  corresponde?:number | null
}
