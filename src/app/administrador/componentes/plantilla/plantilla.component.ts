import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { BarraNavegacionComponent } from '../barra-navegacion/barra-navegacion.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css']
})
export class PlantillaComponent implements OnInit {
  @ViewChild('menuLateral') menuLateral!:MenuComponent
  @ViewChild('barraDeNavegacion') barraDeNavegacion!:BarraNavegacionComponent

  constructor(private servicioAutenticacion:AutenticacionService, private enrutador:Router) { }

  ngOnInit(): void {}

  public cerrarSesion():void{
    this.servicioAutenticacion.cerrarSesion();
    this.enrutador.navigateByUrl('/inicio-sesion')
  }

  public abrirMenuLateral(){
    this.menuLateral.abrir()
  }
}
