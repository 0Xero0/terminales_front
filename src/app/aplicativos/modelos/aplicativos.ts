export interface Aplicativos {
  id:string | number
  titulo:string,
  descripcion:string,
  estado:string,
  ruta:string,
  documentacion: Array<Documentacion>
}

interface Documentacion {
  aplicativo_id:string | number
  descripcion:string
  link: string
  estado:boolean
}
