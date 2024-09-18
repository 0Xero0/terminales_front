import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-archivo',
  templateUrl: './input-archivo.component.html',
  styleUrls: ['./input-archivo.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputArchivoComponent),
      multi: true
    }
  ]
})
export class InputArchivoComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>
  @Output('excedeTamano') excedeTamano: EventEmitter<void>
  @Input('nombre') nombre!: string
  @Input('acepta') acepta: string[] = []
  @Input('tamanoMaximoMb') tamanoMaximoMb?: number
  archivo?: File | null;
  disabled: boolean = false

  constructor() {
    this.excedeTamano = new EventEmitter<void>();
  }

  onChangeFiles = (evento: Event) => {
    if (!evento.target) {
      throw Error('El target del evento no es un input')
    }
    const input = evento.target as HTMLInputElement
    if (input.files) {
      const file = input.files.item(0)
      if(file && !this.tamanoValido(file)){
        this.excedeTamano.emit()
        return;
      }
      this.archivo = input.files.item(0)
      this.onChange(this.archivo)
    }
  }

  onChange = (archivo: File | null) => {}

  onTouched = () => { }

  writeValue(archivo: File | null): void {
    this.archivo = archivo
    if(!archivo && this.input){
      this.input.nativeElement.value = ""
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.archivo = null;
    if(this.input){
      this.input.nativeElement.value = ""
    }
    this.disabled = isDisabled
  }

  ngOnInit(): void {
  }

  unirAcepta(){
    return this.acepta.join(',')
  }

  removeFile(){
    if(this.input){
      this.archivo = null;
      this.input.nativeElement.value = ""
      this.onChange(this.archivo)
    }
  }

  manejarRemoverArchivo(event: Event){
    event.preventDefault();
    this.removeFile()
  }

  private tamanoValido(archivo: File): boolean{
    if(this.tamanoMaximoMb){
      return this.tamanoMaximoMb * 1048576 >= archivo.size ? true : false
    }else{
      return true
    }
  }

}
