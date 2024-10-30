import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Paradas } from '../../modelos/paradas';
import { TerminalesService } from '../../servicios/terminales.service';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import Swal from 'sweetalert2';
import { validarCampos } from '../../validadores/validar-campos';

@Component({
  selector: 'app-paradas',
  templateUrl: './paradas.component.html',
  styleUrls: ['./paradas.component.css']
})
export class ParadasComponent implements OnInit, OnChanges {
  @Output() hayCambios: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() paradasGuardar: EventEmitter<Array<Paradas>> = new EventEmitter<Array<Paradas>>();
  @Input() rutaId?: any
  @Input() paginadorParadas?: Paginador<any>
  @Input() verificacionVisible?: boolean
  @Input() verificacionEditable?: boolean
  @Input() editable?: boolean
  @Input() aprobado?: boolean
  paradas: Array<Paradas> = []
  nuevaParada: Paradas
  paradaNuevaHabilitada: boolean = false

  tiposLlegada: Array<{ id: number, descripcion: string }> = []
  direcciones: Array<{ id: number, descripcion: string }> = []
  departamentos: Array<{ codigoDepartamento: number, nombre: string }> = []
  municipios: Array<{ codigoMunicipio: number, nombre: string }> = []
  centrosPoblados: Array<{ codigoCentroPoblado: number, nombre: string }> = []

  error: boolean = false
  errorParadas: boolean = false

  pageParadas: number = 1; // Variable para controlar la página actual

  constructor(private servicioTerminales: TerminalesService) {
    this.nuevaParada = this.inicializarParadaNueva()
  }

