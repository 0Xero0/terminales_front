import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { AseguradoraModel } from '../../Modelos/aseguradora';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AseguradoraService } from '../../aseguradora.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';

@Component({
  selector: 'app-modal-actualizar-aseguradora',
  templateUrl: './modal-actualizar-aseguradora.component.html',
  styleUrls: ['./modal-actualizar-aseguradora.component.css']
})
export class ModalActualizarAseguradoraComponent {

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('popup') popup!: PopupComponent
  @Output('aseguradoraActualizada') aseguradoraActualizada: EventEmitter<void>;
  form: FormGroup;
  aseguradora?: AseguradoraModel;
  constructor(
    private serviceModal: NgbModal,
    private service: AseguradoraService
  ) {
    this.aseguradoraActualizada = new EventEmitter<void>();
    this.form = new FormGroup({
      nit: new FormControl(undefined, [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),
      telefono: new FormControl(undefined),
    });
  }


  openModal(aseguradora:AseguradoraModel) {
    this.aseguradora = aseguradora
    this.fillForm(aseguradora);    
    this.serviceModal.open(this.modal, {
      size: 'xl',
    });
  }

  fillForm(aseguradora:AseguradoraModel){
    const controls = this.form.controls
    controls['nit'].setValue(aseguradora.nit)
    controls['nombre'].setValue(aseguradora.nombre)
    controls['direccion'].setValue(aseguradora.direccion)
    controls['telefono'].setValue(aseguradora.telefono)
  }

  update() {
    if (this.form.invalid) {
      marcarFormularioComoSucio(this.form);
      return;
    }
    const controls = this.form.controls;
    this.service
      .actualizarAseguradora({
        id: this.aseguradora?.id,
        nit: controls['nit'].value,
        nombre: controls['nombre'].value,
        direccion: controls['direccion'].value,
        telefono: controls['telefono'].value
      })
      .subscribe({
        next: () => {
           this.aseguradoraActualizada.emit();
           this.closeModal()
        },
        error: () => {
           this.popup.abrirPopupFallido("Error al actualizar lña aseguradora", "Intente mas tarde.")
        },
      });
  }


  closeModal() {
    this.serviceModal.dismissAll();
  }

  clearForm(){
    this.form.reset()
  }
}
