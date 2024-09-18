import { AbstractControl, ValidatorFn } from '@angular/forms';

export function integerValidator(control: AbstractControl): { [key: string]: any } | null {
  if (control.value === null || control.value === '') {
    return null; // Si el valor está vacío, no hay violación de la regla
  }

  const intValue = parseInt(control.value, 10);
  if (isNaN(intValue) || !Number.isInteger(intValue)) {
    return { 'integer': { value: control.value } }; // El valor no es un número entero
  }

  return null; // El valor cumple con la regla
}