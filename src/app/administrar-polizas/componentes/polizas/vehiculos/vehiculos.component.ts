import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrosVehiculos } from 'src/app/administrar-polizas/modelos/FiltrosVehiculos';
import { VehiculoModel } from 'src/app/administrar-polizas/modelos/vehiculosModel';
import { ServicioAdministrarPolizas } from 'src/app/administrar-polizas/servicios/administrar-polizas.service';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent {

  private readonly paginaInicial = 1;
  private readonly limiteInicial = 10
  paginador: Paginador<FiltrosVehiculos>
  vehiculos: VehiculoModel[] = []
  id: string = ""

  termino: string = ""

  constructor(
    private servicio: ServicioAdministrarPolizas,
  ){ 
    const Usuario = JSON.parse(localStorage.getItem('UsuarioVigia')!)
    this.id = Usuario.id
   
    this.paginador = new Paginador<FiltrosVehiculos>(this.obtenerVehiculos)    
  }

  ngOnInit(): void {
    this.paginador.inicializar(this.paginaInicial, this.limiteInicial, {})
    
  }
  obtenerVehiculos = (pagina: number, limite: number, filtros?:FiltrosVehiculos)=>{
    return new Observable<Paginacion>( sub => {
      this.servicio.vehiculos(pagina, limite, filtros).subscribe({
        next: ( respuesta:any )=>{                  
          this.vehiculos = respuesta.placas          
          sub.next(respuesta.paginacion)
        }
      })
    })
  }

  exportarVehiculos = (pagina: number, limite: number, filtros?:FiltrosVehiculos)=>{
    
    this.servicio.exportar(pagina, limite, { termino: this.termino })
  }

  actualizarFiltros(){
    this.paginador.filtrar({ termino: this.termino })
  }

  limpiarFiltros(){
    this.termino = ""
    this.paginador.filtrar({ termino: this.termino })
  }

  setTermino(termino: string){
    this.termino = termino
  }

}
