import { Component, EventEmitter, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-busqueda',
  templateUrl: './input-busqueda.component.html',
  styleUrls: ['./input-busqueda.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputBusquedaComponent),
      multi: true
    }
  ]
})
export class InputBusquedaComponent implements OnInit, ControlValueAccessor{
  texto: string = ""
  estaDeshabilitado: boolean = false

  constructor() {
  }

  ngOnInit(): void {
  }

  manejar(texto: string){
    this.texto = texto
    this.onChange(texto)
  }

  

  //Control value accesor interface
  onChange = (texto: string)=>{}

  onTouched = ()=>{}

  writeValue(texto: string): void {
    this.texto = texto
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this.estaDeshabilitado = isDisabled
  }

}
