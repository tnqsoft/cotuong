import { Point } from '../point';
import { BaseValue } from '../../enum/base-value.enum';
import { FlexValue } from '../../enum/flex-value.enum';
import { Piece } from '../pieces/piece';
import { PieceCamp } from '../../enum/piece-camp.enum';

export class Evaluation {
    static constant: {
        BPawn: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [70, 70, 70, 70, 70, 70, 70, 70, 70],
            [70, 90, 110, 110, 110, 110, 110, 90, 70],
            [90, 90, 110, 120, 120, 120, 110, 90, 90],
            [90, 90, 110, 120, 120, 120, 110, 90, 90],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        RPawn: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [90, 90, 110, 120, 120, 120, 110, 90, 90],
            [90, 90, 110, 120, 120, 120, 110, 90, 90],
            [70, 90, 110, 110, 110, 110, 110, 90, 70],
            [70, 70, 70, 70, 70, 70, 70, 70, 70],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    };

    public attackPos: Array<any>;
    public guardPos: Array<any>;
    public flexibilityPos: Array<any>;
    public chessValue: Array<any>;
    public posCount: number;
    public relatePos: Array<any>;

    constructor() {
        this.relatePos = new Array();
        this.posCount = 0;
        this.chessValue = new Array();
        this.attackPos = new Array();
        this.guardPos = new Array();
        this.flexibilityPos = new Array();
        for (let i = 0; i < 9; ++i) {
            this.chessValue[i] = new Array();
            this.attackPos[i] = new Array();
            this.guardPos[i] = new Array();
            this.flexibilityPos[i] = new Array();
            for (let j = 0; j < 10; ++j) {
                this.chessValue[i][j] = 0;
                this.attackPos[i][j] = 0;
                this.guardPos[i][j] = 0;
                this.flexibilityPos[i][j] = 0;
            }
        }
    }

