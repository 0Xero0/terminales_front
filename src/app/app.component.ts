import { Component, HostListener, ViewChild } from '@angular/core';
import { ServicioApp } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin';

  constructor(private servicioApp: ServicioApp){}

  // HostListener para detectar el cierre de la pestaña principal
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any): void {
    /* console.log("La pestaña se está cerrando"); */
    this.servicioApp.closeAllOpenedWindows()
    /* event.returnValue = 'Aquí llegó' */

  }
}
