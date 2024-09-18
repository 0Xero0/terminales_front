import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[inputMoneda]'
})
export class InputMonedaDirective {

  constructor(private input: ElementRef<HTMLInputElement>, private renderizador: Renderer2) {
    this.renderizador.listen(input.nativeElement, 'keyup', () => this.manejarCambio())
  }

  manejarCambio() {
    if (this.input.nativeElement.value === '-') return;
    let commasRemoved = this.input.nativeElement.value.replace(/,/g, '');
    let toInt: number;
    let toLocale: string;
    if (commasRemoved.split('.').length > 1) {
      let decimal =isNaN(parseInt(commasRemoved.split('.')[1]))? '':parseInt(commasRemoved.split('.')[1]);
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('en-US') + '.' + decimal;
    } else {
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('en-US');
    }
    if (toLocale === 'NaN') {
      this.input.nativeElement.value = '';
    } else {
      this.input.nativeElement.value = toLocale;
    }
  }
}
