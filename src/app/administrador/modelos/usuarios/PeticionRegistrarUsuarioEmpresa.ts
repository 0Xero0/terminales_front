export interface PeticionRegistrarUsuarioEmpresa {
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
  idEmpresa: string;
  idRol: string;
}
