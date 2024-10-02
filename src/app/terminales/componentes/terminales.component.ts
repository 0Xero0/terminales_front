import { Component, Input, Output } from '@angular/core';
import { Ruta } from '../modelos/ruta';
import { Paradas } from '../modelos/paradas';
import { Clases } from '../modelos/clases';

@Component({
  selector: 'app-terminales',
  templateUrl: './terminales.component.html',
  styleUrls: ['./terminales.component.css']
})
export class TerminalesComponent {
  hayCambios: boolean = false
  verificacionVisible: boolean = false
  verificacionEditable: boolean = false
  editable: boolean = true
  aprobado: boolean = false

  usuario:{razonSocial:string,nRutas:number | null} = {razonSocial:'CARIBEÑA',nRutas:12}

  rutas:Array<Ruta> = []
  paradas:Array<Paradas> = []
  clases:Array<Clases> = []

  recibirHayCambios(hayCambios:boolean){
    this.hayCambios = hayCambios
  }

  recibirRutas(rutas:any){
    this.rutas = rutas
    console.log('Rutas: ',this.rutas)
  }

  recibirParada(paradas:any){
    this.paradas = paradas
    console.log('Paradas: ',this.paradas)
  }

  recibirClases(clases:any){
    this.clases = clases
    console.log('Clases: ',this.clases)
  }

  guardar(){}

  enviarST(){}

  volver(){

  }
}
