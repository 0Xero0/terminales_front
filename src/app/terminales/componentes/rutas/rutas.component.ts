import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ruta, RutaNueva } from '../../modelos/ruta';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { TerminalesService } from '../../servicios/terminales.service';
import { Paradas } from '../../modelos/paradas';
import { Clases } from '../../modelos/clases';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.css']
})
export class RutasComponent implements OnInit {
  @Output() hayCambios: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() rutasGuardar: EventEmitter<Array<Ruta>> = new EventEmitter<Array<Ruta>>();
  @Output() paradasGuardar: EventEmitter<Array<Paradas>> = new EventEmitter<Array<Paradas>>();
  @Output() clasesGuardar: EventEmitter<Array<Clases>> = new EventEmitter<Array<Clases>>();
  @Input() verificacionVisible?: boolean
  @Input() verificacionEditable?: boolean
  @Input() editable?: boolean
  @Input() aprobado?: boolean
  usuario?: { usuario: string, nombre: string };
  rol?: { id: number, nombre: string }

  paradas: Paradas[] = []
  clases: Clases[] = []

  resolucionCorresponde: boolean = false

  rutas: Ruta[] = [];
  rutaSeleccionada: number | null = null;  // Índice de la ruta seleccionada
  rutaConsultada: boolean = false
  rutaNueva: RutaNueva
  rutaNuevaHabilitada: boolean = false

  departamentos?: { codigoDepartamento: any, nombre: string }[] = []
  municipiosOrigen?: { codigoMunicipio: any, nombre: string }[] = []
  centroPobladoOrigen?: { codigoCP: any, nombre: string }[] = []
  municipiosDestino?: { codigoMunicipio: any, nombre: string }[] = []
  centroPobladoDestino?: { codigoCP: any, nombre: string }[] = []
  tipoLlegada: Array<{ id: any, descripcion: string }> = []
  direcciones: Array<{ id: any, descripcion: string }> = []

  error:boolean = false
  errorRutas:boolean = false

