import { environment } from '../../../environments/environment';
import { Piece } from './pieces/piece';
import { Point } from './point';
import { PieceCamp } from '../enum/piece-camp.enum';
import { History } from './history';

export class Board {
    public canvas: HTMLCanvasElement;
    public pieces: Array<Piece> = [];
    public mover: number;
    public isMoving: boolean;
    public boardMap: Array<any>;
    public history: Array<History>;
    public campOrder: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.mover = PieceCamp.White;
        this.isMoving = false;
        this.campOrder = 1;

        this.history = [];
        this.boardMap = [];
        for (let i = 0; i < 9; i++) {
            this.boardMap[i] = [];
            for (let j = 0; j < 10; j++) {
                this.boardMap[i][j] = null;
            }
        }
        for (let i = 0; i < this.pieces.length; i++) {
            let child = this.pieces[i];
            if (child instanceof Piece && child.pos != null) {
                this.boardMap[child.pos.x][child.pos.y] = child;
            }
        }
    }

    draw(): void {
        let ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
        // Rectangular background of chessboard
        ctx.fillStyle = environment.chess.style.board.background;
        ctx.beginPath();
        ctx.rect(0, 0, environment.chess.layout.offsetWidth, environment.chess.layout.offsetHeight);
        ctx.fill();
        ctx.closePath();
        // line
        let p = environment.chess.layout.padding,
            s = environment.chess.layout.cell,
            w = environment.chess.layout.width,
            h = environment.chess.layout.height;
        ctx.strokeStyle = environment.chess.style.board.border;
        ctx.lineWidth = 2;
        ctx.beginPath();
        // 10 horizontal lines
        for (let i = 0; i < 10; i++) {
            ctx.moveTo(p, s * i + p);
            ctx.lineTo(w + p, s * i + p);
        }
        // Left and right edges
        ctx.moveTo(p, p);
        ctx.lineTo(p, h + p);
        ctx.moveTo(w + p, p);
        ctx.lineTo(w + p, h + p);
        // 7 broken vertical lines
        for (let i = 1; i < 8; i++) {
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

    redraw(): void {
        this.draw();
        this.eachChild(function(el: Piece) {
            el.draw();
        });
    }

    init(): void {
        this.draw();
        this.mouseHandle();
        for(let i: number = 0; i < this.pieces.length; i++) {
            this.pieces[i].draw();
        }
    }

    mouseHandle(): void {
        document.onmousedown = (e: MouseEvent) => {
            this.onMouseDown(this.getFixedMousePoint(e, this.canvas));
        };

        document.onmouseup = (e: MouseEvent) => {
            this.onMouseUp(this.getFixedMousePoint(e, this.canvas));
        };

        document.onmousemove = (e: MouseEvent) => {
            this.onMouseMove(this.getFixedMousePoint(e, this.canvas));
        };
    }

    onMouseDown(point: Point): void {
        this.eachChild(function(el: Piece) {
            if (el.hitTest(point)) {
                el.onMouseDown(point);
                return true;
            } else {
                return false;
            }
        }, true);
    }

    onMouseUp(point: Point): void {
        this.eachChild(function(el: Piece) {
            if (el.hitTest(point)) {
                el.onMouseUp(point);
                return true;
            } else {
                return false;
            }
        }, true);
    }

    onMouseMove(point: Point): void {
        this.eachChild(function(el: Piece) {
            return el.onMouseMove(point);
        }, true);
    }

    getFixedMousePoint(event: MouseEvent, dom: HTMLElement): Point {
        let x = event.pageX - dom.offsetLeft;
        let y = event.pageY - dom.offsetTop;

        return new Point(x, y);
    }

    moveChildToTop(child: Piece) {
        child = this.removeChild(child);
        if (child != null) {
            this.pieces.push(child);
        }
    }

    removeChild(child: Piece) {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i] == child) {
                return this.pieces.splice(i, 1)[0];
            }
        }
    }

    eachChild(callback: Function, reverse: boolean = false): void {
        if (reverse) {
            for (let i = this.pieces.length - 1; i >= 0; i--) {
                if (callback(this.pieces[i])) {
                    break;
                }
            }
        } else {
            for (let i = 0; i < this.pieces.length; i++) {
                if (callback(this.pieces[i])) {
                    break;
                }
            }
        }
    }

    removeChess(pos: Point) {
        this.boardMap[pos.x][pos.y] = null;
        let chess = this.findChess(pos);
        if (chess != null) {
            this.removeChild(chess);
        }
    }

    isValidPos(pos: Point): boolean {
        return pos != null && !this.isOutsideBoard(pos);
    }

    isOutsideBoard(pos: Point): boolean {
        return pos.x < 0 || pos.x >= 9 || pos.y < 0 || pos.y >= 10;
    }

    findChess(pos: Point): Piece {
        if (!this.isValidPos(pos)) {
            return null;
        }
        for (let i = 0; i < this.pieces.length; i++) {
            let child = this.pieces[i];
            if (child instanceof Piece && child.pos != null && child.pos.equals(pos)) {
                return child;
            }
        }
        return null;
    }

    moveChess(chess: Piece, pos: Point) {
        this.recordMove(chess, pos);
        this.removeChess(pos);
        this.boardMap[pos.x][pos.y] = chess;
        this.boardMap[chess.pos.x][chess.pos.y] = null;
        chess.pos = pos;
        this.mover = 1 - chess.camp;
        //this.computerMoveChess();

        if (this.isGameOver()) {
            if (this.mover === PieceCamp.Black || this.mover === PieceCamp.White) {
                alert('Congratulations, you win!');
            } else {
                alert('You lose!');
            }
            this.mover = -1;
            return;
        }
    }

    recordMove(chess: Piece, pos: Point): void {
        this.history.push(new History(chess.pos, pos, this.findChess(pos)));
    }

    restore(): void {
        if (this.history.length % 2 === 1 || this.history.length === 0) {
            return;
        }
        for (let i = 0; i < 2; ++i) {
            let move: History = this.history.pop();
            let chess: Piece = this.findChess(move.to);
            chess.autoMoveBackTo(move.from);
            if (move.target != null) {
                this.addChild(move.target);
                this.boardMap[move.to.x][move.to.y] = move.target;
                move.target.autoMoveBackTo(move.to);
            }
        }
        this.mover = 0;
    }

    moveChessWithoutRecored(chess: Piece, pos: Point): void {
        this.boardMap[pos.x][pos.y] = chess;
        if (!chess.pos.equals(pos)) {
            this.boardMap[chess.pos.x][chess.pos.y] = null;
            chess.pos = pos;
        }
    }

    addChild(child: Piece): void {
        if (!this.hasChild(child)) {
            this.pieces.push(child);
        }
        child.board = this;
    }

    hasChild(child: Piece): boolean {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i] === child) {
                return true;
            }
        }
        return false;
    }

    isInsidePalace(pos, camp): boolean {
        if (!this.isValidPos(pos)) {
            return false;
        }
        if (pos.x < 3 || pos.x > 5) {
            return false;
        }
        if (camp === this.campOrder) {
            return pos.y <= 2;
        } else {
            return pos.y >= 7;
        }
    }

    isGameOver(): boolean {
        let red = false,
            black = false;
        for (let i = 0; i < this.pieces.length; i++) {
            let child = this.pieces[i];
            if (child instanceof Piece) {
                if (child.type === 'W_KING') {
                    red = true;
                } else if (child.type === 'B_KING') {
                    black = true;
                }
                if (red && black) {
                    return false;
                }
            }
        }
        return true;
    }

    isInsideCamp(pos: Point, camp: number): boolean {
        if (!this.isValidPos(pos)) {
            return false;
        }
        if (camp === this.campOrder) {
            return pos.y <= 4;
        } else {
            return pos.y >= 5;
        }
    }

}