import { Piece } from './piece';
import { Point } from '../point';
import { PieceCamp } from '../../enum/piece-camp.enum';

export class Chariot extends Piece {
    constructor(id: string, camp: number, pos: Point, canvas: HTMLCanvasElement) {
        let type = camp === PieceCamp.White ? 'W_CAR' : 'B_CAR';
        super(id, type, '車', camp, pos, canvas);
    }

    isTargetValid(pos: Point): boolean {
        if (!super.isTargetValid(pos)) {
            return false;
        }
        let dx = pos.x - this.pos.x,
            dy = pos.y - this.pos.y;
        if (dx !== 0 && dy !== 0) {
            return false;
        }
        let targetChess = this.board.findChess(pos);
        let steps = Math.max(Math.abs(dx), Math.abs(dy));
        let blockPos = new Point(this.pos.x, this.pos.y);
        for (let i = 1; i < steps; i++) {
            blockPos.x += dx / steps;
            blockPos.y += dy / steps;
            if (this.board.findChess(blockPos) != null) {
                return false;
            }
        }
        return true;
    }
}