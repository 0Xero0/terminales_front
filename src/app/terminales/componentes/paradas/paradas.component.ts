import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Paradas } from '../../modelos/paradas';
import { TerminalesService } from '../../servicios/terminales.service';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';

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
  @Input() paradas:Array<Paradas> = []
  @Input() verificacionVisible?: boolean
  @Input() verificacionEditable?: boolean
  @Input() editable?: boolean
  @Input() aprobado?: boolean
  nuevaParada?:Paradas

  tiposLlegada: Array<{ id: number, descripcion: string }> = []
  direcciones: Array<{ id: number, descripcion: string }> = []
  departamentos: Array<{ codigoDepartamento: number, nombre: string }> = []
  municipios: Array<{ codigoMunicipio: number, nombre: string }> = []
  centrosPoblados: Array<{ codigoCP: number, nombre: string }> = []


  private readonly paginaInicial = 1;
  private readonly limiteInicial = 5;

  constructor(private servicioTerminales: TerminalesService){
    this.nuevaParada = this.inicializarParadaNueva()
    //this.paginadorParadas = new Paginador<any>(this.listarParadas)
  }

  ngOnInit(): void {
    //this.listarParadas();  Inicializamos con un registro vacío
    this.paginadorParadas!.inicializar(this.paginaInicial, this.limiteInicial, {})
    this.maestraTipoLlegadas();
    this.maestraDepartamentos()
    this.maestrasParadas()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paradas']) {
      console.log('El array ha cambiado:', this.paradas);
      this.maestrasParadas(); // Llama a la función cuando el array cambie
    }
  }

  inicializarParadaNueva(): any { //Inicializa vacio los parametros de la ruta nueva
    return {

    };
  }

  maestrasParadas(){ //listamos las rutas que vienen de base de datos
    if(this.paradas){
      for(let i = 0;i < this.paradas.length; i++){//RECORREMOS LAS RUTAS
        if(this.paradas[i].codigo_departamento){//COMPROBAMOS QUE EXISTA UN DEPARTAMENTO Y SI EXISTE
          this.maestraMunicipios(this.paradas[i].codigo_departamento,i,'municipio'+i,1)//CONSULTAMOS EL MUNICIPIO CORRESPONDIENTE
        }
        if(this.paradas[i].codigo_municipio){//COMPROBAMOS QUE EXISTA UN MUNICIPIO Y SI EXISTE
          this.maestraCP(this.paradas[i].codigo_municipio,i,'cp'+i,1)//CONSULTAMOS EL CENTRO POBLADO CORRESPONDIENTE
        }
        if(this.paradas[i].tipo_llegada_id){//COMPROBAMOS QUE EXISTA UN TIPO DE LLEGADA Y SI EXISTE
          this.maestraDireccion(this.paradas[i].tipo_llegada_id,i,1)//CONSULTAMOS LA DIRECCIÓN CORRESPONDIENTE
        }
      }
    }
    console.log(this.paradas)
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

  maestraMunicipios(codigo_departamento: any,index:number, nombre: string, tipo: number) { // MAESTRA DE MUNICIPIOS
    const id_departamento = codigo_departamento
    const selectElement = document.getElementById(nombre) as HTMLSelectElement;
    //console.log(id_departamento)
    if (id_departamento !== 'null') {
      this.servicioTerminales.maestraMunicipios(id_departamento).subscribe({
        next: (municipios: any) => {
          //console.log(municipios)
          //selectElement.disabled = false
          if (tipo === 1) {
            this.paradas[index].municipios = []; this.paradas[index].codigo_municipio = null
            this.paradas[index].municipios = municipios.respuestaMunicipios
            this.paradas[index].codigo_departamento = id_departamento
            this.manejarCambios()
          }
          if (tipo === 2) {
            this.municipios = []
            this.municipios = municipios.respuestaMunicipios
          }
        }
      })
    } else {
      //selectElement.disabled = true;
      if (tipo === 1) {
        this.paradas[index].municipios = []; this.paradas[index].codigo_municipio = null
        this.maestraCP('null',index, 'cp origen', tipo)
        this.paradas[index].codigo_departamento = null
      }
      if (tipo === 2) {
        this.municipios = []
        this.maestraCP('null', index, 'cp destino', tipo)
      }
    }
  }

  maestraCP(codigo_municipio: any, index:number, nombre: string, tipo: number) { // MAESTRA DE CENTROS POBLADOS
    let codigoMunicipio = codigo_municipio
    const selectElement = document.getElementById(nombre) as HTMLSelectElement;
    //console.log(codigoMunicipio)
    if (codigoMunicipio !== 'null') {
      this.servicioTerminales.maestraCentrosPoblados(codigoMunicipio).subscribe({
        next: (respuesta: any) => {
          //console.log(respuesta)
          //selectElement.disabled = false
          if (tipo === 1) {
            this.paradas[index].centrosPoblados = []; this.paradas[index].codigo_cp = null
            this.paradas[index].centrosPoblados = respuesta.respuestaCentrosPoblados
            this.paradas[index].codigo_municipio = codigoMunicipio
            this.manejarCambios()
          }
          if (tipo === 2) {
            this.centrosPoblados = []
            this.centrosPoblados = respuesta.respuestaCentrosPoblados
          }
        }
      })
    } else {
      //selectElement.disabled = true;
      if (tipo === 1) {
        this.paradas[index].centrosPoblados = []; this.paradas[index].codigo_cp = null
        this.paradas[index].codigo_municipio = null
        this.manejarCambios()
      }
      if (tipo === 2) { this.centrosPoblados = []; this.nuevaParada!.codigo_cp = null }
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

  maestraDireccion(id: any, index?: any, tipo?: number) { // MAESTRA DE DIRECCIONES
    //console.log(id, index)
    const idLlegada = Number(id)
    if (id !== 'null') {
      this.servicioTerminales.maestraDirecciones(id).subscribe({
        next: (respuesta: any) => {
          //console.log(respuesta)
          if (tipo === 1) {
            this.paradas[index].direcciones = []; //this.rutas[index].direccion_id = null
            this.paradas[index].direcciones = respuesta.respuestaDirecciones
            this.paradas[index].tipo_llegada_id = idLlegada
            this.manejarCambios()
          } else if (tipo === 2) {
            this.direcciones = []; this.nuevaParada!.direccion_id = null
            this.direcciones = respuesta.respuestaDirecciones
            this.nuevaParada!.tipo_llegada_id = idLlegada
          }
        }
      })
    } else {
      if (tipo === 1) {
        this.paradas[index].tipo_llegada_id = null;
        this.paradas[index].direccion_id = null
        this.paradas[index].direcciones = []
        this.manejarCambios()
      }
      if (tipo === 2) {
        this.nuevaParada!.tipo_llegada_id = null;
        this.nuevaParada!.direccion_id = null;
        this.direcciones = []
      }
    }
    //console.log(this.rutas, this.rutaNueva)

  }

  manejarCambios() {
    this.hayCambios.emit(true)
    this.paradasGuardar.emit(this.paradas)
  }
}
