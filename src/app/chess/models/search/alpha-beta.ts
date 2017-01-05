import { Engine } from './engine';

export class AlphaBeta extends Engine {

    searchAGoodMove(map) {
        this.mapCopy(map);
        this.maxDepth = this.searchDepth;
        this.alphabeta(this.maxDepth, -20000, 20000);
        return this.bestMove;
    }

    alphabeta(depth, alpha, beta) {
        let score = this.isGameOver(this.currentMap, depth);
        if (score != 0) return score;
        if (depth <= 0)
            return this.evaluator.evaluate(this.currentMap, (this.maxDepth - depth) % 2);

        let count = this.moveGen.createPossibleMove(this.currentMap, depth, (this.maxDepth - depth) % 2);

        for (let i = 0; i < count; i++) {
            let chess = this.makeMove(this.moveGen.moveList[depth][i]);
            score = -this.alphabeta(depth - 1, -beta, -alpha);
            this.unMakeMove(this.moveGen.moveList[depth][i], chess);

            if (score > alpha) {
                alpha = score;
                if (depth == this.maxDepth)
                    this.bestMove = this.moveGen.moveList[depth][i];
            }
            if (alpha >= beta) break;
        }
        return alpha;
    }
}