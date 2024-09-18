import { AbstractControl, ValidatorFn } from "@angular/forms";

export function maxLengthNumberValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null; // Si el valor está vacío, no hay violación de la regla
      }
      
      const stringValue = value.toString();
      if (stringValue.length > maxLength) {
        return { 'maxLengthNumber': { value: control.value } }; // El número excede la longitud máxima
      }
      
      return null; // El valor cumple con la regla
    };
  }