  ngOnInit(): void {
    //this.listarParadas();  //Inicializamos con un registro vacío
    this.maestraTipoLlegadas();
    this.maestraDepartamentos()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rutaId']) {
      this.paradas = []
      this.listarParadas();
      //console.log('El array ha cambiado:', this.paradas);
    }
  }

  inicializarParadaNueva(): Paradas { //Inicializa vacio los parametros de la ruta nueva
    return {
      parada_id: null,
      codigo_departamento: null,
      codigo_municipio: null,
      codigo_cp: null,
      direccion_id: null,
      tipo_llegada_id: null
    };
  }
  listarParadas() { //listamos las paradas que vienen de base de datos
    this.servicioTerminales.listarParadas(this.rutaId).subscribe({
      next: (respuesta) => {
        this.paradas = respuesta.paradas
        for (let parada of this.paradas) {
          parada.ruta_id = this.rutaId
        }
        this.maestrasParadas()
        this.paradasGuardar.emit(this.paradas)
        //console.log(this.paradas)
      }
    })
  }

  //MAESTRAS /////////////////////////////////////////////////////////////////////////////////////////////////
  maestrasParadas() { //listamos las rutas que vienen de base de datos
    if (this.paradas.length > 0) {
      for (let i = 0; i < this.paradas.length; i++) {//RECORREMOS LAS RUTAS
        if (this.paradas[i].codigo_departamento) {//COMPROBAMOS QUE EXISTA UN DEPARTAMENTO Y SI EXISTE
          this.maestraMunicipios(this.paradas[i].codigo_departamento, 'municipio' + i, i)//CONSULTAMOS EL MUNICIPIO CORRESPONDIENTE
        }
        if (this.paradas[i].codigo_municipio) {//COMPROBAMOS QUE EXISTA UN MUNICIPIO Y SI EXISTE
          this.maestraCP(this.paradas[i].codigo_municipio, i)//CONSULTAMOS EL CENTRO POBLADO CORRESPONDIENTE
        }
        if (this.paradas[i].tipo_llegada_id) {//COMPROBAMOS QUE EXISTA UN TIPO DE LLEGADA Y SI EXISTE
          this.maestraDireccion(this.paradas[i].tipo_llegada_id, this.paradas[i].codigo_cp, i)//CONSULTAMOS LA DIRECCIÓN CORRESPONDIENTE
        }
      }
    }
    //console.log(this.paradas)
  }

  maestraDepartamentos() { // MAESTRA DE DEPARTAMENTOS
    this.servicioTerminales.maestraDepartamentos().subscribe({
      next: (respuesta: any) => {
        //console.log(respuesta)
        this.departamentos = respuesta.respuestaDepartamentos
        //console.log(this.departamentos)
      }
    })
  }

  maestraMunicipios(codigo_departamento: any, nombre: string, index?: number, cambio?: boolean) { // MAESTRA DE MUNICIPIOS
    const id_departamento = codigo_departamento
    const selectElement = document.getElementById(nombre) as HTMLSelectElement;
    //console.log(id_departamento)
    if (id_departamento !== 'null') {
      this.servicioTerminales.maestraMunicipios(id_departamento).subscribe({
        next: (municipios: any) => {
          console.log(id_departamento)
          //selectElement.disabled = false
          if (index !== undefined) {
            this.paradas[index].municipios = [];
            this.paradas[index].municipios = municipios.respuestaMunicipios
            this.paradas[index].codigo_departamento = id_departamento
            if (cambio) {
              this.paradas[index].codigo_municipio = null
              this.maestraCP('null', index, cambio)
              this.paradas[index].direccion_id = null
              this.manejarCambios()
            }

          } else {
            this.municipios = []
            this.municipios = municipios.respuestaMunicipios
            this.nuevaParada.codigo_municipio = null
            this.maestraCP('null', index, cambio)
          }
        }
      })
    } else {
      //selectElement.disabled = true;
      if (index !== undefined) {
        this.paradas[index].municipios = [];
        this.paradas[index].codigo_municipio = null
        this.maestraCP('null', index, cambio)
        this.paradas[index].codigo_departamento = null
      } else {
        this.municipios = []
        this.nuevaParada.codigo_municipio = null
        this.maestraCP('null', undefined, cambio)
      }
    }
  }

  maestraCP(codigo_municipio: any, index?: number, cambio?: boolean) { // MAESTRA DE CENTROS POBLADOS
    let codigoMunicipio = codigo_municipio
    //console.log(codigoMunicipio)
    if (codigoMunicipio !== 'null') {
      this.servicioTerminales.maestraCentrosPoblados(codigoMunicipio).subscribe({
        next: (respuesta: any) => {
          //console.log(respuesta)
          if (index !== undefined) {
            this.paradas[index].centrosPoblados = [];
            this.paradas[index].centrosPoblados = respuesta.respuestaCentrosPoblados
            this.paradas[index].codigo_municipio = codigoMunicipio
            if (cambio) {
              this.paradas[index].codigo_cp = null
              this.paradas[index].tipo_llegada_id = null
              this.manejarCambios()
            }
          } else {
            this.centrosPoblados = []
            this.centrosPoblados = respuesta.respuestaCentrosPoblados
            this.nuevaParada.codigo_cp = null
            this.nuevaParada.tipo_llegada_id = null
          }
        }
      })
    } else {
      //selectElement.disabled = true;
      if (index !== undefined) {
        this.paradas[index].centrosPoblados = [];
        this.paradas[index].codigo_cp = null
        this.paradas[index].tipo_llegada_id = null
        if(cambio)this.manejarCambios()
      } else {
        this.centrosPoblados = [];
        this.nuevaParada!.codigo_cp = null
        this.nuevaParada.tipo_llegada_id = null
      }
    }
  }

  maestraTipoLlegadas() { // MAESTRA DE TIPOS DE LLEGADAS
    this.servicioTerminales.maestraTiposLlegadas().subscribe({
      next: (respuesta: any) => {
        //console.log(respuesta)
        this.tiposLlegada = respuesta.respuestaTipoLLegada
      }
    })
  }

  maestraDireccion(id: any, codigo_cp: any, index?: any, cambio?: boolean) { // MAESTRA DE DIRECCIONES
    //console.log(id, codigo_cp)
    const idLlegada = Number(id)
    if (id !== 'null') {
      this.servicioTerminales.maestraDirecciones(idLlegada, codigo_cp).subscribe({
        next: (respuesta: any) => {
          //console.log(respuesta)
          if (index !== undefined) {
            this.paradas[index].direcciones = []; //this.rutas[index].direccion_id = null
            this.paradas[index].direcciones = respuesta.respuestaDirecciones
            this.paradas[index].tipo_llegada_id = idLlegada
            if (cambio) {
              this.paradas[index].direccion_id = null
              this.manejarCambios()
            }
          } else {
            this.direcciones = []; this.nuevaParada!.direccion_id = null
            this.direcciones = respuesta.respuestaDirecciones
            this.nuevaParada!.tipo_llegada_id = idLlegada
          }
        }
      })
    } else {
      if (index !== undefined) {
        this.paradas[index].tipo_llegada_id = null;
        this.paradas[index].direccion_id = null
        this.paradas[index].direcciones = []
        if(cambio)this.manejarCambios()
      } else {
        this.nuevaParada.tipo_llegada_id = null;
        this.nuevaParada.direccion_id = null;
        this.direcciones = []
      }
    }
    //console.log(this.rutas, this.rutaNueva)
  }

  ///////////// ACCIONES //////////////////////////////////////////////////////////////////////////////////
  estadoAgregarParada(estado: boolean) {
    this.paradaNuevaHabilitada = estado
    this.nuevaParada = this.inicializarParadaNueva()
    if(!estado) this.error = estado
  }

  agregarNuevaParada() {
    const JSONParadaNueva = {
      idRuta: this.rutaId,
      centroPobladoId: this.nuevaParada.codigo_cp,
      direccionId: this.nuevaParada.direccion_id,
      estado: true
    }
    if (validarCampos(JSONParadaNueva)) {
      Swal.fire({
        titleText: "¿Está seguro que quiere agregar una parada nueva?",
        text: "Después de agregar una parada nueva, no podrá eliminarla.",
        confirmButtonText: "Agregar",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicioTerminales.crearParada(JSONParadaNueva).subscribe({
            next: (respuesta: any) => {
              this.listarParadas()
              this.nuevaParada = this.inicializarParadaNueva()
              this.estadoAgregarParada(false)
              this.manejarCambios()
              Swal.fire('¡Parada crada!', 'La nueva parada ha sido añadida.', 'success');
            }
          })
        } else if (result.isDismissed) {
          Swal.close()
        }
      })
    } else {
      this.error = true
      Swal.fire({
        title: 'Información incompleta',
        icon: 'error',
        text: 'Por favor, completa la información de la nueva parada antes de agregarla.'
      })
    }
  }

  manejarTipoLlegada(codigo_cp: any, index?: any) {
    if (index !== undefined) {
      this.paradas[index].tipo_llegada_id = null
      this.paradas[index].direccion_id = null
      this.paradas[index].direcciones = []
      if (codigo_cp === 'null') {
        this.paradas[index].codigo_cp = null
      }
      this.manejarCambios()
    } else {
      this.nuevaParada.tipo_llegada_id = null
      this.nuevaParada.direccion_id = null
      this.direcciones = []
      if (codigo_cp === 'null') {
        this.nuevaParada.codigo_cp = null
      }
    }
  }

  manejarDirecciones(event: any, tipo_llegada_id: any, codigo_cp: any, index?: number) {
    //console.log(tipo_llegada_id, cp_destino, event.target.value)
    const valorSeleccionado = event.target.value;
    if (valorSeleccionado === 'abrirModal') {
      this.abrirModalConSwal(Number(tipo_llegada_id), codigo_cp, index); // Si selecciona la opción de 'Añadir nueva dirección'
    } else {
      if (index) {
        this.paradas[index].direccion_id = Number(valorSeleccionado)
        this.manejarCambios()
      } else {
        this.nuevaParada.direccion_id = Number(valorSeleccionado)
      }

    }
  }
  abrirModalConSwal(tipo_llegada_id: number, codigo_cp: string, index?: number) {
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
          codigoCentroPoblado: codigo_cp
        }
        console.log(JSONDatosDireccion)
        this.servicioTerminales.crearDireccion(JSONDatosDireccion).subscribe({
          next: (respuesta: any) => {
            console.log(respuesta)
            if (index !== undefined) {
              this.paradas[index].direcciones = respuesta.respuestaDirecciones
              this.paradas[index].direccion_id = null
            } else {
              this.direcciones = respuesta.respuestaDirecciones
              this.nuevaParada.direccion_id = null
            }
            Swal.fire('¡Guardado!', 'La nueva dirección ha sido añadida.', 'success');
          }
        })
      } else if (result.isDismissed) {// Aquí manejas la acción de cancelación
        if (index !== undefined) {
          this.paradas[index].direccion_id = null
        } else {
          this.nuevaParada.direccion_id = null
        }

      }
    });
  }

  // VALIDACIONES Y CAMBIOS ////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    this.paradasGuardar.emit(this.paradas)
  }
}