  constructor(private servicioArchivos: ServicioArchivos, private servicioTerminales: TerminalesService) {
    this.rutaNueva = this.inicializarRutaNueva()
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('UsuarioVigia')!)
    this.rol = JSON.parse(localStorage.getItem('rolVigia')!);
    //this.listarRutas();  Inicializamos con un registro vacío
    this.maestraDepartamentos()
    this.maestraTipoLlegadas();
  }

  inicializarRutaNueva(): RutaNueva { //Inicializa vacio los parametros de la ruta nueva
    return {
      id_ruta: '',
      centro_poblado_origen: null,
      centro_poblado_destino: null,
      tipo_llegada: null,
      direccion: null,
      via: '',
      ruta_activa: null,
      n_resolucion_actual: null,
      dir_territorial: null,
    };
  }

  listarRutas() { //listamos las rutas que vienen de base de datos
    const nuevoRuta: Ruta = {
      id_ruta: '001',
      departamento_origen: 'Cundinamarca',
      municipio_origen: 'Bogotá',
      centro_poblado_origen: '',
      departamento_destino: 'Antioquia',
      municipio_destino: 'Medellín',
      centro_poblado_destino: '',
      tipo_llegada: null,
      direccion: null,
      via: 'Cartago',
      ruta_activa: 'null',
      n_resolucion_bd: 156,
      resolucion_corresponde: null,
      n_resolucion_actual: null,
      dir_territorial: 'Casa',
    };
    this.rutas.push(nuevoRuta);
  }
  consultarInformacionRuta(id_ruta: string | number) { //Consultamos paradas y clases de la ruta seleccionada
    this.rutaConsultada = true
  }

  //MAESTRAS /////////////////////////////////////////////////////////////////////////////////////////////////
  maestraDepartamentos() { // MAESTRA DE DEPARTAMENTOS
    this.servicioTerminales.maestraDepartamentos().subscribe({
      next: (respuesta: any) => {
        //console.log(respuesta)
        this.departamentos = respuesta.respuestaDepartamentos
      }
    })
  }

  maestraMunicipios(event: any, nombre: string, tipo: number) { // MAESTRA DE MUNICIPIOS
    const input = event.target as HTMLSelectElement
    const id_departamento = input.value
    const selectElement = document.getElementById(nombre) as HTMLSelectElement;
    //console.log(id_departamento)
    if (id_departamento !== 'null') {
      this.servicioTerminales.maestraMunicipios(id_departamento).subscribe({
        next: (municipios: any) => {
          //console.log(municipios)
          selectElement.disabled = false
          if (tipo === 1) { this.municipiosOrigen = municipios.respuestaMunicipios }
          if (tipo === 2) { this.municipiosDestino = municipios.respuestaMunicipios }
        }
      })
    } else {
      selectElement.disabled = true;
      if (tipo === 1) {
        this.municipiosOrigen = []
        this.maestraCP('null', 'cp origen', tipo)
      }
      if (tipo === 2) {
        this.municipiosDestino = []
        this.maestraCP('null', 'cp destino', tipo)
      }
    }
  }

  maestraCP(event: any, nombre: string, tipo: number) { // MAESTRA DE CENTROS POBLADOS
    let codigoMunicipio
    if (event === 'null') {
      codigoMunicipio = event
    } else {
      const input = event.target as HTMLSelectElement
      codigoMunicipio = input.value
    }
    const selectElement = document.getElementById(nombre) as HTMLSelectElement;
    //console.log(codigoMunicipio)
    if (codigoMunicipio !== 'null') {
      this.servicioTerminales.maestraCentrosPoblados(codigoMunicipio).subscribe({
        next: (respuesta: any) => {
          //console.log(respuesta)
          selectElement.disabled = false
          if (tipo === 1) { this.centroPobladoOrigen = respuesta.respuestaCentrosPoblados }
          if (tipo === 2) { this.centroPobladoDestino = respuesta.respuestaCentrosPoblados }
        }
      })
    } else {
      selectElement.disabled = true;
      if (tipo === 1) { this.centroPobladoOrigen = [], this.rutaNueva.centro_poblado_origen = null }
      if (tipo === 2) { this.centroPobladoDestino = [], this.rutaNueva.centro_poblado_destino = null }
    }
  }

  maestraTipoLlegadas() { // MAESTRA DE TIPOS DE LLEGADAS
    this.servicioTerminales.maestraTiposLlegadas().subscribe({
      next: (respuesta: any) => {
        //console.log(respuesta)
        this.tipoLlegada = respuesta.respuestaTipoLLegada
      }
    })
  }

  maestraDireccion(id: any, index?: any, tipo?: number) { // MAESTRA DE DIRECCIONES
    console.log(id, index)
    const idLlegada = id
    if (id !== 'null') {
      this.servicioTerminales.maestraDirecciones(id).subscribe({
        next: (respuesta: any) => {
          console.log(respuesta)
          if (tipo === 1) {
            this.rutas[index].direcciones = []
            this.rutas[index].direcciones = respuesta.respuestaDirecciones
            this.rutas[index].tipo_llegada = idLlegada
            this.manejarCambios()
          } else if (tipo === 2) {
            this.direcciones = []; this.rutaNueva.direccion = null
            this.direcciones = respuesta.respuestaDirecciones
            this.rutaNueva.tipo_llegada = idLlegada
          }
        }
      })
    } else {
      if (tipo === 1) {
        this.rutas[index].tipo_llegada = null;
        this.rutas[index].direccion = null
        this.rutas[index].direcciones = []
        this.manejarCambios()
      }
      if (tipo === 2) {
        this.rutaNueva.tipo_llegada = null;
        this.rutaNueva.direccion = null;
        this.direcciones = []
      }
    }
    //console.log(this.rutas, this.rutaNueva)

  }

  // ACCIONES ///////////////////////////////////////////////////////////////////////////////////////////////////
  seleccionarRuta(ruta: Ruta, index: number) {
    // Verificamos si es el mismo registro que ya está seleccionado
    if (this.rutaSeleccionada === index) return;

    // Marcar el registro actual como seleccionado
    this.rutaSeleccionada = index;

    // Consultar la información en la base de datos
    this.consultarInformacionRuta(ruta.id_ruta);
  }

  estadoAgregarRuta(estado: boolean) {
    this.rutaNuevaHabilitada = estado
    this.rutaNueva = this.inicializarRutaNueva()
  }

  agregarRuta() {
    console.log(this.rutaNueva);
    if(this.validarCampos(this.rutaNueva)){
      this.rutas.push({
        id_ruta: this.rutaNueva.id_ruta,
        departamento_origen: null,
        municipio_origen: null,
        centro_poblado_origen: this.rutaNueva.centro_poblado_origen,
        departamento_destino: null,
        municipio_destino: null,
        centro_poblado_destino: this.rutaNueva.centro_poblado_destino,
        tipo_llegada: this.rutaNueva.tipo_llegada,
        direccion: this.rutaNueva.direccion,
        via: this.rutaNueva.via,
        ruta_activa: this.rutaNueva.ruta_activa,
        n_resolucion_bd: null,
        resolucion_corresponde: null,
        n_resolucion_actual: this.rutaNueva.n_resolucion_actual,
        dir_territorial: this.rutaNueva.dir_territorial,
        nombreDocumento: this.rutaNueva.nombreDocumento,
        nombreOriginal: this.rutaNueva.nombreOriginal,
        ruta: this.rutaNueva.ruta
      });
      this.rutaNueva = this.inicializarRutaNueva()
      this.estadoAgregarRuta(false)
      this.manejarCambios()
    }else{
      this.error = true
      Swal.fire({
        title:'Información incompleta',
        icon: 'error',
        text: 'Por favor, completa la información de la nueva ruta antes de agregarla.'
      })
    }
  }

  corresponde(idCorresponde: any, index: any, idRuta: any) {
    const selectElement = document.getElementById(idRuta) as HTMLSelectElement;
    selectElement.disabled = false
    console.log(this.editable)
    if (idCorresponde === 'null') {
      this.rutas[index].resolucion_corresponde = null
    } else {
      this.rutas[index].resolucion_corresponde = Number(idCorresponde)
    }
    console.log(this.rutas[index].resolucion_corresponde)
    this.manejarCambios()
  }

  recibirParadas(paradas: any) {
    this.paradas = paradas
    this.manejarCambios()
  }

  // MANEJO DE ARCHIVOS //////////////////////////////////////////////////////////////////////////////////
  manejarRemoverArchivo(input: HTMLInputElement, event: any, tipo: number, index?: any) {
    input.value = ''
    event.preventDefault();
    this.removeFile(tipo, index)
    this.manejarCambios()
  }
  removeFile(tipo?: number, index?: any) {
    if (tipo === 1) {
      this.rutas[index].nombreDocumento = ''
      this.rutas[index].nombreOriginal = ''
      this.rutas[index].ruta = ''
    } else if (tipo === 2) {
      this.rutaNueva.nombreDocumento = ''
      this.rutaNueva.nombreOriginal = ''
      this.rutaNueva.ruta = ''
    }
  }

  guardarArchivo(event: any, index: any, tipo: number, tamanoMaximoMb: number) {
    if (event) {
      Swal.fire({
        icon: 'info',
        allowOutsideClick: false,
        text: 'Espere por favor...',
      });
      Swal.showLoading(null);
      //console.log(this.tamanoValido(event.target.files[0]))
      if (this.tamanoValido(event.target.files[0], tamanoMaximoMb)) {
        this.servicioArchivos.guardarArchivo(event.target.files[0], 'proveedores', this.usuario?.usuario!).subscribe({
          next: (archivo: any) => {
            Swal.close()
            if (tipo === 1) {
              this.rutas[index].nombreDocumento = archivo.nombreAlmacenado
              this.rutas[index].nombreOriginal = archivo.nombreOriginalArchivo
              this.rutas[index].ruta = archivo.ruta
            } else if (tipo === 2) {
              this.rutaNueva.nombreDocumento = archivo.nombreAlmacenado
              this.rutaNueva.nombreOriginal = archivo.nombreOriginalArchivo
              this.rutaNueva.ruta = archivo.ruta
            }
          }
        })
      } else {
        Swal.fire({ icon: 'error', titleText: '¡Error alcargar el archivo!', text: 'El tamaño máximo del archivo debe ser de hasta 5Mb.' });
      }
    }
    this.manejarCambios()
  }

  descargarArchivo(nombreOriginal: string, nombre: string, ruta: string) { // PENDIENTE POR PONER A FUNCIONAR
    //console.log(nombre, ruta)
    this.servicioArchivos.descargarArchivo(nombre, ruta, nombreOriginal)
  }

  // VALIDACIONES Y CAMBIOS ////////////////////////////////////////////////////////////////////////////////////////////////////////
  private tamanoValido(archivo: File, tamanoMaximoMb: number): boolean {
    if (tamanoMaximoMb) {
      return tamanoMaximoMb * 1048576 >= archivo.size ? true : false
    } else {
      return true
    }
  }

  validarCampos(obj: any): boolean {
    // Verificamos que todos los valores del objeto sean distintos de null, undefined y no estén vacíos
    return Object.values(obj).every(value => value !== null && value !== undefined && value !== '');
  }

  validarCampo(selectId:string): boolean{
    const selectElement = document.getElementById(selectId) as HTMLSelectElement;
    const valor = selectElement.value
    if(valor === null || valor === 'null' || valor === undefined || valor === ''){
      return true
    }else {
      return false
    }
  }

  manejarCambios() {
    this.hayCambios.emit(true)
    this.rutasGuardar.emit(this.rutas)
    this.paradasGuardar.emit(this.paradas)
    this.clasesGuardar.emit(this.clases)
  }

}
