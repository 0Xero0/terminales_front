import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';



@NgModule({
  declarations: [
    FechaPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe
  ]
})
export class PipesModule { }
