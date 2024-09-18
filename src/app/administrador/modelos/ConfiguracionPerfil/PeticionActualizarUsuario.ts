export class PeticionActualizarUsuario {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  correo?: string

  public constructor(nombre?:string, apellido?: string, telefono?:string, correo?:string){
    this.nombre = nombre
    this.apellido = apellido
    this.telefono = telefono
    this.correo = correo
}
}
