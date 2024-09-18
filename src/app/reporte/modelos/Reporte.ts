export interface Reporte {
  aplicativo: string;
  descripcion: string;
  documento: File | string | null;
  documento_respuesta: File | string | null;
  email: string;
  error_acceso: string | null;
  fecha_creacion: string;
  fecha_respuesta: string | null;
  id: number | string;
  id_estado: number | string;
  identificador_documento: string | null;
  identificador_documento_respuesta: string | null;
  motivo: number | string;
  nit: string;
  problema_acceso: boolean;
  radicado: string;
  razon_social: string;
  respuesta: string | null;
  ruta: string;
  telefono: string
  usuario_respuesta: string | null;
}
