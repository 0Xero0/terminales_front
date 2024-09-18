import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaComponent implements OnInit {
  @Input('tipo') tipo!: 'peligro' | 'advertencia' | 'informacion' | 'completado'

  clases = {
    'alerta-peligro': this.tipo == 'peligro',
    'alerta-advertencia': this.tipo == 'advertencia',
    'alerta-informacion': this.tipo == 'informacion',
    'alerta-completado': this.tipo == 'completado',
  }

  constructor() { }

  ngOnInit(): void {
    this.clases = {
      'alerta-peligro': this.tipo == 'peligro',
      'alerta-advertencia': this.tipo == 'advertencia',
      'alerta-informacion': this.tipo == 'informacion',
      'alerta-completado': this.tipo == 'completado',
    }
  }

}
