import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ruta } from '../../modelos/ruta';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { TerminalesService } from '../../servicios/terminales.service';
import { Paradas } from '../../modelos/paradas';
import { Clases } from '../../modelos/clases';

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

  paradas: Paradas[] = []
  clases: Clases[] = []

  resolucionCorresponde: boolean = false

  rutas: Ruta[] = [];
  rutaSeleccionada: number | null = null;  // Índice de la ruta seleccionada
  rutaConsultada: boolean = false
  rutaNueva: Ruta
  rutaNuevaHabilitada: boolean = false

  tipoLlegada: Array<{ id: number, nombre: string }> = []
  //direcciones: Array<{ id: number, nombre: string }> = []

  constructor(private servicioArchivos: ServicioArchivos, private servicioTerminales: TerminalesService) {
    this.rutaNueva = this.inicializarRutaNueva()
  }

  ngOnInit(): void {
    this.listarRutas(); // Inicializamos con un registro vacío
    this.maestraTipoLlegadas();
  }

  inicializarRutaNueva(){ //Inicializa vacio los parametros de la ruta nueva
    return {
      id_ruta: '',
      departamento_origen: '',
      municipio_origen: '',
      departamento_destino: '',
      municipio_destino: '',
      tipo_llegada: null,
      direccion: null,
      via: '',
      ruta_activa: null,
      n_resolucion_bd: null,
      resolucion_corresponde: null,
      n_resolucion_actual: null,
      dir_territorial: null,
      pdf: null,
      direcciones: []
    };
  }

  listarRutas() { //listamos las rutas que vienen de base de datos
    const nuevoRuta: Ruta = {
      id_ruta: '001',
      departamento_origen: 'Cundinamarca',
      municipio_origen: 'Bogotá',
      departamento_destino: 'Antioquia',
      municipio_destino: 'Medellín',
      tipo_llegada: null,
      direccion: null,
      via: 'Cartago',
      ruta_activa: null,
      n_resolucion_bd: 156,
      resolucion_corresponde: null,
      n_resolucion_actual: null,
      dir_territorial: 'Casa',
      pdf: null
    };
    this.rutas.push(nuevoRuta);
  }
  consultarInformacionRuta(id_ruta: string | number) { //Consultamos paradas y clases de la ruta seleccionada
    this.rutaConsultada = true
  }

  //Maestras
  maestraTipoLlegadas() {
    this.tipoLlegada = [
      { id: 1, nombre: 'Terminal' },
      { id: 2, nombre: 'infraestructura de acenso/ descenso' },
      { id: 3, nombre: 'sitio /lugar acenso/ descenso empresa' },
      { id: 4, nombre: 'paraderos' },
    ]
  }

  maestraDireccion(id: any, index?: any, tipoRuta?: number) {
    //console.log(id, index)
    const idLlegada = id
    if (tipoRuta === 1) {
      if (id !== 'null') {
        this.rutas[index].direccion = null
        if (idLlegada === '1') {
          this.rutas[index].direcciones = [
            { id: 1, nombre: 'Dirección 1.1' },
            { id: 2, nombre: 'Dirección 1.2' },
            { id: 3, nombre: 'Dirección 1.3' },
          ]
        } else if (idLlegada === '2') {
          this.rutas[index].direcciones = [
            { id: 1, nombre: 'Dirección 2.1' },
            { id: 2, nombre: 'Dirección 2.2' },
            { id: 3, nombre: 'Dirección 2.3' },
          ]
        }
        else if (idLlegada === '3') {
          this.rutas[index].direcciones = [
            { id: 1, nombre: 'Dirección 3.1' },
            { id: 2, nombre: 'Dirección 3.2' },
            { id: 3, nombre: 'Dirección 3.3' },
          ]
        } else if (idLlegada === '4') {
          this.rutas[index].direcciones = [
            { id: 1, nombre: 'Dirección 4.1' },
            { id: 2, nombre: 'Dirección 4.2' },
            { id: 3, nombre: 'Dirección 4.3' },
          ]
        }
        this.rutas[index].tipo_llegada = idLlegada
      }else {
        this.rutas[index].tipo_llegada = null
      }
    } else if (tipoRuta === 2) {
      if (id !== 'null') {
        this.rutaNueva.direccion = null
        if (idLlegada === '1') {
          this.rutaNueva.direcciones = [
            { id: 1, nombre: 'Dirección 1.1' },
            { id: 2, nombre: 'Dirección 1.2' },
            { id: 3, nombre: 'Dirección 1.3' },
          ]
        } else if (idLlegada === '2') {
          this.rutaNueva.direcciones = [
            { id: 1, nombre: 'Dirección 2.1' },
            { id: 2, nombre: 'Dirección 2.2' },
            { id: 3, nombre: 'Dirección 2.3' },
          ]
        }
        else if (idLlegada === '3') {
          this.rutaNueva.direcciones = [
            { id: 1, nombre: 'Dirección 3.1' },
            { id: 2, nombre: 'Dirección 3.2' },
            { id: 3, nombre: 'Dirección 3.3' },
          ]
        } else if (idLlegada === '4') {
          this.rutaNueva.direcciones = [
            { id: 1, nombre: 'Dirección 4.1' },
            { id: 2, nombre: 'Dirección 4.2' },
            { id: 3, nombre: 'Dirección 4.3' },
          ]
        }
        this.rutaNueva.tipo_llegada = idLlegada
      }else {
        this.rutaNueva.tipo_llegada = null
      }
    }
    //console.log(this.rutas, this.rutaNueva)
    this.manejarCambios()
  }

  //Acciones
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
    //console.log(this.hayCambiosRuta,this.rutaNueva);
    this.rutas.push(this.rutaNueva);
    this.rutaNueva = this.inicializarRutaNueva()
    this.estadoAgregarRuta(false)
    this.manejarCambios()
  }

  /* eliminarRuta(index: number) {
    this.rutas.splice(index, 1);
  } */

  direccion(idDireccion: any, index: any) {
    if (idDireccion === 'null') {
      this.rutas[index].direccion = null
    } else {
      this.rutas[index].direccion = idDireccion
    }
    this.manejarCambios()
  }

  corresponde(idCorresponde: any, index: any) {
    if (idCorresponde === 'null') {
      this.rutas[index].resolucion_corresponde = null
    } else {
      this.rutas[index].resolucion_corresponde = Number(idCorresponde)
    }
    this.manejarCambios()
  }

  activa(idActiva: any, index?: any) {
    if(index){
      if (idActiva === 'null') {
        this.rutas[index].ruta_activa = null
      } else {
        this.rutas[index].ruta_activa = idActiva
      }
    }
    this.manejarCambios()
  }

  recibirParadas(paradas: any) {
    this.paradas = paradas
    this.manejarCambios()
  }

  manejarCambios() {
    this.hayCambios.emit(true)
    this.rutasGuardar.emit(this.rutas)
    this.paradasGuardar.emit(this.paradas)
    this.clasesGuardar.emit(this.clases)
  }

}
