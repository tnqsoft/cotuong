import { Piece } from './piece';
import { Point } from '../point';
import { PieceCamp } from '../../enum/piece-camp.enum';

export class General extends Piece {
    constructor(id: string, camp: number, pos: Point, canvas: HTMLCanvasElement) {
        let type = camp === PieceCamp.White ? 'W_KING' : 'B_KING';
        super(id, type, '將', camp, pos, canvas);
    }

    isTargetValid(pos: Point): boolean {
        if (!super.isTargetValid(pos)) {
            return false;
        }
        let x, y;
        let target = this.board.boardMap[pos.x][pos.y];
        if (target != null) {
            // alert(target.type);
            if (this.type == 'W_KING' && target.type == 'B_KING') {
                if (this.pos.x !== pos.x) {
                    return false;
                }
                for (x = this.pos.x, y = this.pos.y - 1; y > 0 && this.board.boardMap[x][y] === null; --y) {};
                if (y >= 0 && this.board.boardMap[x][y].type === 'B_KING') {
                    return true;
                }
            } else if (this.type === 'B_KING' && target.type === 'W_KING') {
                if (this.pos.x !== pos.x) {
                    return false;
                }
                for (x = this.pos.x, y = this.pos.y + 1; y < 10 && this.board.boardMap[x][y] === null; ++y) {};
                if (y < 10 && this.board.boardMap[x][y].type === 'W_KING') {
                    return true;
                }
            }
        }
        if (!this.board.isInsidePalace(pos, this.camp)) {
            return false;
        }
        let dx = pos.x - this.pos.x,
            dy = pos.y - this.pos.y;
        if (Math.abs(dx) + Math.abs(dy) !== 1) {
            return false;
        }
        return true;
    }
}