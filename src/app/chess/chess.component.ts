import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Board } from './models/board';
import { PieceCamp } from './enum/piece-camp.enum';
import { General } from './models/pieces/general';
import { Point } from './models/point';
import { Chariot } from './models/pieces/chariot';
import { Guard } from './models/pieces/guard';
import { Cannon } from './models/pieces/cannon';
import { Elephant } from './models/pieces/elephant';
import { Horse } from './models/pieces/horse';
import { Pawn } from './models/pieces/pawn';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {

  @ViewChild('board') private canvasElementRef: ElementRef;
  private canvas: HTMLCanvasElement;

  private board: Board;

  constructor() { }

  ngOnInit() {
    this.canvas = this.canvasElementRef.nativeElement;
    this.board = new Board(this.canvas);

    // Add Pieces
    // Camp White
    this.board.addChild(new General('general01', PieceCamp.White, new Point(4, 9), this.canvas));
    this.board.addChild(new Guard('guard011', PieceCamp.White, new Point(3, 9), this.canvas));
    this.board.addChild(new Guard('guard012', PieceCamp.White, new Point(5, 9), this.canvas));
    this.board.addChild(new Elephant('elephant011', PieceCamp.White, new Point(2, 9), this.canvas));
    this.board.addChild(new Elephant('elephant012', PieceCamp.White, new Point(6, 9), this.canvas));
    this.board.addChild(new Chariot('chariot011', PieceCamp.White, new Point(0, 9), this.canvas));
    this.board.addChild(new Chariot('chariot012', PieceCamp.White, new Point(8, 9), this.canvas));
    this.board.addChild(new Cannon('cannon011', PieceCamp.White, new Point(1, 7), this.canvas));
    this.board.addChild(new Cannon('cannon012', PieceCamp.White, new Point(7, 7), this.canvas));
    this.board.addChild(new Horse('horse011', PieceCamp.White, new Point(1, 9), this.canvas));
    this.board.addChild(new Horse('horse012', PieceCamp.White, new Point(7, 9), this.canvas));
    this.board.addChild(new Pawn('pawn011', PieceCamp.White, new Point(0, 6), this.canvas));
    this.board.addChild(new Pawn('pawn012', PieceCamp.White, new Point(2, 6), this.canvas));
    this.board.addChild(new Pawn('pawn013', PieceCamp.White, new Point(4, 6), this.canvas));
    this.board.addChild(new Pawn('pawn014', PieceCamp.White, new Point(6, 6), this.canvas));
    this.board.addChild(new Pawn('pawn015', PieceCamp.White, new Point(8, 6), this.canvas));
    // Camp Black
    this.board.addChild(new General('general02', PieceCamp.Black, new Point(4, 0), this.canvas));
    this.board.addChild(new Guard('guard021', PieceCamp.Black, new Point(3, 0), this.canvas));
    this.board.addChild(new Guard('guard022', PieceCamp.Black, new Point(5, 0), this.canvas));
    this.board.addChild(new Elephant('elephant021', PieceCamp.Black, new Point(2, 0), this.canvas));
    this.board.addChild(new Elephant('elephant022', PieceCamp.Black, new Point(6, 0), this.canvas));
    this.board.addChild(new Chariot('chariot021', PieceCamp.Black, new Point(0, 0), this.canvas));
    this.board.addChild(new Chariot('chariot022', PieceCamp.Black, new Point(8, 0), this.canvas));
    this.board.addChild(new Cannon('cannon021', PieceCamp.Black, new Point(1, 2), this.canvas));
    this.board.addChild(new Cannon('cannon022', PieceCamp.Black, new Point(7, 2), this.canvas));
    this.board.addChild(new Horse('horse021', PieceCamp.Black, new Point(1, 0), this.canvas));
    this.board.addChild(new Horse('horse022', PieceCamp.Black, new Point(7, 0), this.canvas));
    this.board.addChild(new Pawn('pawn021', PieceCamp.Black, new Point(0, 3), this.canvas));
    this.board.addChild(new Pawn('pawn022', PieceCamp.Black, new Point(2, 3), this.canvas));
    this.board.addChild(new Pawn('pawn023', PieceCamp.Black, new Point(4, 3), this.canvas));
    this.board.addChild(new Pawn('pawn024', PieceCamp.Black, new Point(6, 3), this.canvas));
    this.board.addChild(new Pawn('pawn025', PieceCamp.Black, new Point(8, 3), this.canvas));

    // Initial Board
    this.board.init();
  }

  backStep() {
    this.board.restore();
  }

}