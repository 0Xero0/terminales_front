export interface Soporte {
    id:                              number;
    radicado:                        string;
    nit:                             string;
    razonSocial:                     string;
    email:                           string;
    telefono:                        string | null;
    descripcion:                     string;
    documento:                       string;
    identificadorDocumento:          string | null;
    documentoRespuesta:              string | null;
    identificadorDocumentoRespuesta: string | null;
    ruta:                            string | null;
    usuarioRespuesta:                string | null;
    idEstado:                        number;
    fechaCreacion:                   string;
    fechaRespuesta:                  string;
    respuesta?: string;
}
