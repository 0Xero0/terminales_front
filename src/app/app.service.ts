import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ServicioApp {
  pestañasAbiertas:any[] = []

  llenarPestañasAbiertas(pestañas:any){
    this.pestañasAbiertas.push(pestañas)
    console.log(this.pestañasAbiertas)
  }

  // Método para cerrar todas las pestañas abiertas
  closeAllOpenedWindows(): void {
    console.log('Cerrando pestañas')
    if(this.pestañasAbiertas){/* Swal.fire({title: 'Aquí llega'}) */
      this.pestañasAbiertas.forEach((win: Window) => {
        if (win && !win.closed) {
          localStorage.removeItem("openTabs");
          win.close();
        }
      });
    }
  }
}
