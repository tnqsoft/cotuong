import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessComponent } from './chess.component';
import { BoardComponent } from './board/board.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ChessComponent,
    BoardComponent
  ],
  exports: [
    ChessComponent,
  ]
})
export class ChessModule { }