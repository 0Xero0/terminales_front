export class PeticionActualizarContrasena {
  identificacion: string;
  clave: string;
  nuevaClave: string;

  public constructor(identificacion: string, clave: string, nuevaClave: string) {
    this.identificacion = identificacion
    this.clave = clave
    this.nuevaClave = nuevaClave
}
}
