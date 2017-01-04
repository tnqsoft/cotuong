import { Point } from './point';
import { Piece } from './pieces/piece';

export class History {
    public from: Point;
    public to: Point;
    public target: Piece;

    constructor(from: Point, to: Point, target: Piece) {
        this.from = from;
        this.to = to;
        this.target = target;
    }
}
