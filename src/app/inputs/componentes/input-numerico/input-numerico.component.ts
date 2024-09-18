import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-numerico',
  templateUrl: './input-numerico.component.html',
  styleUrls: ['./input-numerico.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumericoComponent),
      multi: true
    }
  ]
})
export class InputNumericoComponent implements OnInit, ControlValueAccessor {
  @Input() cantidadDecimales: number = 3
  @Input() valorInicial: number | null = null;
  @Input() largoMaximo: number | null = null
  @Input() placeholder: string = ""; 

  valor: number | null = 0
  valorInput = ""
  valorAnterior: string = ""
  deshabilitado: boolean = false
  regex: RegExp

  constructor() {
    this.regex = new RegExp(`^[0-9]+(\\.[0-9]{0,${3}})?$`)
  }

  ngOnInit(): void {
    if(this.cantidadDecimales > 0){
      this.regex = new RegExp(`^[0-9]+(\\.[0-9]{0,${this.cantidadDecimales}})?$`)
    }else{
      this.regex = new RegExp(`^[0-9]+$`)
    }
    this.valorInput = this.valorInicial !== null ? this.valorInicial.toString() : "";
    this.valorAnterior = this.valorInicial !== null ? this.valorInicial.toString() : "";
  }

  alCambiarValor(valor: string) {
    if (!this.regex.test(valor) && valor !== "") {
      console.log('no cumple regex', valor, this.regex)
      this.valorInput = this.valorAnterior
      return;
    }
    if(valor !== ""){
      this.valorInput = Number(valor).toString()
    }
    this.valorAnterior = this.valorInput
    this.valor = this.valorInput !== "" ? Number(this.valorInput) : null
    this.onChange(this.valor)
  }

  //NgValueAccesor Interface
  onChange = (valor: number | null) => { }

  onTouched = () => { }

  writeValue(valor: number): void {
    this.valor = valor
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.deshabilitado = isDisabled
  }
}
