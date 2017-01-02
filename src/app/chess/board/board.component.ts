import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @ViewChild('board') private canvasElementRef: ElementRef;
  private canvas: HTMLCanvasElement;

  constructor() { }

  ngOnInit() {
    this.canvas = this.canvasElementRef.nativeElement;
    this.draw();
  }

  draw(): void {
    var boardId = "board";

    var board = {
      border: "#dcdcdc",
      background: "#fff",
      font: "36px 隶书"
    };

    var layout = {
      padding: 30,
      cell: 50,
      chessRadius: 20,
      fontSize: 36,
      width: 400,
      height: 450,
      offsetWidth: 460,
      offsetHeight: 510
    };

    let ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    // Rectangular background of chessboard
    ctx.fillStyle = board.background;
    ctx.beginPath();
    ctx.rect(0, 0, layout.offsetWidth, layout.offsetHeight);
    ctx.fill();
    ctx.closePath();
    // line
    var p = layout.padding,
      s = layout.cell,
      w = layout.width,
      h = layout.height;
    ctx.strokeStyle = board.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    // 10 horizontal lines
    for (var i = 0; i < 10; i++) {
      ctx.moveTo(p, s * i + p);
      ctx.lineTo(w + p, s * i + p);
    }
    // Left and right edges
    ctx.moveTo(p, p);
    ctx.lineTo(p, h + p);
    ctx.moveTo(w + p, p);
    ctx.lineTo(w + p, h + p);
    // 7 broken vertical lines
    for (var i = 1; i < 8; i++) {
      ctx.moveTo(s * i + p, p);
      ctx.lineTo(s * i + p, s * 4 + p);
      ctx.moveTo(s * i + p, s * 5 + p);
      ctx.lineTo(s * i + p, h + p);
    }
    // slash
    ctx.moveTo(s * 3 + p, p);
    ctx.lineTo(s * 5 + p, s * 2 + p);
    ctx.moveTo(s * 5 + p, 0 + p);
    ctx.lineTo(s * 3 + p, s * 2 + p);
    ctx.moveTo(s * 3 + p, s * 7 + p);
    ctx.lineTo(s * 5 + p, s * 9 + p);
    ctx.moveTo(s * 5 + p, s * 7 + p);
    ctx.lineTo(s * 3 + p, s * 9 + p);
    ctx.stroke();
    ctx.closePath();
  }
}