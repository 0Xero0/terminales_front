import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.css']
})
export class ValidacionComponent implements OnInit {
  @Input('texto') texto!:string
  @Input('control') control!: AbstractControl
  @Input('validacion') validacion!: string
  constructor() { }

  ngOnInit(): void {
  }

}
