import { Point } from '../point';
import { Rect } from '../rect';
import { BoardConfig } from '../../board/board-config.enum';

export class Piece {
    public id: string;
    public name: string;
    public pos: Point;
    public offsetRect: Rect;
    public isDragging: boolean;
    public canvas: HTMLCanvasElement;

    // public targetPos: Point;

    constructor(id: string, name: string, pos: Point, canvas: HTMLCanvasElement) {
        this.id = id;
        this.name = name;
        this.pos = pos;
        this.canvas = canvas;

        let left = BoardConfig.LayoutPadding + BoardConfig.LayoutCell * this.pos.x - BoardConfig.LayoutCell / 2;
        let top = BoardConfig.LayoutPadding + BoardConfig.LayoutCell * this.pos.y - BoardConfig.LayoutCell / 2;
        let right = left + BoardConfig.LayoutCell;
        let bottom = top + BoardConfig.LayoutCell;
        this.offsetRect = new Rect(left, top, right, bottom);

        this.isDragging = false;
    }

    public draw(): void {
        let background = '#fff';
        let border = '#dcdcdc';
        let font = '24px 隶书';
        let fontColor = '#000';

        let ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
        ctx.fillStyle = background;
        ctx.strokeStyle = border;
        ctx.font = font;
        // The center of the circle
        let x = this.offsetRect.left + BoardConfig.LayoutCell / 2,
            y = this.offsetRect.top + BoardConfig.LayoutCell / 2;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        // Shadow
        // if (this.isDragging) {
        //     ctx.arc(x + 2, y + 4, layout.chessRadius + 1, 0, 360);
        // } else {
        //     ctx.arc(x + 1, y + 2, layout.chessRadius + 1, 0, 360);
        // }
        ctx.fill();
        ctx.fillStyle = background;
        ctx.closePath();
        // Translucent prompt position
        // if (this.targetPos != null && this.targetIndicatorAlpha > 0) {
        //     ctx.beginPath();
        //     ctx.fillStyle = 'rgba(0, 128, 0, ' + this.targetIndicatorAlpha + ')';
        //     ctx.arc(BoardConfig.LayoutPadding + this.targetPos.x * BoardConfig.LayoutCell, BoardConfig.LayoutPadding + this.targetPos.y * BoardConfig.LayoutCell, BoardConfig.LayoutCell / 2, 0, 360);
        //     ctx.fill();
        //     ctx.fillStyle = style.chess[this.camp].background;
        //     ctx.closePath();
        // }
        // Pieces ontology
        ctx.beginPath();
        ctx.arc(x, y, BoardConfig.LayoutChessRadius, 0, 360);
        ctx.fill();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(this.name, x + 1, y - BoardConfig.LayoutFontSize / 16 + 1);
        ctx.fillStyle = fontColor;
        ctx.fillText(this.name, x, y - BoardConfig.LayoutFontSize / 16);
        ctx.stroke();
        ctx.closePath();
    }
}