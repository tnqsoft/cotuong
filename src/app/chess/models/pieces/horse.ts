import { Piece } from './piece';
import { Point } from '../point';
import { PieceCamp } from '../../enum/piece-camp.enum';

export class Horse extends Piece {
    constructor(id: string, camp: number, pos: Point, canvas: HTMLCanvasElement) {
        let type = camp === PieceCamp.White ? 'W_HORSE' : 'B_HORSE';
        let name = '馬';
        super(id, type, name, camp, pos, canvas);
    }

    isTargetValid(pos: Point): boolean {
        if (!super.isTargetValid(pos)) {
            return false;
        }
        let dx = pos.x - this.pos.x,
            dy = pos.y - this.pos.y;
        if (dx === 0 || dy === 0 || Math.abs(dx) + Math.abs(dy) !== 3) {
            return false;
        }
        let targetChess = this.board.findChess(pos);
        let blockPos = new Point(this.pos.x, this.pos.y);
        if (Math.abs(dx) === 2) {
            blockPos.x += dx / 2;
        } else {
            blockPos.y += dy / 2;
        }
        return this.board.findChess(blockPos) == null;
    }
}