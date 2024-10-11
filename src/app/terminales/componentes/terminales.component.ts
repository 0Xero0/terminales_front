import { Component, Input, OnInit, Output } from '@angular/core';
import { Ruta } from '../modelos/ruta';
import { Paradas } from '../modelos/paradas';
import { Clases } from '../modelos/clases';
import { Usuario } from 'src/app/usuarios/modelos/Usuario';
import { TerminalesService } from '../servicios/terminales.service';

@Component({
  selector: 'app-terminales',
  templateUrl: './terminales.component.html',
  styleUrls: ['./terminales.component.css']
})
export class TerminalesComponent implements OnInit{
  hayCambios: boolean = false
  verificacionVisible: boolean = false
  verificacionEditable: boolean = false
  editable: boolean = true
  aprobado: boolean = false

  usuario:Usuario
  cantidadRutas?: number

  rutas:Array<Ruta> = []
  paradas:Array<Paradas> = []
  clases:Array<Clases> = []

  constructor(private servicioTerminales: TerminalesService){
    this.usuario = JSON.parse(localStorage.getItem('UsuarioVigia')!)
  }

  ngOnInit(){
    this.obtenerCantidadRutas(this.usuario!.usuario)
    console.log(this.usuario)
  }
  obtenerCantidadRutas(idUsuario:any){
    this.servicioTerminales.cantidadRutas(idUsuario).subscribe({
      next: (respuesta: any) => {
        //console.log(respuesta)
        this.cantidadRutas = respuesta.totalRegistros
      }
    })
  }

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
