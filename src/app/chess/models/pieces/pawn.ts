import { Piece } from './piece';
import { Point } from '../point';
import { PieceCamp } from '../../enum/piece-camp.enum';

export class Pawn extends Piece {
    constructor(id: string, camp: number, pos: Point, canvas: HTMLCanvasElement) {
        let type = camp === PieceCamp.White ? 'W_PAWN' : 'B_PAWN';
        let name = camp === PieceCamp.White ? '兵' : '卒';
        super(id, type, name, camp, pos, canvas);
    }

    isTargetValid(pos: Point): boolean {
        if (!super.isTargetValid(pos)) {
            return false;
        }
        let dx = pos.x - this.pos.x,
            dy = pos.y - this.pos.y;
        if (this.board.isInsideCamp(pos, this.camp) && dx !== 0) {
            return false;
        }
        if (this.camp === this.board.campOrder && dy < 0) {
            return false;
        } else if (this.camp !== this.board.campOrder && dy > 0) {
            return false;
        }
        if (Math.abs(dx) + Math.abs(dy) !== 1) {
            return false;
        }
        return true;
    }
}