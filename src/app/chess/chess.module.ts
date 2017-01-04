import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessComponent } from './chess.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ChessComponent,
  ],
  exports: [
    ChessComponent,
  ]
})
export class ChessModule { }