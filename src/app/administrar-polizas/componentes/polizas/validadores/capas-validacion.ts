import { AbstractControl, ValidatorFn } from "@angular/forms";

export function capasValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null; // Si el valor está vacío, no hay violación de la regla
      }
      
      if (value != 1 && value != 2) {
        return { 'capas': { value: control.value } }; // El número excede la longitud máxima
      }
      
      return null; // El valor cumple con la regla
    };
}