    evaluate(map, isRedTurn): number {
        for (let i = 0; i < 9; ++i) {
            for (let j = 0; j < 10; ++j) {
                this.chessValue[i][j] = 0;
                this.attackPos[i][j] = 0;
                this.guardPos[i][j] = 0;
                this.flexibilityPos[i][j] = 0;
            }
        }

        for (let j = 0; j < 10; ++j) {
            for (let i = 0; i < 9; ++i) {
                if (map[i][j] != null) {
                    let chess: Piece = map[i][j];
                    this.getRelatePiece(map, new Point(i, j));
                    for (let k = 0; k < this.posCount; ++k) {
                        let target: Piece = map[this.relatePos[k].x][this.relatePos[k].y];
                        if (target === null) {
                            ++this.flexibilityPos[i][j];
                        } else {
                            if (chess.camp === target.camp) {
                                ++this.guardPos[this.relatePos[k].x][this.relatePos[k].y];
                            } else {
                                ++this.flexibilityPos[i][j];
                                this.attackPos[this.relatePos[k].x][this.relatePos[k].y] += 3 +
                                    Math.floor((BaseValue[target.type] - BaseValue[chess.type]) * 0.01);
                                if (target.type === 'W_KING') {
                                    if (!isRedTurn) {
                                        return 18888;
                                    } else if (target.type === 'B_KING') {
                                        if (isRedTurn) {
                                            return 18888;
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }
        }

        let BWKing = ['B_KING', 'W_KING'];
        for (let j = 0; j < 10; ++j) {
            for (let i = 0; i < 9; ++i) {
                if (map[i][j] != null) {
                    let chess: Piece = map[i][j];
                    let halfValue = Math.floor(BaseValue[chess.type] / 16);
                    this.chessValue[i][j] += BaseValue[chess.type];
                    this.chessValue[i][j] += FlexValue[chess.type] * this.flexibilityPos[i][j];
                    if (chess.type === 'W_PAWN') {
                        this.chessValue[i][j] += Evaluation.constant.RPawn[j][i];
                    }
                    if (chess.type === 'B_PAWN') {
                        this.chessValue[i][j] += Evaluation.constant.BPawn[j][i];
                    }

                    if (this.attackPos[i][j]) {
                        if ((chess.camp === PieceCamp.White && isRedTurn) || (!(chess.camp === PieceCamp.White) && !isRedTurn)) {
                            if (chess.type === BWKing[isRedTurn]) {
                                this.chessValue[i][j] -= 20;
                            } else {
                                this.chessValue[i][j] -= halfValue * 2;
                                if (this.guardPos[i][j]) {
                                    this.chessValue[i][j] += halfValue;
                                }
                            }
                        } else {
                            if (chess.type === BWKing[isRedTurn]) {
                                return 18888;
                            }
                            this.chessValue[i][j] -= halfValue * 10;
                            if (this.guardPos[i][j]) {
                                this.chessValue[i][j] += halfValue * 9;
                            }
                        }
                        this.chessValue[i][j] -= this.attackPos[i][j];
                    } else {
                        if (this.guardPos[i][j]) {
                            this.chessValue[i][j] += 5;
                        }
                    }
                }
            }
        }

        let BWValue = [0, 0];
        for (let j = 0; j < 10; ++j) {
            for (let i = 0; i < 9; ++i) {
                let chess = map[i][j];
                if (chess != null) {
                    BWValue[chess.isRed() ? 1 : 0] += this.chessValue[i][j];
                }
            }
        }
        return BWValue[isRedTurn] - BWValue[isRedTurn ^ 1];
    }

    getRelatePiece(map, pos: Point) {
        this.posCount = 0;
        this.relatePos.length = 0;
        let chess: Piece = map[pos.x][pos.y];
        if (chess.type === 'W_KING' || chess.type === 'B_KING') {
            this.genKingMove(map, pos);
        } else if (chess.type === 'W_BISHOP' || chess.type === 'B_BISHOP') {
            this.genBishopMove(map, pos);
        } else if (chess.type === 'W_ELEPHANT' || chess.type === 'B_ELEPHANT') {
            this.genElephantMove(map, pos);
        } else if (chess.type === 'W_HORSE' || chess.type === 'B_HORSE') {
            this.genHorseMove(map, pos);
        } else if (chess.type === 'W_CAR' || chess.type === 'B_CAR') {
            this.genCarMove(map, pos);
        } else if (chess.type === 'W_PAWN' || chess.type === 'B_PAWN') {
            this.genPawnMove(map, pos);
        } else if (chess.type === 'W_CANON' || chess.type === 'B_CANON') {
            this.genCanonMove(map, pos);
        }
        return this.posCount;
    }

    genKingMove(map, pos: Point) {
        let x, y, k;
        let dx = [-1, 0, 1, 0],
            dy = [0, -1, 0, 1];
        let chess = map[pos.x][pos.y];
        for (k = 0; k < 4; ++k) {
            x = pos.x + dx[k];
            y = pos.y + dy[k];
            if (y < 0 || y >= 10 || x < 0 || x >= 9) {continue;}
            if ((x < 3 || x > 5) || (chess.type === 'W_KING' && y < 7) || (chess.type === 'B_KING' && y > 2)) {continue;}
            this.addPoint(new Point(x, y));
        }
        if (chess.type === 'W_KING') {
            for (x = pos.x, y = pos.y - 1; y >= 0 && map[x][y] === null; --y) {};
            if (y >= 0 && map[x][y] === 'B_KING') {this.addPoint(new Point(x, y));}
        } else if (chess.type === 'B_KING') {
            for (x = pos.x, y = pos.y + 1; y < 10 && map[x][y] === null; ++y) {};
            if (y < 10 && map[x][y] === 'W_KING') {this.addPoint(new Point(x, y));}
        }
    }

    genBishopMove(map, pos: Point) {
        let x, y, k;
        let dx = [-1, 1, 1, -1],
            dy = [-1, -1, 1, 1];
        let chess = map[pos.x][pos.y];
        for (k = 0; k < 4; ++k) {
            x = pos.x + dx[k];
            y = pos.y + dy[k];
            if (y < 0 || y >= 10 || x < 0 || x >= 9) {continue;}
            if ((x < 3 || x > 5) || (chess.type === 'W_BISHOP' && y < 7) || (chess.type === 'B_BISHOP' && y > 2)) {continue;}
            this.addPoint(new Point(x, y));
        }
    }

    genElephantMove(map, pos: Point) {
        let x, y, k;
        let dx = [-2, 2, 2, -2],
            dy = [-2, -2, 2, 2];
        let chess = map[pos.x][pos.y];
        for (k = 0; k < 4; ++k) {
            x = pos.x + dx[k];
            y = pos.y + dy[k];
            if (y < 0 || y >= 10 || x < 0 || x >= 9) {continue;}
            if ((chess.type === 'W_ELEPHANT' && y < 5) || (chess.type === 'B_ELEPHANT' && y > 4)) {continue;}
            if (map[Math.floor((pos.x + x) / 2)][Math.floor((pos.y + y) / 2)] != null) {continue;}
            this.addPoint(new Point(x, y));
        }
    }

    genHorseMove(map, pos: Point) {
        let x, y, k;
        let dx = [1, 2, 2, 1, -1, -2, -2, -1],
            dy = [-2, -1, 1, 2, 2, 1, -1, -2];
        let chess = map[pos.x][pos.y];
        for (k = 0; k < 8; ++k) {
            x = pos.x + dx[k];
            y = pos.y + dy[k];
            if (y < 0 || y >= 10 || x < 0 || x >= 9) {continue;}
            if (map[pos.x + parseInt(dx[k] / 2)][pos.y + parseInt(dy[k] / 2)] != null) {continue;}
            this.addPoint(new Point(x, y));
        }
    }

    genCarMove(map, pos: Point) {
        let x, y;
        let chess = map[pos.x][pos.y];
        for (x = pos.x + 1, y = pos.y; x < 9 && null === map[x][y]; ++x) {this.addPoint(new Point(x, y));}
        if (x < 9) {this.addPoint(new Point(x, y));}
        for (x = pos.x - 1, y = pos.y; x >= 0 && null === map[x][y]; --x) {this.addPoint(new Point(x, y));}
        if (x >= 0) {this.addPoint(new Point(x, y));}
        for (x = pos.x, y = pos.y + 1; y < 10 && null === map[x][y]; ++y) {this.addPoint(new Point(x, y));}
        if (y < 10) {this.addPoint(new Point(x, y));}
        for (x = pos.x, y = pos.y - 1; y >= 0 && null === map[x][y]; --y) {this.addPoint(new Point(x, y));}
        if (y >= 0) {this.addPoint(new Point(x, y));}
    }

    genPawnMove(map, pos: Point) {
        let x, y;
        let chess = map[pos.x][pos.y];
        if ((chess.type === 'W_PAWN' && pos.y < 5) || (chess.type === 'B_PAWN' && pos.y > 4)) {
            y = pos.y;
            x = pos.x + 1;
            if (x < 9) {this.addPoint(new Point(x, y));}
            x = pos.x - 1;
            if (x >= 0) {this.addPoint(new Point(x, y));}
        }
        x = pos.x;
        y = pos.y + (chess.isRed() ? -1 : 1);
        if ((chess.type === 'W_PAWN' && y < 0) || (chess.type === 'B_PAWN' && y >= 10)) {return;}
        this.addPoint(new Point(x, y));
    }

    genCanonMove(map, pos: Point) {
        let x, y;
        let chess = map[pos.x][pos.y];
        for (x = pos.x + 1, y = pos.y; x < 9 && null === map[x][y]; ++x) {this.addPoint(new Point(x, y));}
        for (++x; x < 9 && null === map[x][y]; ++x) {};
        if (x < 9) {this.addPoint(new Point(x, y));}
        for (x = pos.x - 1, y = pos.y; x >= 0 && null === map[x][y]; --x) {this.addPoint(new Point(x, y));}
        for (--x; x >= 0 && null === map[x][y]; --x) {};
        if (x >= 0) {this.addPoint(new Point(x, y));}
        for (x = pos.x, y = pos.y + 1; y < 10 && null === map[x][y]; ++y) {this.addPoint(new Point(x, y));}
        for (++y; y < 10 && null === map[x][y]; ++y) {};
        if (y < 10) {this.addPoint(new Point(x, y));}
        for (x = pos.x, y = pos.y - 1; y >= 0 && null === map[x][y]; --y) {this.addPoint(new Point(x, y));}
        for (--y; y >= 0 && null === map[x][y]; --y) {};
        if (y >= 0) {this.addPoint(new Point(x, y));}
    }

    addPoint(pos: Point): void {
        this.relatePos[this.posCount++] = pos;
    }
}