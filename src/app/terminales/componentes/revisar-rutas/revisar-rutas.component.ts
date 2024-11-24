import { Component } from '@angular/core';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { TerminalesService } from '../../servicios/terminales.service';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Ruta, Ruta2, RutaInfo } from '../../modelos/ruta';
import { ParadaNueva, Paradas2, Via } from '../../modelos/via';
import { Clase, Clases } from '../../modelos/clases';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import Swal from 'sweetalert2';
import { validarCampos } from '../../validadores/validar-campos';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-revisar-rutas',
  templateUrl: './revisar-rutas.component.html',
  styleUrls: ['./revisar-rutas.component.css']
})
export class RevisarRutasComponent {
  usuario: Usuario | null
  ruta: Ruta2
  rutaInfo: RutaInfo = {}
  tipoLlegada: Array<{ id: any, descripcion: string }> = []
  direcciones: Array<{ id: any, descripcion: string }> = []
  grupos: Array<{ id: number | null, descripcion: string | null }> = []
  tiposVehiculos: Array<{ descripcion: string | null, id: number | null, idClasePorGrupo: number | null }> = []
  vias: Via[] = []
  clases: Clases[] = []

  viaNueva?: string | null
  habilitarViaNueva?: boolean | null
  clase: Clases = { clase_id: null, tipo_vehiculo_id: null }
  habilitarClaseNueva?: boolean | null

  // PAGINADORES
  pageVias: number = 1
  itemsPerPageVia: number = 3
  pageClases: number = 1
  itemsPerPageClase: number = 3
  pageParadas: number = 1
  itemsPerPageParadas: number = 3

  constructor(
    private servicioArchivos: ServicioArchivos,
    private servicioTerminales: TerminalesService,
    servicioLocalStorage: ServicioLocalStorage,
    private router: Router
  ) {
    this.usuario = servicioLocalStorage.obtenerUsuario()
    this.ruta = history.state.ruta;//Ids necesarios para la consulta de la ruta.
  }

  ngOnInit(): void {
    //this.maestraDepartamentos()
    this.maestraTipoLlegadas()
    this.maestraGrupos()
    this.obtenerRutaInfo()
    this.listarClases()
    //this.listarParadas()
  }

