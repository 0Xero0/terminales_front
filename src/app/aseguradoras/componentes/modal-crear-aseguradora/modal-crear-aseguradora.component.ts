import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { AseguradoraModel } from '../../Modelos/aseguradora';
import { AseguradoraService } from '../../aseguradora.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';

@Component({
  selector: 'app-modal-crear-aseguradora',
  templateUrl: './modal-crear-aseguradora.component.html',
  styleUrls: ['./modal-crear-aseguradora.component.css']
})
export class ModalCrearAseguradoraComponent {

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('aseguradoraCreada') aseguradoraCreada: EventEmitter<void>;
  form: FormGroup;
  aseguradora?: AseguradoraModel;
  constructor(
    private serviceModal: NgbModal,
    private service: AseguradoraService
  ) {
    this.aseguradoraCreada = new EventEmitter<void>();
    this.form = new FormGroup({
      nit: new FormControl(undefined, [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      telefono: new FormControl(undefined),
     
    });
  }


  openModal() {
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  create() {
    if (this.form.invalid) {
      marcarFormularioComoSucio(this.form);
      return;
    }
    const controls = this.form.controls;
    this.service
      .crearAseguradora({
        nit: controls['nit'].value,
        nombre: controls['nombre'].value,
        direccion: controls['direccion'].value,
        telefono: controls['telefono'].value
      })
      .subscribe({
        next: () => {
           this.aseguradoraCreada.emit();
           this.clearForm();
           this.closeModal();
        },
        error: () => {
           this.popup.abrirPopupFallido("Error al crear la aseguradora", "Intente mas tarde.")
        },
      });
  }

  clearForm(){
    this.form.reset()
  }

  closeModal() {
    this.serviceModal.dismissAll();
  }
}
