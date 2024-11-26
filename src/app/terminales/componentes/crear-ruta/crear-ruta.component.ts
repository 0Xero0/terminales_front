import { Component } from '@angular/core';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { Ruta, Ruta2, RutaInfo, RutaNueva2 } from '../../modelos/ruta';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { TerminalesService } from '../../servicios/terminales.service';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ParadaNueva, Paradas2, Via } from '../../modelos/via';
import { Clases } from '../../modelos/clases';
import Swal from 'sweetalert2';
import { validarCampos } from '../../validadores/validar-campos';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-ruta',
  templateUrl: './crear-ruta.component.html',
  styleUrls: ['./crear-ruta.component.css']
})
export class CrearRutaComponent {
  usuario: Usuario | null
  rutaInfo: RutaNueva2 = {}

  departamentos?: { codigoDepartamento: any, nombre: string }[] = []
  municipiosOrigen?: { codigoMunicipio: any, nombre: string }[] = []
  centroPobladoOrigen?: { codigoCentroPoblado: any, nombre: string }[] = []
  municipiosDestino?: { codigoMunicipio: any, nombre: string }[] = []
  centroPobladoDestino?: { codigoCentroPoblado: any, nombre: string }[] = []
  tipoLlegada?: Array<{ id: any, descripcion: string }> = []
  direcciones?: Array<{ id: any, descripcion: string }> = []
  grupos?: Array<{ id: number | null, descripcion: string | null }> = []
  tiposVehiculos?: Array<{ descripcion: string | null, id: number | null, idClasePorGrupo: number | null }> = []

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

  constructor(
    private servicioArchivos: ServicioArchivos,
    private servicioTerminales: TerminalesService,
    servicioLocalStorage: ServicioLocalStorage,
    private router: Router
  ) {
    this.usuario = servicioLocalStorage.obtenerUsuario()
    this.rutaInfo = {
      CoddepartamentoOrigen: null, CodmunicipioOrigen: null, codCpOrigen: null,
      CoddepartamentoDestino: null, CodmunicipioDestino: null, codCpDestino: null,
      resolucionActual: null, Iddireccion: null, idTipoLlegada: null
    }
  }

  ngOnInit(): void {
    this.maestraDepartamentos()
    this.maestraTipoLlegada()
    this.maestraGrupos()
  }

  obtenerRutaInfo() {
    this.servicioTerminales.consultarRuta(this.rutaInfo.idRuta, this.rutaInfo.idCodigoUnicoRuta, this.usuario?.id).subscribe({
      next: (respuesta: any) => {
        this.rutaInfo = respuesta // INFORMACIÓN DE LA RUTA A REVISAR
        this.maestraDirecciones(this.rutaInfo)
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
      }
    })
  }

