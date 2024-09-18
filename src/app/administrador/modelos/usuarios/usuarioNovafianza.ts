export interface usuarioNovafianza {
  id: string;
  usuario: string;
  identificacion: number;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  cargo: string;
  correo: string;
  telefono: string;
  estado: boolean;
  clave: string;
  claveTemporal: boolean;
  idRol: string;
}
