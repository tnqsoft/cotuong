import { Piece } from './piece';
import { Point } from '../point';

export class General extends Piece {
    constructor(id: string, pos: Point, canvas: HTMLCanvasElement) {
        super(id, '將', pos, canvas);
    }
}