export class PeticionActualizarEmpresa {
  public nombre?: string
  public nit?: number
  public convenio?: string
  public estado?: boolean
  public logo?: File

  public constructor(nombre?: string, nit?: number, convenio?: string, logo?: File, estado?: boolean) {
    this.nombre = nombre
    this.nit = nit
    this.convenio = convenio
    this.estado = estado
    this.logo = logo
  }
}

