export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }

    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    equals(point: Point): boolean {
        return this.x === point.x && this.y === point.y;
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}