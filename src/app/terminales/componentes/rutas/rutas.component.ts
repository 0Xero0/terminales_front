import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Faltantes, MostrarRutas, Ruta, Ruta2, RutaFiltrada, RutaNueva } from '../../modelos/ruta';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { TerminalesService } from '../../servicios/terminales.service';
import { Paradas } from '../../modelos/paradas';
import { Clases } from '../../modelos/clases';
import Swal from 'sweetalert2';
import { validarCampos } from '../../validadores/validar-campos';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.css']
})
export class RutasComponent implements OnInit {
  @Output() hayCambios: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() rutasGuardar: EventEmitter<Array<Ruta2>> = new EventEmitter<Array<Ruta2>>();
  @Output() paradasGuardar: EventEmitter<Array<Paradas>> = new EventEmitter<Array<Paradas>>();
  @Output() clasesGuardar: EventEmitter<Array<Clases>> = new EventEmitter<Array<Clases>>();
  @Output() numeroRutas: EventEmitter<number> = new EventEmitter<number>();
  @Output() verificacionVisibleEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() verificacionEditableEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editableEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() aprobado?: boolean
  @Input() todoGuardado?: boolean
  @Input() faltantes?: Array<Faltantes>
  @Input() usuario?: Usuario | null
  verificacionVisible: boolean = false
  verificacionEditable: boolean = false
  editable: boolean = true
  rol?: { id: number, nombre: string }

  paradas: Paradas[] = []
  clases: Clases[] = []

  resolucionCorresponde: boolean = false

  rutas: Ruta2[] = [];
  rutaId: any
  rutaInfo?: Ruta
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
  rutasMostradas: MostrarRutas[] = []

  termino: any

  highlightID: number | null = null; // Para almacenar el ID resaltado temporalmente
  filteredID: any; // Para almacenar el ID buscado
  pageRutas: number = 1; // Variable para controlar la página actual
  itemsPerPageRutas: number = 5; // Variable para controlar la cantidad de registros mostrados por página

