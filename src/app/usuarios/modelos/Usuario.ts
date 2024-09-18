export interface Usuario {
    id:              string;
    nombre:          string;
    usuario:         string;
    clave:           string;
    estado:          boolean;
    apellido:        string;
    cargo:           null;
    identificacion:  string;
    claveTemporal:   boolean;
    correo:          string;
    fechaNacimiento: string;
    telefono:        null;
    idRol:           string;
    departamentoId: number;
    municipioId: number;
    aplicativos:[{id:number,titulo:string,estado?:boolean}]
}
