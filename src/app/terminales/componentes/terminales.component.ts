import { Component, Input, OnInit, Output } from '@angular/core';
import { Ruta } from '../modelos/ruta';
import { Paradas } from '../modelos/paradas';
import { Clases } from '../modelos/clases';
import { Usuario } from 'src/app/usuarios/modelos/Usuario';

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

  rutas:Array<Ruta> = []
  paradas:Array<Paradas> = []
  clases:Array<Clases> = []

  constructor(){
    this.usuario = JSON.parse(localStorage.getItem('UsuarioVigia')!)
  }

  ngOnInit(){
    console.log(this.usuario)
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
