import { AbstractControl, ValidatorFn } from "@angular/forms";

export function polizasIgualesValidar(poliza:any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null; // Si el valor está vacío, no hay violación de la regla
      }
      
      if (value === poliza) {
        return { 'igual': { value: control.value } }; // Las polizas son iguales
      }
      
      return null; // El valor cumple con la regla
    };
}