export interface PeticionActualizarUsuarioEmpresa {
  identificacion: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  cargo: string;
  otroCargo: string;
  correo: string;
  telefono?: string;
  extension?: string;
  celular: string;
  idRol: string;
}