  obtenerRutaInfo() {
    this.servicioTerminales.consultarRuta(this.ruta.idRuta, this.ruta.idCodigoUnicoRuta, this.usuario?.id).subscribe({
      next: (respuesta: any) => {
        this.rutaInfo = respuesta // INFORMACIÓN DE LA RUTA A REVISAR
        this.maestraDirecciones(this.ruta, this.rutaInfo)
        this.vias = respuesta.vias.map((via: Via) => ({
          id: via.id,
          via: via.via,
          corresponde: via.corresponde,
          viaNueva: via.viaNueva,
          pageParadas:1,
          itemsPerPageParadas:3,
          idPaginador: 'Paradas'+respuesta.vias.findIndex((via2: Via) => via2.id === via.id),
          paradaNueva: {
            habilitarParadaNueva: false,
            departamento_id: null,
            municipio_id: null,
            centro_poblado_id: null,
            tipollegada_id: null,
            direccion_id: null
          }
        }))
        this.listarParadas()
        //console.log(respuesta.vias, this.vias)
      }
    })
  }
  listarClases() {
    this.servicioTerminales.listarClases(this.ruta.idCodigoUnicoRuta).subscribe({
      next: (respuesta) => {
        this.clases = respuesta.clases
        for (let clase of this.clases) {
          clase.ruta_id = this.ruta.idCodigoUnicoRuta
          clase.tipo_vehiculo_id_temp = clase.tipo_vehiculo_id
        }
        this.maestrasClases()
        //console.log(this.clases)
      }
    })
  }
  listarParadas() {
    this.servicioTerminales.listarParadas(this.ruta.idCodigoUnicoRuta).subscribe({
      next: (respuesta: any) => {
        this.vias.forEach(via => {
          this.inicializarParadaNueva(via)
          this.maestraDepartamentos(via.paradaNueva)
          via.paradas = respuesta.paradas.filter((parada: Paradas2) => parada.via_id === via.id)
          for (let parada of via.paradas!) {
            this.servicioTerminales.maestraTiposLlegadas().subscribe({
              next: (respuesta: any) => {
                parada.tiposLlegada = respuesta.respuestaTipoLLegada
              }
            })
            this.servicioTerminales.maestraDirecciones(parada.tipollegada_id, parada.codigo_cp).subscribe({
              next: (respuesta: any) => {
                parada.direcciones = respuesta.respuestaDirecciones
              }
            })
          }
        })
        //console.log(this.vias)
      }
    })
  }
  inicializarParadaNueva(via: Via) {
    via.paradaNueva.habilitarParadaNueva = false
    via.paradaNueva.departamento_id = null
    via.paradaNueva.municipio_id = null
    via.paradaNueva.centro_poblado_id = null
    via.paradaNueva.tipollegada_id = null
    via.paradaNueva.direccion_id = null
  }
  /* ---------- MAESTRAS INFO RUTA -------------- */
  maestraDepartamentos(paradaNueva: ParadaNueva) { // MAESTRA DE DEPARTAMENTOS
    this.servicioTerminales.maestraDepartamentos().subscribe({
      next: (respuesta: any) => {
        paradaNueva.departamento_id = null
        paradaNueva.departamentos = respuesta.respuestaDepartamentos
        //console.log(this.vias)
      }
    })
  }
  maestraMunicipios(paradaNueva: ParadaNueva) {
    if (paradaNueva.departamento_id !== 'null') {
      this.servicioTerminales.maestraMunicipios(paradaNueva.departamento_id).subscribe({
        next: (municipios: any) => {
          paradaNueva.municipio_id = null
          paradaNueva.centro_poblado_id = null
          paradaNueva.tipollegada_id = null
          paradaNueva.direccion_id = null
          paradaNueva.municipios = municipios.respuestaMunicipios
        }
      })
    } else {
      paradaNueva.municipios = []
      //paradaNueva.departamento_id = null
    }
  }
  maestraCP(paradaNueva: ParadaNueva) {
    if (paradaNueva.municipio_id !== 'null') {
      this.servicioTerminales.maestraCentrosPoblados(paradaNueva.municipio_id).subscribe({
        next: (respuesta: any) => {
          paradaNueva.centro_poblado_id = null
          paradaNueva.tipollegada_id = null
          paradaNueva.direccion_id = null
          paradaNueva.centrosPoblados = respuesta.respuestaCentrosPoblados
        }
      })
    } else {
      paradaNueva.centrosPoblados = []
    }
  }
  maestraTipoLlegada(paradaNueva: ParadaNueva) {
    if (paradaNueva.centro_poblado_id !== 'null') {
      this.servicioTerminales.maestraTiposLlegadas().subscribe({
        next: (respuesta: any) => {
          paradaNueva.tipollegada_id = null
          paradaNueva.direccion_id = null
          paradaNueva.tiposLlegada = respuesta.respuestaTipoLLegada
        }
      })
    } else {
      paradaNueva.tiposLlegada = []
    }
  }
  maestraDireccionesP(paradaNueva?: ParadaNueva, parada?: Paradas2) {
    //console.log(paradaNueva, parada)
    if (paradaNueva) {
      if (paradaNueva.tipollegada_id !== 'null') {
        this.servicioTerminales.maestraDirecciones(paradaNueva.tipollegada_id, paradaNueva.centro_poblado_id).subscribe({
          next: (respuesta: any) => {
            paradaNueva.direccion_id = null
            paradaNueva.direcciones = respuesta.respuestaDirecciones
          }
        })
      }
    }
    if (parada) {
      if (parada.tipollegada_id !== 'null') {
        this.servicioTerminales.maestraDirecciones(parada.tipollegada_id, parada.codigo_cp).subscribe({
          next: (respuesta: any) => {
            parada.direccion_id = null
            parada.direcciones = respuesta.respuestaDirecciones
          }
        })
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

  maestraDirecciones(ruta?: Ruta2, rutaInfo?: RutaInfo) {
    if (rutaInfo?.idTipoLlegada !== 'null' || rutaInfo?.idTipoLlegada !== null) {
      this.servicioTerminales.maestraDirecciones(rutaInfo?.idTipoLlegada, ruta?.codCpDestino).subscribe({
        next: (respuesta: any) => {
          this.direcciones = respuesta.respuestaDirecciones
        }
      })
    } else {
      this.direcciones = []
      rutaInfo.Iddireccion = null
    }
  }

  /* ------------- MAESTRAS CLASES ----------------- */
  maestrasClases() { // Consulta las maestras que corresponda llenar en la lista de Clases
    if (this.clases.length > 0) {
      for (let i = 0; i < this.clases.length; i++) {
        this.maestraTipoVehiculo(this.clases[i])
      }
    }
  }
  maestraGrupos() {
    this.servicioTerminales.maestraGrupos().subscribe({
      next: (respuesta: any) => {
        this.grupos = respuesta.respuestaclasesPorGrupos
      }
    })
  }
  maestraTipoVehiculo(clase2: Clases, tipo?: any) {
    this.servicioTerminales.maestraTiposVehiculos(clase2.clase_id).subscribe({
      next: (respuesta: any) => {
        if (tipo === 2) {
          this.tiposVehiculos = [];
          this.tiposVehiculos = respuesta.respuestaTiposvehiculos
          this.clase.tipo_vehiculo_id = null
        } else {
          for (let clase of this.clases) {
            if (clase.id_ruta_vehiculos == clase2.id_ruta_vehiculos) {
              clase.tipoVehiculo = []
              if (respuesta.respuestaTiposvehiculos.length > 0) {
                clase.tipoVehiculo = respuesta.respuestaTiposvehiculos
              } else { clase.tipo_vehiculo_id = null }
            }
          }
        }

      }
    })
  }

  /* ------------- ACCIONES ---------------- */
  manejarEstadoRuta(rutaInfo: RutaInfo) {
    if (rutaInfo.rutaActiva === 'true') {
      rutaInfo.rutaActiva = true
    } else {
      rutaInfo.idTipoLlegada = null
      this.direcciones = []
      rutaInfo.Iddireccion = null
    }
    if (rutaInfo.rutaActiva === 'false') rutaInfo.rutaActiva = false
    if (rutaInfo.rutaActiva === 'null') rutaInfo.rutaActiva = null
  }

  manejarCorresponde(rutaInfo: RutaInfo) {
    if (rutaInfo.corresponde === '1') {
      rutaInfo.corresponde = 1
      rutaInfo.resolucionActual = rutaInfo.resolucion
    }
    if (rutaInfo.corresponde === 'null') {
      rutaInfo.corresponde = null
      rutaInfo.resolucionActual = null
    }
    if (rutaInfo.corresponde === '2') {
      rutaInfo.corresponde = 2
    }
  }

  manejarCorrespondeVia(via: Via) {
    if (via.corresponde === '1') {
      via.corresponde = 1
      via.viaNueva = via.via
    }
    if (via.corresponde === 'null') {
      via.corresponde = null
      via.viaNueva = null
    }
    if (via.corresponde === '2') via.corresponde = 2
  }

  manejarTipoVehiculo(select: HTMLSelectElement, event?: any, index?: any) {
    if (this.clases.length > 0) {
      if (this.clases.some((clase: Clases) => clase.tipo_vehiculo_id === Number(this.clase.tipo_vehiculo_id))) {
        this.clase.tipo_vehiculo_id = null
        select.value = ''
        event.preventDefault();
        console.log(this.clase.tipo_vehiculo_id = null, event.preventDefault())
        Swal.fire('¡Advertencia!', 'Este tipo de vehiculo ya existe, por favor escoja otro.', 'warning');
      }
      if (this.clases.some((clase: Clases, i) => i !== index && clase.tipo_vehiculo_id === Number(event.target.value))) {
        select.value = ''
        event.preventDefault();
        this.clases[index].tipo_vehiculo_id = null
        Swal.fire('¡Advertencia!', 'Este tipo de vehiculo ya existe, por favor escoja otro.', 'warning');
      }
    }
  }

  manejarDirecciones(rutaInfo?: RutaInfo, paradaNueva?: ParadaNueva) {
    if (rutaInfo) {
      if (rutaInfo.Iddireccion === 'abrirModal') {
        this.abrirModalConSwal(Number(rutaInfo.idTipoLlegada), this.ruta.codCpDestino, rutaInfo);
      }
    }
    if (paradaNueva) {
      if (paradaNueva.direccion_id === 'abrirModal') {
        this.abrirModalConSwal(Number(paradaNueva.tipollegada_id), paradaNueva.centro_poblado_id, undefined, paradaNueva); // Si selecciona la opción de 'Añadir nueva dirección'
      } else {

      }
    }

  }
  abrirModalConSwal(tipo_llegada_id: number, cp_destino: any, rutaInfo?: RutaInfo, paradaNueva?: ParadaNueva) {
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
            if (rutaInfo) {
              this.direcciones = respuesta.respuestaDirecciones
              rutaInfo.Iddireccion = null
            } else if (paradaNueva) {
              paradaNueva.direcciones = respuesta.respuestaDirecciones
              paradaNueva.direccion_id = null
            }
            Swal.fire('¡Guardado!', 'La nueva dirección ha sido añadida.', 'success');
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 400) {
              Swal.fire('¡Fallo al crear!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
            } else {
              Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
            }
          }
        })
      } else if (result.isDismissed) {// Aquí manejas la acción de cancelación
        if (rutaInfo) {
          rutaInfo.Iddireccion = null
        } else if (paradaNueva) {
          paradaNueva.direccion_id = null
        }
      }
    });
  }

  agregarNuevaVia(via: string) {
    const JSONviaNueva = {
      codigoRuta: this.ruta.idCodigoUnicoRuta,
      via: via,
      corresponde: 1,
      nuevaVia: via,
    }
    console.log(JSONviaNueva)
    if (validarCampos(JSONviaNueva)) {
      Swal.fire({
        titleText: "¿Está usted seguro de querer agregar una via nueva?",
        confirmButtonText: "Agregar",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicioTerminales.crearVia(JSONviaNueva).subscribe({
            next: (respuesta: any) => {
              this.obtenerRutaInfo()
              console.log(this.vias)
              this.deshabilitarAgregarNuevo('via')
              Swal.fire('¡Via creada!', 'La nueva via ha sido añadida.', 'success');
            },
            error: (error: HttpErrorResponse) => {
              if (error.status == 400) {
                Swal.fire('¡Fallo al crear!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
              } else {
                Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
              }
            }
          })
        } else if (result.isDismissed) {
          Swal.close()
        }
      })
    } else {
      //this.error = true
      Swal.fire('¡Información incompleta!', 'Por favor, complete la información de la nueva Via antes de agregarla.', 'error');
    }
  }

  agregarNuevaClase(clase: Clases) {
    const JSONClaseNueva = {
      idRuta: this.ruta.idCodigoUnicoRuta,
      idClaseVehiculo: clase.tipo_vehiculo_id,
      estado: true
    }
    console.log(JSONClaseNueva)
    if (validarCampos(JSONClaseNueva)) {
      Swal.fire({
        titleText: "¿Está usted seguro de querer agregar una clase nueva?",
        confirmButtonText: "Agregar",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicioTerminales.crearClase(JSONClaseNueva).subscribe({
            next: (respuesta: any) => {
              this.listarClases()
              this.deshabilitarAgregarNuevo('clase')
              Swal.fire('¡Clase creada!', 'La nueva clase ha sido añadida.', 'success');
            },
            error: (error: HttpErrorResponse) => {
              if (error.status == 400) {
                Swal.fire('¡Fallo al crear!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
              } else {
                Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
              }
            }
          })
        } else if (result.isDismissed) {
          Swal.close()
        }
      })
    } else {
      //this.error = true
      Swal.fire('¡Información incompleta!', 'Por favor, complete la información de la nueva Clase antes de agregarla.', 'error');
    }
  }

  agregarNuevaParada(via: Via) {
    console.log(via)
    const JSONParadaNueva = {
      idRuta: this.ruta.idCodigoUnicoRuta,
      centroPobladoId: via.paradaNueva.centro_poblado_id,
      direccionId: via.paradaNueva.direccion_id,
      estado: true,
      idVia: via.id
    }
    if (validarCampos(JSONParadaNueva)) {
      Swal.fire({
        titleText: "¿Está seguro de querer agregar una parada nueva?",
        confirmButtonText: "Agregar",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicioTerminales.crearParada(JSONParadaNueva).subscribe({
            next: (respuesta: any) => {
              this.listarParadas()
              this.inicializarParadaNueva(via)
              via.paradaNueva.habilitarParadaNueva = false
              Swal.fire('¡Parada creada!', 'La nueva parada ha sido añadida.', 'success');
            },
            error: (error: HttpErrorResponse) => {
              if (error.status == 400) {
                Swal.fire('¡Fallo al crear!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
              } else {
                Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
              }
            }
          })
        } else if (result.isDismissed) {
          Swal.close()
        }
      })
    } else {
      Swal.fire('¡Información incompleta!', 'Por favor, complete la información de la nueva Parada antes de agregarla.', 'error');
    }
  }

  habilitarAgregarNuevo(tipo: any, via?: Via) {
    if (tipo && tipo === 'via') this.habilitarViaNueva = true
    if (tipo && tipo === 'clase') this.habilitarClaseNueva = true
    if (tipo && tipo === 'parada') via!.paradaNueva.habilitarParadaNueva = true
  }
  deshabilitarAgregarNuevo(tipo: any, via?: Via) {
    if (tipo && tipo === 'via') {
      this.habilitarViaNueva = false
      this.viaNueva = null
    }
    if (tipo && tipo === 'clase') {
      this.habilitarClaseNueva = false
      this.clase = { clase_id: null, tipo_vehiculo_id: null }
    }
    if (tipo && tipo === 'parada') {
      via!.paradaNueva.habilitarParadaNueva = false
      this.inicializarParadaNueva(via!)
    }
  }

  agregarRegistro(registro?: any, tipo?: any) {
    if (tipo && tipo === 'via') { this.agregarNuevaVia(registro) }
    if (tipo && tipo === 'clase') { this.agregarNuevaClase(registro) }
    if (tipo && tipo === 'parada') { this.agregarNuevaParada(registro) }
  }
  eliminarRegistro(arreglo?: any, tipo?: any) {
    if (tipo === 'clase') {
      this.servicioTerminales.eliminarClase(arreglo.id_ruta_vehiculos).subscribe({
        next: (respuesta: any) => {
          this.listarClases()
          Swal.fire('!Clase eliminada!', 'La clase ha sido eliminada.', 'success');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 400) {
            Swal.fire('¡Fallo al eliminar!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
          } else {
            Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
          }
        }
      })
    }
    if (tipo === 'parada') {
      let parada: Paradas2 = arreglo
      this.servicioTerminales.eliminarParada(Number(parada.parada_id), Number(parada.nodo_despacho_id)).subscribe({
        next: (respuesta: any) => {
          this.listarParadas()
          Swal.fire('!Parada eliminada!', 'La parada ha sido eliminada.', 'success');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 400) {
            Swal.fire('¡Fallo al eliminar!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
          } else {
            Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
          }
        }
      })
    }
    if (tipo === 'via') {
      let via: Via = arreglo
      this.servicioTerminales.eliminarVia(via.id).subscribe({
        next: (respuesta: any) => {
          this.obtenerRutaInfo()
          Swal.fire('!Via eliminada!', 'La via ha sido eliminada.', 'success');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 400) {
            Swal.fire('¡Fallo al eliminar!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
          } else {
            Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
          }
        }
      })
    }
  }

  // GUARDAR RUTA COMPLETA ///////////////////////////////////////////////////////////////////////////////
  guardarRutaCompleta() {
    let JSONRutaCompleta = {
      id: Number(this.ruta.idRuta),
      idRuta: Number(this.ruta.idCodigoRuta),
      idUnicoRuta: Number(this.ruta.idCodigoUnicoRuta),
      centroPobladoOrigen: this.ruta.codCpOrigen,
      centroPobladoDestino: this.ruta.codCpDestino,
      tipoLLegada: Number(this.rutaInfo.idTipoLlegada),
      direccion: Number(this.rutaInfo.Iddireccion),
      rutaHabilitada: true,
      corresponde: 1,
      resolucionActual: this.rutaInfo.resolucionActual,
      documento: this.rutaInfo.documento,
      nombreOriginal: this.rutaInfo.nombreOriginal,
      rutaArchivo: this.rutaInfo.rutaDocumento,
      vias: this.vias.map((via: Via) => ({
        id: Number(via.id),
        via: via.via,
        corresponde: Number(via.corresponde),
        viaNueva: via.viaNueva,
        paradas: via.paradas?.map((parada: Paradas2) => ({
          id: Number(parada.parada_id),
          centroPobladoId: parada.codigo_cp,
          direccionId: Number(parada.direccion_id),
          estado: true,
          nodoDespachoId: Number(parada.nodo_despacho_id)
        }))
      })),
      clases: this.clases.map((clase: Clases) => ({
        id: Number(clase.id_ruta_vehiculos),
        idClaseVehiculo: Number(clase.tipo_vehiculo_id),
        estado: true
      }))
    }
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      text: 'Espere por favor...',
    });
    Swal.showLoading(null);
    this.servicioTerminales.guardar(JSONRutaCompleta).subscribe({
      next: (respuesta: any) => {
        Swal.fire({ icon: 'success', titleText: '¡Guardado exitosamente!' });
        this.router.navigate(['/administrar/terminales'],{queryParams:{idRuta:this.ruta.idRuta,revisada:true}});
        //console.log(respuesta)
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 400) {
          Swal.fire('¡Fallo al guardar!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
        } else {
          Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
        }
      }
    })
  }

  // MANEJO DE ARCHIVOS //////////////////////////////////////////////////////////////////////////////////
  manejarRemoverArchivo(input: HTMLInputElement, event: any) {
    input.value = ''
    event.preventDefault();
    this.removeFile()
  }
  removeFile() {
    this.rutaInfo.documento = ''
    this.rutaInfo.nombreOriginal = ''
    this.rutaInfo.rutaDocumento = ''
  }

  guardarArchivo(event: any, tamanoMaximoMb: number) {
    if (event) {
      Swal.fire({
        icon: 'info',
        allowOutsideClick: false,
        text: 'Espere por favor...',
      });
      Swal.showLoading(null);
      if (this.tamanoValido(event.target.files[0], tamanoMaximoMb)) {
        this.servicioArchivos.guardarArchivo(event.target.files[0], 'proveedores', this.usuario?.usuario!).subscribe({
          next: (archivo: any) => {
            Swal.close()
            this.rutaInfo.documento = archivo.nombreAlmacenado
            this.rutaInfo.nombreOriginal = archivo.nombreOriginalArchivo
            this.rutaInfo.rutaDocumento = archivo.ruta
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 400) {
              Swal.fire('¡Fallo al guardar!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
            } else {
              Swal.fire('¡Error desconocido!', 'Por favor, vuelva a intentarlo más tarde.', 'error');
            }
          }
        })
      } else {
        Swal.fire({ icon: 'error', titleText: '¡Error alcargar el archivo!', text: 'El tamaño máximo del archivo debe ser de hasta 5Mb.' });
      }
    }
  }

  descargarArchivo(nombreOriginal?: string, nombre?: any, ruta?: any) {
    this.servicioArchivos.descargarArchivo(nombre!, ruta!, nombreOriginal!)
  }

  // VALIDACIONES Y CAMBIOS ////////////////////////////////////////////////////////////////////////////////////////////////////////
  private tamanoValido(archivo: File, tamanoMaximoMb: number): boolean {
    if (tamanoMaximoMb) {
      return tamanoMaximoMb * 1048576 >= archivo.size ? true : false
    } else {
      return true
    }
  }
}