  listarClases() {
    this.servicioTerminales.listarClases(this.rutaInfo.idCodigoUnicoRuta).subscribe({
      next: (respuesta) => {
        this.clases = respuesta.clases
        for (let clase of this.clases) {
          clase.ruta_id = this.rutaInfo.idCodigoUnicoRuta
          clase.tipo_vehiculo_id_temp = clase.tipo_vehiculo_id
        }
        this.maestrasClases()
        //console.log(this.clases)
      }
    })
  }
  listarParadas() {
    this.servicioTerminales.listarParadas(this.rutaInfo.idCodigoUnicoRuta).subscribe({
      next: (respuesta: any) => {
        //console.log(respuesta.pardas)
        this.vias.forEach(via => {
          this.inicializarParadaNueva(via)
          this.maestraDepartamentos(via.paradaNueva)
          via.paradas = respuesta.paradas.filter((parada: Paradas2) => parada.via_id === via.id)
          //console.log(via.paradas)
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
    //via.paradaNueva.habilitarParadaNueva = false
    via.paradaNueva.departamento_id = null
    via.paradaNueva.municipio_id = null
    via.paradaNueva.centro_poblado_id = null
    via.paradaNueva.tipollegada_id = null
    via.paradaNueva.direccion_id = null
  }

  /* ---------- MAESTRAS INFO RUTA -------------- */
  maestraDepartamentos(paradaNueva?: ParadaNueva) { // MAESTRA DE DEPARTAMENTOS
    this.servicioTerminales.maestraDepartamentos().subscribe({
      next: (respuesta: any) => {
        if (paradaNueva) {
          paradaNueva.departamento_id = null
          paradaNueva.departamentos = respuesta.respuestaDepartamentos
          //console.log(this.vias)
        } else {
          this.departamentos = respuesta.respuestaDepartamentos
        }
      }
    })
  }
  maestraMunicipios(paradaNueva?: ParadaNueva, rutaInfo?: RutaNueva2, tipo?: any) {
    if (paradaNueva) {
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
    } else if (rutaInfo) {
      if (tipo === 'origen') {
        if (rutaInfo.CoddepartamentoOrigen !== 'null') {
          this.servicioTerminales.maestraMunicipios(rutaInfo.CoddepartamentoOrigen).subscribe({
            next: (municipios: any) => {
              rutaInfo.CodmunicipioOrigen = null; rutaInfo.codCpOrigen = null
              this.municipiosOrigen = municipios.respuestaMunicipios
            }
          })
        } else {
          this.municipiosOrigen = []; rutaInfo.CoddepartamentoOrigen = null
          rutaInfo.CodmunicipioOrigen = null; rutaInfo.codCpOrigen = null
        }
      }
      if (tipo === 'destino') {
        if (rutaInfo.CoddepartamentoDestino !== 'null') {
          this.servicioTerminales.maestraMunicipios(rutaInfo.CoddepartamentoDestino).subscribe({
            next: (municipios: any) => {
              rutaInfo.CodmunicipioDestino = null; rutaInfo.codCpDestino = null
              rutaInfo.Iddireccion = null
              rutaInfo.idTipoLlegada = null
              this.municipiosDestino = municipios.respuestaMunicipios
            }
          })
        } else {
          this.municipiosDestino = []; rutaInfo.CoddepartamentoDestino = null
          rutaInfo.CodmunicipioDestino = null; rutaInfo.codCpDestino = null
          rutaInfo.Iddireccion = null
          rutaInfo.idTipoLlegada = null
        }
      }
    }
  }
  maestraCP(paradaNueva?: ParadaNueva, rutaInfo?: RutaNueva2, tipo?: any) {
    if (paradaNueva) {
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
    } else if (rutaInfo) {
      if (tipo === 'origen') {
        if (rutaInfo.CodmunicipioOrigen !== 'null') {
          this.servicioTerminales.maestraCentrosPoblados(rutaInfo.CodmunicipioOrigen).subscribe({
            next: (respuesta: any) => {
              rutaInfo.codCpOrigen = null
              this.centroPobladoOrigen = respuesta.respuestaCentrosPoblados
            }
          })
        } else { this.centroPobladoOrigen = []; rutaInfo.CodmunicipioOrigen = null; rutaInfo.codCpOrigen = null }
      }
      if (tipo === 'destino') {
        if (rutaInfo.CodmunicipioDestino !== 'null') {
          this.servicioTerminales.maestraCentrosPoblados(rutaInfo.CodmunicipioDestino).subscribe({
            next: (municipios: any) => {
              rutaInfo.codCpDestino = null
              rutaInfo.Iddireccion = null
              rutaInfo.idTipoLlegada = null
              this.centroPobladoDestino = municipios.respuestaCentrosPoblados
            }
          })
        } else {
          this.centroPobladoDestino = []; rutaInfo.CodmunicipioDestino = null; rutaInfo.codCpDestino = null
          rutaInfo.Iddireccion = null
          rutaInfo.idTipoLlegada = null
        }
      }
    }
  }
  maestraTipoLlegada(paradaNueva?: ParadaNueva, rutaInfo?: RutaNueva2) {
    if (paradaNueva) {
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
    } else if (rutaInfo) {
      rutaInfo.idTipoLlegada = null
      rutaInfo.Iddireccion = null
    } else {
      this.servicioTerminales.maestraTiposLlegadas().subscribe({
        next: (respuesta: any) => {
          this.tipoLlegada = respuesta.respuestaTipoLLegada
        }
      })
    }

  }
  maestraDirecciones(rutaInfo?: RutaNueva2, cambio?:boolean) {
    if (this.rutaInfo.idTipoLlegada !== 'null') {
      console.log(this.rutaInfo.idTipoLlegada !== 'null')
      this.servicioTerminales.maestraDirecciones(this.rutaInfo.idTipoLlegada, this.rutaInfo.codCpDestino).subscribe({
        next: (respuesta: any) => {
          this.direcciones = respuesta.respuestaDirecciones
          if(cambio) this.rutaInfo.Iddireccion = null
        }
      })
    } else if (this.rutaInfo.idTipoLlegada === 'null') {
      this.direcciones = []
      this.rutaInfo.Iddireccion = null
      this.rutaInfo.idTipoLlegada = null
      console.log(this.rutaInfo.idTipoLlegada, this.rutaInfo.Iddireccion)
    }
  }
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

  /* ------------- ACCIONES ---------------- */
  manejarCp(rutaInfo: RutaNueva2) {
    rutaInfo.Iddireccion = null
    rutaInfo.idTipoLlegada = null
  }
  manejarDirecciones(rutaInfo?: RutaNueva2, paradaNueva?: ParadaNueva) {
    if (rutaInfo) {
      if (rutaInfo.Iddireccion === 'abrirModal') {
        this.abrirModalConSwal(Number(rutaInfo.idTipoLlegada), rutaInfo.codCpDestino, rutaInfo);
      }
      if (rutaInfo.Iddireccion === 'null' || rutaInfo.Iddireccion === 0) rutaInfo.Iddireccion = null
    }
    if (paradaNueva) {
      if (paradaNueva.direccion_id === 'abrirModal') {
        this.abrirModalConSwal(Number(paradaNueva.tipollegada_id), paradaNueva.centro_poblado_id, undefined, paradaNueva); // Si selecciona la opción de 'Añadir nueva dirección'
      }
      if (paradaNueva.direccion_id === 'null' || paradaNueva.direccion_id === 0) paradaNueva.direccion_id = null
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
        //console.log(JSONDatosDireccion)
        this.servicioTerminales.crearDireccion(JSONDatosDireccion).subscribe({
          next: (respuesta: any) => {
            //console.log(respuesta)
            if (rutaInfo) {
              this.direcciones = respuesta.respuestaDirecciones
              rutaInfo.Iddireccion = null
            } else if (paradaNueva) {
              paradaNueva.direcciones = respuesta.respuestaDirecciones
              paradaNueva.direccion_id = null
            }
            Swal.fire('¡Guardado!', 'La nueva dirección ha sido añadida.', 'success');
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
          Swal.fire('¡Clase eliminada!', 'success');
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
          Swal.fire('¡Parada eliminada!', 'success');
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
          Swal.fire({titleText:'¡Vía eliminada!', icon:'success'});
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

  agregarNuevaVia(via: string) {
    const JSONviaNueva = {
      codigoRuta: this.rutaInfo.idCodigoUnicoRuta,
      via: via,
      corresponde: 1,
      nuevaVia: via,
    }
    //console.log(JSONviaNueva)
    if (validarCampos(JSONviaNueva)) {
      Swal.fire({
        titleText: "¿Está usted seguro de agregar una vía nueva?",
        confirmButtonText: "Agregar",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicioTerminales.crearVia(JSONviaNueva).subscribe({
            next: (respuesta: any) => {
              this.obtenerRutaInfo()
              //console.log(this.vias)
              this.deshabilitarAgregarNuevo('via')
              Swal.fire('¡Vía creada!', 'La nueva va ha sido agregada.', 'success');
            }
          })
        } else if (result.isDismissed) {
          Swal.close()
        }
      })
    } else {
      //this.error = true
      Swal.fire('¡Información incompleta!', 'Por favor, complete la información de la nueva vía antes de agregarla.', 'error');
    }
  }

  agregarNuevaClase(clase: Clases) {
    const JSONClaseNueva = {
      idRuta: this.rutaInfo.idCodigoUnicoRuta,
      idClaseVehiculo: clase.tipo_vehiculo_id,
      estado: true
    }
    //console.log(JSONClaseNueva)
    if (validarCampos(JSONClaseNueva)) {
      Swal.fire({
        titleText: "¿Está usted seguro de agregar una clase nueva?",
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
              Swal.fire('¡Clase creada!', 'La nueva clase ha sido agregada.', 'success');
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
    //console.log(via)
    const JSONParadaNueva = {
      idRuta: this.rutaInfo.idCodigoUnicoRuta,
      centroPobladoId: via.paradaNueva.centro_poblado_id,
      direccionId: via.paradaNueva.direccion_id,
      estado: true,
      idVia: via.id
    }
    if (validarCampos(JSONParadaNueva)) {
      Swal.fire({
        titleText: "¿Está seguro de agregar una parada nueva?",
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
              Swal.fire('¡Parada creada!', 'La nueva parada ha sido agregada.', 'success');
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

  // ACCIONES VIAS ///////////////////////////////////////////////////////////////////////////////////////
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
  manejarTipoVehiculo(select: HTMLSelectElement, event: any, index?: any) {
    if (this.clases.length > 0) {
      if (this.clases.some((clase: Clases) => clase.tipo_vehiculo_id === Number(this.clase.tipo_vehiculo_id))) {
        this.clase.tipo_vehiculo_id = null
        select.value = ''
        event.preventDefault();
        //console.log(this.clase.tipo_vehiculo_id = null, event.preventDefault())
        Swal.fire('¡Advertencia!', 'Este tipo de vehículo ya existe, por favor seleccione otro.', 'warning');
      }
      if (this.clases.some((clase: Clases, i) => i !== index && clase.tipo_vehiculo_id === Number(event.target.value))) {
        if (select) select.value = ''
        event.preventDefault();
        this.clases[index].tipo_vehiculo_id = null
        Swal.fire('¡Advertencia!', 'Este tipo de vehículo ya existe, por favor seleccione otro.', 'warning');
      }
    }
  }

  // CREAR RUTA //////////////////////////////////////////////////////////////////////////////////////////
  crearRuta() {
    //console.log(this.rutaInfo)
    let JSONRutaNueva = {
      centroPobladoOrigen: this.rutaInfo.codCpOrigen,
      centroPobladoDestino: this.rutaInfo.codCpDestino,
      tipoLLegada: this.rutaInfo.idTipoLlegada,
      direccion: Number(this.rutaInfo.Iddireccion),
      rutaHabilitada: true,
      corresponde: 1,
      resolucion: this.rutaInfo.resolucionActual,
      resolucionActual: this.rutaInfo.resolucionActual,
      documento: this.rutaInfo.documento,
      nombreOriginal: this.rutaInfo.nombreOriginal,
      rutaArchivo: this.rutaInfo.rutaDocumento
    }
    console.log(JSONRutaNueva)
    if (validarCampos(JSONRutaNueva)) {
      Swal.fire({
        titleText: "¿Está seguro de agregar una ruta nueva?",
        text: "Después de agregar una ruta nueva, no podrá eliminarla.",
        confirmButtonText: "Agregar",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.servicioTerminales.crearRuta(JSONRutaNueva).subscribe({
            next: (respuesta: any) => {
              Swal.fire('¡Ruta creada!', 'La nueva ruta ha sido agregada.', 'success');
              this.rutaInfo.idRuta = respuesta.ids.id
              this.rutaInfo.idCodigoRuta = respuesta.ids.idRuta
              this.rutaInfo.idCodigoUnicoRuta = respuesta.ids.idUnicoRuta
            }
          })
        } else if (result.isDismissed) {
          Swal.close()
        }
      })
    } else {
      Swal.fire('¡Información incompleta!', 'Por favor, complete la información de la nueva ruta antes de crearla.', 'error');
    }
  }
  guardarRutaCompleta() {
    let JSONRutaNueva = {
      id: Number(this.rutaInfo.idRuta),
      idRuta: Number(this.rutaInfo.idCodigoRuta),
      idUnicoRuta: Number(this.rutaInfo.idCodigoUnicoRuta),
      centroPobladoOrigen: this.rutaInfo.codCpOrigen,
      centroPobladoDestino: this.rutaInfo.codCpDestino,
      tipoLLegada: this.rutaInfo.idTipoLlegada !== 0 ? Number(this.rutaInfo.idTipoLlegada) : null,
      direccion: Number(this.rutaInfo.Iddireccion) > 0 ? Number(this.rutaInfo.Iddireccion) : null,
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
    this.servicioTerminales.guardar(JSONRutaNueva).subscribe({
      next: (respuesta: any) => {
        Swal.fire({ icon: 'success', titleText: '¡Guardado exitosamente!' });
        this.router.navigate(['/administrar/terminales']);
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
