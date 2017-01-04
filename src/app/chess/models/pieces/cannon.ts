import { Piece } from './piece';
import { Point } from '../point';
import { PieceCamp } from '../../enum/piece-camp.enum';

export class Cannon extends Piece {
    constructor(id: string, camp: number, pos: Point, canvas: HTMLCanvasElement) {
        let type = camp === PieceCamp.White ? 'W_CANON' : 'B_CANON';
        let name = camp === PieceCamp.White ? '炮' : '砲';
        super(id, type, name, camp, pos, canvas);
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
        let blocks = 0;
        for (let i = 1; i < steps; i++) {
            blockPos.x += dx / steps;
            blockPos.y += dy / steps;
            if (this.board.findChess(blockPos) != null) {
                blocks++;
            }
        }
        return (blocks === 0 && targetChess == null) || (blocks === 1 && targetChess != null);
    }
}