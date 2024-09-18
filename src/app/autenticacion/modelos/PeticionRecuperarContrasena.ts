export class PeticionRecuperarContrasena {
  usuario: string;
  correo: string

  public constructor(usuario: string, correo: string) {
    this.usuario = usuario
    this.correo = correo
}
}
