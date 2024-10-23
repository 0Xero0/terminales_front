import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ruta, RutaNueva } from '../../modelos/ruta';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { TerminalesService } from '../../servicios/terminales.service';
import { Paradas } from '../../modelos/paradas';
import { Clases } from '../../modelos/clases';
import Swal from 'sweetalert2';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';

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
  rutaId: any
  rutaSeleccionada: number | null = null;  // Índice de la ruta seleccionada
  rutaConsultada: boolean = false
  rutaNueva: RutaNueva
  rutaNuevaHabilitada: boolean = false

  departamentos?: { codigoDepartamento: any, nombre: string }[] = []
  municipiosOrigen?: { codigoMunicipio: any, nombre: string }[] = []
  centroPobladoOrigen?: { codigoCentroPoblado: any, nombre: string }[] = []
  municipiosDestino?: { codigoMunicipio: any, nombre: string }[] = []
  centroPobladoDestino?: { codigoCentroPoblado: any, nombre: string }[] = []
  tipoLlegada: Array<{ id: any, descripcion: string }> = []
  direcciones: Array<{ id: any, descripcion: string }> = []

  error: boolean = false
  errorRutas: boolean = false

  page: number = 1; // Variable para controlar la página actual
  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5;

  constructor(private servicioArchivos: ServicioArchivos, private servicioTerminales: TerminalesService) {
    this.rutaNueva = this.inicializarRutaNueva()
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('UsuarioVigia')!)
    this.rol = JSON.parse(localStorage.getItem('rolVigia')!);
    this.listarRutas()
    this.maestraDepartamentos()
    this.maestraTipoLlegadas();
  }

  inicializarRutaNueva(): RutaNueva { //Inicializa vacio los parametros de la ruta nueva
    return {
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

  listarRutas(){
    this.servicioTerminales.listarRutas().subscribe({
      next: (respuesta) => {
        this.rutas = respuesta.rutas
        if (this.rutas) {
          for (let i = 0; i < this.rutas.length; i++) {//RECORREMOS LAS RUTAS
            if (this.rutas[i].tipo_llegada_id) {//COMPROBAMOS QUE EXISTA UN TIPO DE LLEGADA Y SI EXISTE
              this.maestraDireccion(this.rutas[i].tipo_llegada_id,this.rutas[i].cp_destino_codigo, i)//CONSULTAMOS LA DIRECCIÓN CORRESPONDIENTE
            }
          }
        }
      }
    })
  }

  consultarInformacionRuta(id_ruta: number) { //Consultamos paradas y clases de la ruta seleccionada
    console.log(id_ruta)
    this.rutaId = id_ruta
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

  maestraCP(event: any, nombre: string, tipo: number,cambio?:boolean) { // MAESTRA DE CENTROS POBLADOS
    let codigoMunicipio
    if (event === 'null' || event === null) {
      codigoMunicipio = 'null'
    } else {
      const input = event.target as HTMLSelectElement
      codigoMunicipio = input.value
    }
    const selectElement = document.getElementById(nombre) as HTMLSelectElement;
    console.log(codigoMunicipio)
    if (codigoMunicipio !== 'null') {
      this.servicioTerminales.maestraCentrosPoblados(codigoMunicipio).subscribe({
        next: (respuesta: any) => {
          //console.log(respuesta)
          selectElement.disabled = false
          if (tipo === 1) { this.centroPobladoOrigen = respuesta.respuestaCentrosPoblados }
          if (tipo === 2) {
            this.centroPobladoDestino = respuesta.respuestaCentrosPoblados
            if(cambio){
              this.rutaNueva.centro_poblado_destino = null
              this.rutaNueva.tipo_llegada = null
              this.rutaNueva.direccion = null
            }
          }
        }
      })
    } else {
      selectElement.disabled = true;
      if (tipo === 1) { this.centroPobladoOrigen = [], this.rutaNueva.centro_poblado_origen = null }
      if (tipo === 2) {
        this.centroPobladoDestino = [],
        this.rutaNueva.centro_poblado_destino = null
        this.rutaNueva.tipo_llegada = null
        if(this.rutaNueva.centro_poblado_destino === null || this.rutaNueva.centro_poblado_destino === 'null'){

          //console.log(this.rutaNueva)
          //this.rutaNueva.direccion = null
        }
      }
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

  maestraDireccion(tipo_llegada_id: any, cp_destino_codigo: any, index?: any, cambio?: boolean) { // MAESTRA DE DIRECCIONES
    console.log(index, tipo_llegada_id)
    const idLlegada = tipo_llegada_id
    if (idLlegada !== 'null') {
      this.servicioTerminales.maestraDirecciones(tipo_llegada_id, cp_destino_codigo).subscribe({
        next: (respuesta: any) => {
          //console.log(respuesta)
          if (index !== undefined) {
            //console.log(respuesta)
            this.rutas[index].direcciones = [];
            if(respuesta.respuestaDirecciones.length > 0){
              this.rutas[index].direcciones = respuesta.respuestaDirecciones
            }else{this.rutas[index].direccion_id = null}
            this.rutas[index].tipo_llegada_id = idLlegada
            if (cambio) { this.rutas[index].direccion_id = null }
            this.manejarCambios()
          } else {
            this.direcciones = []; this.rutaNueva.direccion = null
            this.direcciones = respuesta.respuestaDirecciones
            this.rutaNueva.tipo_llegada = idLlegada
          }
        }
      })
    } else {
      if (index !== undefined) {
        this.rutas[index].tipo_llegada_id = null;
        this.rutas[index].direccion_id = null
        this.rutas[index].direcciones = []
        this.manejarCambios()
      } else {
        this.rutaNueva.direccion = null;
        this.rutaNueva.tipo_llegada = null;
        this.direcciones = []
        console.log( this.rutaNueva.direccion, this.rutaNueva.tipo_llegada)
      }
    }


  }

  // ACCIONES ///////////////////////////////////////////////////////////////////////////////////////////////////
  seleccionarRuta(ruta: Ruta, index: number) {
    // Verificamos si es el mismo registro que ya está seleccionado
    if (this.rutaSeleccionada === index) return;

    // Marcar el registro actual como seleccionado
    this.rutaSeleccionada = index;

    // Consultar la información en la base de datos
    this.consultarInformacionRuta(Number(ruta.id_ruta));
  }

  estadoAgregarRuta(estado: boolean) {
    this.rutaNuevaHabilitada = estado
    this.rutaNueva = this.inicializarRutaNueva()
  }

  agregarRuta() {
    console.log(this.rutaNueva);
    if (this.validarCampos(this.rutaNueva)) {
      const JSONRutaNueva = {
        centroPobladoOrigen: this.rutaNueva.centro_poblado_origen,
        centroPobladoDestino: this.rutaNueva.centro_poblado_destino,
        tipoLLegada: this.rutaNueva.tipo_llegada,
        direccion: this.rutaNueva.direccion,
        via: this.rutaNueva.via,
        rutaHabilitada: this.rutaNueva.ruta_activa,
        corresponde:1,
        resolucion:this.rutaNueva.n_resolucion_actual,
        resolucionActual: this.rutaNueva.n_resolucion_actual,
        direccionTerritorial: this.rutaNueva.dir_territorial,
        documento: this.rutaNueva.nombreDocumento,
        nombreOriginal: this.rutaNueva.nombreOriginal,
        rutaArchivo: this.rutaNueva.ruta
    }
      this.servicioTerminales.crearRuta(JSONRutaNueva).subscribe({
        next: (respuesta: any) => {
          console.log('JSONRutaNueva: ',JSONRutaNueva)
          console.log('respuesta: ', respuesta)
        }
      })
      /* this.rutas.push(); */
      this.rutaNueva = this.inicializarRutaNueva()
      this.estadoAgregarRuta(false)
      this.manejarCambios()
    } else {
      this.error = true
      Swal.fire({
        title: 'Información incompleta',
        icon: 'error',
        text: 'Por favor, completa la información de la nueva ruta antes de agregarla.'
      })
    }
  }

  manejarDirecciones(event: any, tipo_llegada_id: any, cp_destino: any, index?: number) {
    console.log(tipo_llegada_id, cp_destino, event.target.value)
    const valorSeleccionado = event.target.value;
    if (valorSeleccionado === 'abrirModal') {
      this.abrirModalConSwal(Number(tipo_llegada_id), cp_destino, index); // Si selecciona la opción de 'Añadir nueva dirección'
    } else {
      if (index) {
        this.rutas[index].direccion_id = Number(valorSeleccionado)
        this.manejarCambios()
      } else { }
      this.rutaNueva.direccion = Number(valorSeleccionado)
    }
  }
  abrirModalConSwal(tipo_llegada_id: number, cp_destino: string, index?: number) {
    // Modal con SweetAlert2 que tiene 2 inputs de texto
    Swal.fire({
      title: 'Añadir nueva dirección',
      html:
        `<input type="text" id="descripcion" class="swal2-input" placeholder="Descripción o nombre">
         <input type="text" id="direccion" class="swal2-input" placeholder="Dirección">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const descripcion = (Swal.getPopup()?.querySelector('#descripcion') as HTMLInputElement).value;
        const direccion = (Swal.getPopup()?.querySelector('#direccion') as HTMLInputElement).value;

        if (!descripcion) {
          Swal.showValidationMessage('Por favor, completa la descripción o nombre de la nueva dirección.');
          return null;
        }

        return { descripcion, direccion };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        let JSONDatosDireccion = {
          despachoId: tipo_llegada_id,
          descripcion: result.value.descripcion,
          direccion: result.value.direccion,
          codigoCentroPoblado: cp_destino
        }
        console.log(JSONDatosDireccion)
        this.servicioTerminales.crearDireccion(JSONDatosDireccion).subscribe({
          next: (respuesta: any) => {
            console.log(respuesta)
            if (index !== undefined) {
              this.rutas[index].direcciones = respuesta.respuestaDirecciones
              this.rutas[index].direccion_id = null
            } else {
              this.direcciones = respuesta.respuestaDirecciones
              this.rutaNueva.direccion = null
            }
            Swal.fire('¡Guardado!', 'La nueva dirección ha sido añadida.', 'success');
          }
        })
      } else if (result.isDismissed) {// Aquí manejas la acción de cancelación
        if (index !== undefined) {
          this.rutas[index].direccion_id = null
        } else {
          this.rutaNueva.direccion = null
        }

      }
    });
  }

  estadoRuta(estado: any, index?: number) {
    if (index !== undefined) {
      if (estado === 'false') {
        this.rutas[index].estado = false
        this.rutas[index].corresponde = null
        this.rutas[index].resolucion_actual = null
        this.removeFile(1, index)
      } else if (estado === 'true') {
        this.rutas[index].estado = true
      }
      this.manejarCambios()
    }else{
      if (estado === 'false') {
        this.rutaNueva.ruta_activa = false
      } else if (estado === 'true') {
        this.rutaNueva.ruta_activa = true
      }
      //console.log(this.rutaNueva.ruta_activa)
    }
  }

  corresponde(idCorresponde: any, index: any, idRuta: any) {
    if (idCorresponde === 'null') {
      this.rutas[index].corresponde = null
      this.rutas[index].resolucion_actual = null
      this.removeFile(1, index)
    } else {
      this.rutas[index].corresponde = Number(idCorresponde)
    }
    this.manejarCambios()
  }

  recibirParadas(paradas: any) {
    this.paradas = paradas
    this.manejarCambios()
  }

  manejarTipoLlegadaNueva(){
    if(this.rutaNueva.centro_poblado_destino === null || this.rutaNueva.centro_poblado_destino === 'null'){
      //this.rutaNueva.centro_poblado_destino = null
      this.rutaNueva.tipo_llegada = null
      this.rutaNueva.direccion = null
    }
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
      this.rutas[index].documento = ''
      this.rutas[index].nombre_original = ''
      this.rutas[index].ruta_archivo = ''
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
        console.log(index, this.rutas)
        this.servicioArchivos.guardarArchivo(event.target.files[0], 'proveedores', this.usuario?.usuario!).subscribe({
          next: (archivo: any) => {
            Swal.close()
            if (tipo === 1) {
              this.rutas[index].documento = archivo.nombreAlmacenado
              this.rutas[index].nombre_original = archivo.nombreOriginalArchivo
              this.rutas[index].ruta_archivo = archivo.ruta
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

  validarCampo(selectId: string): boolean {
    const selectElement = document.getElementById(selectId) as HTMLSelectElement;
    const valor = selectElement.value
    if (valor === null || valor === 'null' || valor === undefined || valor === '') {
      return true
    } else {
      return false
    }
  }

  manejarCambios() {
    this.hayCambios.emit(true)
    this.rutasGuardar.emit(this.rutas)
    this.paradasGuardar.emit(this.paradas)
    this.clasesGuardar.emit(this.clases)
    console.log(this.rutas)
  }

}
