import { Piece } from './piece';
import { Point } from '../point';
import { PieceCamp } from '../../enum/piece-camp.enum';

export class Guard extends Piece {
    constructor(id: string, camp: number, pos: Point, canvas: HTMLCanvasElement) {
        let type = camp === PieceCamp.White ? 'W_BISHOP' : 'B_BISHOP';
        let name = camp === PieceCamp.White ? '士' : '仕';
        super(id, type, name, camp, pos, canvas);
    }

    isTargetValid(pos: Point): boolean {
        if (!super.isTargetValid(pos)) {
            return false;
        }
        if (!this.board.isInsidePalace(pos, this.camp)) {
            return false;
        }
        let dx = pos.x - this.pos.x,
            dy = pos.y - this.pos.y;
        if (Math.abs(dx) !== 1 || Math.abs(dy) !== 1) {
            return false;
        }
        return true;
    }
}