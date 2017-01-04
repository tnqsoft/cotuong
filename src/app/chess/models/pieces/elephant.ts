import { Piece } from './piece';
import { Point } from '../point';
import { PieceCamp } from '../../enum/piece-camp.enum';

export class Elephant extends Piece {
    constructor(id: string, camp: number, pos: Point, canvas: HTMLCanvasElement) {
        let type = camp === PieceCamp.White ? 'W_ELEPHANT' : 'B_ELEPHANT';
        let name = camp === PieceCamp.White ? '相' : '象';
        super(id, type, name, camp, pos, canvas);
    }

    isTargetValid(pos: Point): boolean {
        if (!super.isTargetValid(pos)) {
            return false;
        }
        if (!this.board.isInsideCamp(pos, this.camp)) {
            return false;
        }
        let dx = pos.x - this.pos.x,
            dy = pos.y - this.pos.y;
        if (Math.abs(dx) !== 2 || Math.abs(dy) !== 2) {
            return false;
        }
        let blockPos = new Point(this.pos.x + dx / 2, this.pos.y + dy / 2);
        return this.board.findChess(blockPos) == null;
    }
}