import { Point } from '../point';
import { Rect } from '../rect';
import { environment } from '../../../../environments/environment';
import { PieceCamp } from '../../enum/piece-camp.enum';
import { Board } from '../board';

export class Piece {
    public id: string;
    public name: string;
    public pos: Point;
    public offsetRect: Rect;
    public isDragging: boolean;
    public camp: number; // PieceCamp.White, PieceCamp.Black
    public board: Board;
    public canvas: HTMLCanvasElement;
    public targetPos: Point;
    public targetIndicatorAlpha: number;
    public type: string;

    constructor(
            id: string,
            type: string,
            name: string,
            camp: number,
            pos: Point,
            canvas: HTMLCanvasElement
        ) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.camp = camp;
        this.board = null;
        this.pos = pos;
        this.canvas = canvas;

        this.isDragging = false;
        this.targetPos = null;
        this.targetIndicatorAlpha = 0.2;

        // Calculate Pos
        let left = environment.chess.layout.padding + environment.chess.layout.cell * this.pos.x - environment.chess.layout.cell / 2;
        let top = environment.chess.layout.padding + environment.chess.layout.cell * this.pos.y - environment.chess.layout.cell / 2;
        let right = left + environment.chess.layout.cell;
        let bottom = top + environment.chess.layout.cell;
        this.offsetRect = new Rect(left, top, right, bottom);
    }

    public draw(): void {
        let pieceStyle = environment.chess.style.piece[this.camp];

        let ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
        ctx.fillStyle = pieceStyle.background;
        ctx.strokeStyle = pieceStyle.border;
        ctx.font = pieceStyle.font;
        // The center of the circle
        let x = this.offsetRect.left + environment.chess.layout.cell / 2,
            y = this.offsetRect.top + environment.chess.layout.cell / 2;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        // Shadow
        if (this.isDragging) {
            ctx.arc(x + 2, y + 4, environment.chess.layout.chessRadius + 1, 0, 360);
        } else {
            ctx.arc(x + 1, y + 2, environment.chess.layout.chessRadius + 1, 0, 360);
        }
        ctx.fill();
        ctx.fillStyle = pieceStyle.background;
        ctx.closePath();
        // Translucent prompt position
        if (this.targetPos != null && this.targetIndicatorAlpha > 0) {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 128, 0, ' + this.targetIndicatorAlpha + ')';
            ctx.arc(
                environment.chess.layout.padding + this.targetPos.x * environment.chess.layout.cell,
                environment.chess.layout.padding + this.targetPos.y * environment.chess.layout.cell,
                environment.chess.layout.cell / 2, 0, 360);
            ctx.fill();
            ctx.fillStyle = environment.chess.style.piece[this.camp].background;
            ctx.closePath();
        }
        // Pieces ontology
        ctx.beginPath();
        ctx.arc(x, y, environment.chess.layout.chessRadius, 0, 360);
        ctx.fill();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(this.name, x + 1, y - pieceStyle.fontSize / 16 + 1);
        ctx.fillStyle = pieceStyle.fontColor;
        ctx.fillText(this.name, x, y - pieceStyle.fontSize / 16);
        ctx.stroke();
        ctx.closePath();
    }

    onMouseDown(point: Point): void {
        // if (this.parent.isMoving) return;
        if (this.board.mover === this.camp) {
            this.isDragging = true;
            this.board.moveChildToTop(this);
            this.board.redraw();
        }
    }

    onMouseMove(point: Point) {
        if (this.isDragging) {
            if (
                point.x <= 0 || point.x >= environment.chess.layout.offsetWidth ||
                point.y <= 0 || point.y >= environment.chess.layout.offsetHeight
                ) {
                this.isDragging = false;
                this.moveTo(this.pos);
                this.board.redraw();
                return;
            }

            let x = point.x - environment.chess.layout.cell / 2,
                y = point.y - environment.chess.layout.cell / 2;
            this.offsetRect.moveTo(x, y);
            let pos = this.point2chessPos(x, y);
            if (this.isTargetValid(pos)) {
                this.targetPos = pos;
            } else {
                this.targetPos = null;
            }
            this.board.redraw();
        }
    }

    onMouseUp(point: Point): void {
        if (this.isDragging) {
            this.isDragging = false;
            let pos = this.targetPos || this.pos;
            this.moveTo(pos);
            if (this.targetPos != null) {
                this.board.moveChess(this, pos);
            }
        }
    }

    hitTest(point: Point) {
        return this.offsetRect.isPointIn(point);
    }

    point2chessPos(x: number, y: number): Point {
        let newX = Math.ceil((x - environment.chess.layout.padding) / environment.chess.layout.cell);
        let newY = Math.ceil((y - environment.chess.layout.padding) / environment.chess.layout.cell);
        return new Point(newX, newY);
    }

    chessPos2point(x: number, y: number): void {}


    moveTo(pos: Point): void {
        this.board.isMoving = true;
        let left = environment.chess.layout.padding + environment.chess.layout.cell * pos.x - environment.chess.layout.cell / 2,
            top = environment.chess.layout.padding + environment.chess.layout.cell * pos.y - environment.chess.layout.cell / 2;
        let dx = left - this.offsetRect.left,
            dy = top - this.offsetRect.top;
        let t = 0,
            c = 15,
            _this = this;

        let timer = setInterval(function() {
            if (++t > c) {
                clearInterval(timer);
                _this.pos = pos;
                _this.offsetRect.moveTo(left, top);
                _this.targetPos = null;
                _this.targetIndicatorAlpha = 0.2;
                _this.board.isMoving = false;
                return;
            }
            let ratio = 0;
            if (t <= c / 2) {
                ratio = 2 * t / c;
                ratio = 1 - 0.5 * ratio * ratio * ratio * ratio;
            } else {
                ratio = 2 - 2 * t / c;
                ratio = 0.5 * ratio * ratio * ratio * ratio;
            }
            _this.offsetRect.moveTo(left - dx * ratio, top - dy * ratio);
            _this.targetIndicatorAlpha = 0.2 * ratio;
            _this.board.redraw();
        }, 40);
    }

    isTargetValid(pos: Point): boolean {
        if (!this.board.isValidPos(pos)) {
            return false;
        }
        let chess = this.board.findChess(pos);
        return chess == null || chess.camp !== this.camp;
    }

    autoMoveBackTo(pos: Point): void {
        this.targetPos = pos;
        this.moveTo(pos);
        if (this.targetPos != null) {
            this.board.moveChessWithoutRecored(this, pos);
        }
    }

    autoMoveTo(pos: Point): void {
        this.targetPos = pos;
        this.moveTo(pos);
        if (this.targetPos != null) {
            this.board.moveChess(this, pos);
        }
    }

}