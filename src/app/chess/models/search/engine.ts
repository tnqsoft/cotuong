import { Piece } from '../pieces/piece';
import { Point } from '../point';

export abstract class Engine {
    public currentMap: Array<any>;
    public searchDepth: number;
    public evaluator: null;
    public moveGen: null;
    public bestMove: null;
    public maxDepth: number;

    constructor() {
        this.searchDepth = 3;
        this.evaluator = null;
        this.moveGen = null;
        this.bestMove = null;
        this.maxDepth = null;

        this.currentMap = new Array();
        for (let i = 0; i < 9; ++i) {
            this.currentMap[i] = new Array();
            for (let j = 0; j < 10; ++j) {
                this.currentMap[i][j] = null;
            }
        }
    }

    abstract searchAGoodMove();

    setSearchDepth(depth: number): void {
        this.searchDepth = depth;
    }

    setEvaluator(evaluator): void {
        this.evaluator = evaluator;
    }

    setMoveGenerator(MG): void {
        this.moveGen = MG;
    }

    makeMove(move): Piece {
        let chess = this.currentMap[move.to.x][move.to.y];
        this.currentMap[move.to.x][move.to.y] = this.currentMap[move.from.x][move.from.y];
        this.currentMap[move.from.x][move.from.y] = null;
        return chess;
    }

    unMakeMove(move, chess: Piece) {
        this.currentMap[move.from.x][move.from.y] = this.currentMap[move.to.x][move.to.y];
        this.currentMap[move.to.x][move.to.y] = chess;
    }

    mapCopy(map) {
        for (let i = 0; i < 9; ++i) {
            for (let j = 0; j < 10; ++j) {
                let chess: Piece = map[i][j];
                if (chess != null) {
                    this.currentMap[i][j] = new Piece(
                        chess.id,
                        chess.type,
                        chess.name,
                        chess.camp,
                        new Point(chess.pos.x, chess.pos.y),
                        chess.canvas
                    );
                } else {
                    this.currentMap[i][j] = null;
                }
            }
        }
    }

    isGameOver(map, depth): number {
        let red = false,
            black: any = false;
        for (let j = 7; j < 10; ++j) {
            for (let i = 3; i < 6; ++i) {
                if (map[i][j] != null) {
                    if (map[i][j].type === 'B_KING') {
                        black = true;
                    }
                    if (map[i][j].type === 'W_KING') {
                        red = true;
                    }
                }
            }
        }
        for (let j = 0; j < 3; ++j) {
            for (let i = 3; i < 6; i++) {
                if (map[i][j] != null) {
                    if (map[i][j].type === 'B_KING') {
                        black = true;
                    }
                    if (map[i][j].type === 'W_KING') {
                        red = true;
                    }
                }
            }
        }
        let isBlackTurn: number = (this.maxDepth - depth + 1) % 2;
        return (red && black) ? 0 : (black ^ isBlackTurn ? -1 : 1) * (19990 + depth);
    }
}