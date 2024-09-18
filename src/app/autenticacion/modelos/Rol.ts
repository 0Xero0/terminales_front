export interface Rol {
  id: string | number;
  nombre: string;
  estado: boolean;
  creacion: string;
  actualizacion: string;
  modulos: Modulo[]
}

export interface Modulo{
  id: string;
  nombre: string;
  nombreMostrar: string,
  ruta: string;
  icono: string;
  estado: boolean;
  creacion: Date;
  actualizacion: Date;
  submodulos: Submodulo[]
}

export interface Submodulo{
  id: string;
  nombre: string;
  nombreMostrar: string,
  ruta: string;
  icono: string;
  estado: boolean;
  creacion: Date;
  actualizacion: Date;
}