  constructor(
    private servicioArchivos: ServicioArchivos,
    private servicioTerminales: TerminalesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.rutaNueva = this.inicializarRutaNueva()
  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('UsuarioTerminales')!)
    this.rol = JSON.parse(localStorage.getItem('rolTerminales')!);
    this.obtenerCantidadRutas(this.usuario!.id)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.route.queryParams.subscribe((params: any) => {
      // Obtener los parámetros
      const idRuta = Number(params.idRuta);
      const revisada = params.revisada === 'true'; // Convertir a booleano

      // Leer el arreglo actual desde el localStorage
      const rutasRevisadas = JSON.parse(localStorage.getItem('rutasRevisadas') || '[]');

      // Verificar si el idRuta ya existe en el arreglo
      const existe = rutasRevisadas.some((ruta: any) => ruta.idRuta === idRuta);

      if (!existe) {
        // Agregar el nuevo objeto si no existe
        rutasRevisadas.push({ idRuta, revisada });
      }

      // Guardar el arreglo actualizado en el localStorage
      localStorage.setItem('rutasRevisadas', JSON.stringify(rutasRevisadas));
    });
    if (changes['todoGuardado']) {
      this.rutas = []
      this.listarRutas();
    }
  }

  filtrarRutas() {
    const lowerSearchText = this.filteredID.toLowerCase();
    const camposExcluidos = [
      'CoddepartamentoDestino', 'CoddepartamentoOrigen', 'CodmunicipioDestino',
      'CodmunicipioOrigen', 'codCpDestino', 'codCpOrigen',
      'idRuta', 'idCodigoRuta', 'idCodigoUnicoRuta','errorRutas','revisada'
    ]; // Reemplaza con los nombres de los campos a excluir

    this.rutasMostradas = this.rutas.map(ruta => {
      // Crear una copia del objeto excluyendo los campos no deseados
      const rutaFiltrada = Object.entries(ruta).reduce((obj, [key, value]) => {
        if (!camposExcluidos.includes(key)) {
          obj[key] = value;
        }
        return obj;
      }, {} as any);

      return rutaFiltrada;
    }).filter(ruta =>
      Object.values(ruta).some(value => {
        const valorCampo = value !== null && value !== undefined ? value.toString().toLowerCase() : '';
        return valorCampo.includes(lowerSearchText);
      })
    );
    console.log(this.rutas);
  }

  limpiar() {
    this.filteredID = null
    this.rutasMostradas = this.rutas.map((ruta: Ruta2) => ({
      departamentoDestino: ruta.departamentoDestino,
      departamentoOrigen: ruta.departamentoOrigen,
      municipioDestino: ruta.municipioDestino,
      municipioOrigen: ruta.municipioOrigen,
      descripcionDestino: ruta.descripcionDestino,
      descripcionOrigen: ruta.descripcionOrigen,
      numeroVias: ruta.numeroVias,
      index: ruta.index,
      revisada: ruta.revisada,
      errorRutas: ruta.errorRutas
    }))
  }

  crearNuevaRuta() {
    this.router.navigate(['/administrar', 'crear-ruta']);
  }

  revisarRuta(rutaMostrada: Ruta2) {
    rutaMostrada.errorRutas = false
    for(let ruta of this.rutas){
      if(ruta.index === rutaMostrada.index){
        const info = {
          ruta: ruta,
          editable:this.editable
        }
        this.router.navigate(['/administrar', 'revisar-ruta'], { state: { info } });
      }
    }
  }

  obtenerCantidadRutas(idUsuario: any) {
    this.servicioTerminales.cantidadRutas(idUsuario).subscribe({
      next: (respuesta: any) => {
        this.numeroRutas.emit(respuesta)
      }
    })
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

  listarRutas() {
    //console.log(this.usuario)
    const rutasRevisadas = JSON.parse(localStorage.getItem('rutasRevisadas') || '[]');
    this.servicioTerminales.listarRutas(this.usuario?.id).subscribe({
      next: (respuesta: any) => {
        console.log(this.rutasMostradas)
        // Actualizar "rutas" con los nuevos datos, restaurando "revisada" si existe
        this.rutas = respuesta.rutasVigilado.map((registro: any, index: any) => {
          const idRuta = registro.rutas.idRuta;
          // Buscar si existe una coincidencia por idRuta en el localStorage
          const rutaRevisada = rutasRevisadas.find((ruta: any) => ruta.idRuta === idRuta);
          return {
            ...registro.rutas, // Mantén los campos originales
            index: index + 1, // Agrega el campo "consecutivo"
            revisada: rutaRevisada ? rutaRevisada.revisada : false, // Usar el valor del localStorage si existe
          };
        });
        // Actualizar rutasMostradas para reflejar el estado completo
        this.rutasMostradas = [...this.rutas];

        // Actualizar otros valores
        this.rutasMostradas = this.rutas.map((ruta: Ruta2) => ({
          departamentoDestino: ruta.departamentoDestino,
          departamentoOrigen: ruta.departamentoOrigen,
          municipioDestino: ruta.municipioDestino,
          municipioOrigen: ruta.municipioOrigen,
          descripcionDestino: ruta.descripcionDestino,
          descripcionOrigen: ruta.descripcionOrigen,
          numeroVias: ruta.numeroVias,
          index: ruta.index,
          revisada: ruta.revisada,
          errorRutas: ruta.errorRutas
        }))
        this.editable = !respuesta.editable
        this.verificacionEditable = !respuesta.verificacionEditable
        this.verificacionVisible = respuesta.verificacionVisible

        // Emitir valores actualizados
        this.rutasGuardar.emit(this.rutas)
        this.editableEmit.emit(this.editable)

        console.log(this.rutasMostradas);
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(error.error.mensaje)
      }
    })
  }
  mostrarError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje || 'Ocurrió un error inesperado.',
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

  compararFaltantes(rutaMostrada: MostrarRutas): boolean {
    // Recorrer cada faltante devuelto al enviar al ST
    for (const faltante of this.faltantes!) {
      for (let ruta of this.rutas){
        if (faltante.idRuta === ruta.idRuta){
          if(rutaMostrada.index === ruta.index) {
            rutaMostrada.errorRutas = true
            return true
          }
        }
      }
      /* if (faltante.idRuta === id) {
        return true; // Devuelve true en cuanto encuentra una coincidencia
      } */
    }
    return false; // Si no encuentra coincidencias, devuelve false
  }
}
