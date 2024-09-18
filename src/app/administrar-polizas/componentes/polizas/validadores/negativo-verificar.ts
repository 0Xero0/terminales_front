import { AbstractControl, ValidatorFn } from "@angular/forms";

export function negativoValidar(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null; // Si el valor está vacío, no hay violación de la regla
      }
      
      if (value < 0) {
        return { 'negativo': { value: control.value } }; // El número es negativo
      }
      
      return null; // El valor cumple con la regla
    };
}