import { TPiece } from '@/types';
import BoardModel from '../Board/BoardModel';
import AIModel from './AIModel';

class AI {

    model: AIModel;

    constructor(board: BoardModel, team: TPiece[], opponents: TPiece[]) {
      this.model = new AIModel(board, team, opponents);
    }

    generateNextMove() {
      return this.model.getBestMove();
    }
      
}

export default AI;