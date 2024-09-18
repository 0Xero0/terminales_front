import { Component, ViewChild } from '@angular/core';
import { ModalCrearAseguradoraComponent } from '../componentes/modal-crear-aseguradora/modal-crear-aseguradora.component';
import { ModalActualizarAseguradoraComponent } from '../componentes/modal-actualizar-aseguradora/modal-actualizar-aseguradora.component';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrosAseguradora } from '../Modelos/filtros';
import { AseguradoraModel } from '../Modelos/aseguradora';
import { AseguradoraService } from '../aseguradora.service';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';

@Component({
  selector: 'app-aseguradora',
  templateUrl: './aseguradora.component.html',
  styleUrls: ['./aseguradora.component.css']
})
export class AseguradoraComponent {

  @ViewChild('modalCrear') modalCrear!: ModalCrearAseguradoraComponent;
  @ViewChild('modalActualizar') modalActualizar!: ModalActualizarAseguradoraComponent;
  @ViewChild('popup') popup!: PopupComponent;
  paginador: Paginador<FiltrosAseguradora>;
  aseguradoras: AseguradoraModel[] = [];
  termino: string = '';
  constructor(private service: AseguradoraService) {
    this.paginador = new Paginador<FiltrosAseguradora>(this.obtenerAseguradoras);
  }

  ngOnInit(): void {
    this.paginador.inicializar(1, 5);
  }

  obtenerAseguradoras = (page: number, limit: number, filters?: FiltrosAseguradora) => {    
    //console.log("Entro");
    
    return new Observable<Paginacion>((subscribe) => {
      this.service.obtenerAseguradoras(page, limit, filters).subscribe({
        next: (resp) => {
          this.aseguradoras = resp.aseguradoras;   
          subscribe.next(resp.paginacion);
        },
      });
    });
  };

  modalCreate() {
    this.modalCrear.openModal();
  }

  modalUpdate(aseguradora: AseguradoraModel) {
    this.modalActualizar.openModal(aseguradora);
  }

  deleteClient(id?: number) {
    console.log(id);
  }

  actualizarFiltros() {
    this.paginador.filtrar({
      termino: this.termino,
    });
  }

  limpiarFiltros() {
    this.termino = '';
    this.paginador.filtrar({});
  }

  aseguradoraCreada() {
    this.paginador.refrescar();
    this.popup.abrirPopupExitoso('Aseguradora creada correctamente.');
  }
  aseguradoraActualizada() {
    this.paginador.refrescar();
    this.popup.abrirPopupExitoso('Aseguradora actualizada correctamente.');
  }
}
