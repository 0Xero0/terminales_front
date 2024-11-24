export interface Ruta {
  id?: any,
  id_ruta?: string | number,
  id_unico_ruta?: string | number,
  departamento_origen: string | null,
  departamento_origen_codigo?: string | null
  municipio_origen: string | null,
  municipio_origen_codigo?: string | null,
  cp_origen_codigo?: string | null
  cp_origen: string | null,
  departamento_destino: string | null,
  departamento_destino_codigo?: string | null,
  municipio_destino: string | null,
  municipio_destino_codigo?: string | null,
  cp_destino_codigo?: string | null,
  cp_destino: string | null,
  tipo_llegada_id?: string | number | null,
  tipo_llegada?: string | null,
  direccion_id: number | string | null,
  direccion?: string | null,
  via: string | undefined,
  viaNueva?: string | undefined,
  ruta_activa?: string | null,
  resolucion: number | null,
  corresponde: string | number | null,
  resolucion_actual: number | null,
  direccion_territorial?: string | null
  documento?: string,
  nombre_original?: string,
  ruta_archivo?: string,
  municipiosOrigen?: Array<{ id: number, codigoMunicipio: string, nombre: string }>
  municipiosDestino?: Array<{ id: number, codigoMunicipio: string, nombre: string }>
  cpOrigen?: Array<{ id: number, codigoCentroPoblado: string, nombre: string }>
  cpDestino?: Array<{ id: number, codigoCentroPoblado: string, nombre: string }>
  direcciones?: Array<{ id: number, descripcion: string }>
  estado: boolean | null
  errorRutas?: boolean | null
  ida_o_vuelta?: string | null
}

export interface RutaNueva {
  centro_poblado_origen: string | null,
  centro_poblado_destino: string | null,
  tipo_llegada: number | null,
  direccion: string | number | null,
  via: string | undefined,
  ruta_activa: any,
  n_resolucion_actual: string | number | null,
  dir_territorial: string | null
  nombreDocumento?: string,
  nombreOriginal?: string,
  ruta?: string,
}

export interface RutaFiltrada {
  id?: any,
  id_ruta?: string | number,
  id_unico_ruta?: string | number,
  departamento_origen: string | null,
  municipio_origen: string | null,
  cp_origen_codigo?: string | null
  cp_origen: string | null,
  departamento_destino: string | null,
  municipio_destino: string | null,
  cp_destino: string | null,
  errorRutas?: boolean | null
}

export interface Ruta2 {
  index?: number | null
  CoddepartamentoDestino?: string | null,
  CoddepartamentoOrigen?: string | null,
  CodmunicipioDestino?: string | null,
  CodmunicipioOrigen?: string | null,
  codCpDestino?: string | null,
  codCpOrigen?: string | null,
  departamentoDestino?: string | null,
  departamentoOrigen?: string | null,
  descripcionDestino?: string | null,
  descripcionOrigen?: string | null,
  idRuta?: number | null,
  idCodigoRuta?: number | null,
  idCodigoUnicoRuta?: number | null,
  municipioDestino?: string | null,
  municipioOrigen?: string | null,
  errorRutas?: boolean | null
  numeroVias?: number | null
  revisada?: boolean | null
}

export interface RutaInfo {
  corresponde?: number | string | null,
  resolucion?: number | string | null,
  resolucionActual?: number | string | null,
  rutaActiva?: string | boolean | null,
  via?: string | null,
  nombreOriginal?: string | null,
  rutaDocumento?: string | null,
  Iddireccion?: number | string | null,
  documento?: string | null,
  idTipoLlegada?: number | string | null,
}

export interface RutaNueva2 {
  idRuta?: number | null,
  idCodigoRuta?: number | null,
  idCodigoUnicoRuta?: number | null,
  CoddepartamentoDestino?: string | null,
  CoddepartamentoOrigen?: string | null,
  CodmunicipioDestino?: string | null,
  CodmunicipioOrigen?: string | null,
  codCpDestino?: string | null,
  codCpOrigen?: string | null,
  rutaActiva?: string | boolean | null,
  idTipoLlegada?: number | string | null,
  Iddireccion?: number | string | null,
  corresponde?: number | string | null,
  resolucion?: number | string | null,
  resolucionActual?: number | string | null,
  nombreOriginal?: string | null,
  rutaDocumento?: string | null,
  documento?: string | null,
}

export interface Faltantes {
  clasesFaltantes?: boolean
  idRuta?: number
  rutasFaltantes: boolean
  viasFaltantes: boolean
}
