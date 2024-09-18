import { Aplicativos } from "src/app/aplicativos/modelos/aplicativos"
import { Rol } from "./Rol"

export interface IniciarSesionRespuesta {
  usuario: Usuario
  token: string
  claveTemporal: boolean
  rol: Rol
  aplicativos?: Aplicativos
}

export interface Usuario {
  id: string
  usuario: string
  nombre: string
  apellido:string
  telefono: string
  correo: string
  idEmpresa?: string
  logoEmpresa?: string
  abrirModal: boolean;
  departamentoId: number;
  municipioId: number;
  esDepartamental: number;
  nombreCiudad: string;
  nombreDepartamento: string;
  reportaOtroMunicipio: boolean;
}
