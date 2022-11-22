import { IComponent } from "@/interfaces";
import { TMove, TPiece,TPosition, TResources } from "@/types";
import { Cell, Observer, AI } from "@/components";
import gsap from "gsap";
import Model from "./BoardModel";
import View from "./BoardView";

class Board implements IComponent {
    
    model: Model;
    view: View;
    cells: Cell[][];
    pieces: TPiece[];
    whites: TPiece[];
    blacks: TPiece[];
    observer: Observer;
    ai: AI;

    constructor() {
        this.model = new Model();
        this.view = new View();
        this.cells = [];
        this.pieces = [];
    }

    build(resources: TResources) : void {
        this.view.build(resources);
        this.view.buildCells(this.cells, resources);
        this.view.buildPieces(this.model.startBoard, this.pieces, resources);
        this.whites = this.pieces.filter(piece => piece.team === 'white');
        this.blacks = this.pieces.filter(piece => piece.team === 'black');
        this.ai = new AI(this.model, this.blacks, this.whites);
        this._setObserver();
        this._setHandlers();
        this.restore(this.model.getHistory());
        this.model.generateMoves();
        this.observer.emit(this.observer.events.turn, this.model.state.turn);
    }

    private _setObserver() {
        this.observer = new Observer();
        this.observer.subscribe(this.observer.events.restart, this.restart.bind(this));
    }

    private _setHandlers() {
        this.pieces.forEach(piece => piece.addHandler('click', this.onPieceClick.bind(this)));
        this.cells.flat().forEach(cell => cell.addHandler('click', this.onCellClick.bind(this)));
    }

    restore(moves: TMove[]) {
        moves.forEach(move => {
            this.makeMove(move, true);
        });
    }

    getPieceOnPosition(position: TPosition) {
        return this.pieces.find(piece => piece.isAlive && this.model.samePositions(piece.position, position));
    }

    getCellOnPosition(position: TPosition) {
        return this.cells[position.row][position.col];
    }

    restart() {
        this.clearSelection();
        this.model.restart();
        this.cells.flat().forEach(cell => cell.reset());
        this.pieces.forEach(piece => piece.reset());
        this.observer.emit(this.observer.events.turn, this.model.state.turn);
    }

    start() {}

    getSelectedPiece(): TPiece | null {
        const position = this.model.getSelectedPiecePosition();
        if (position.row === null) return null;
        return this.pieces.find(piece => piece.isAlive && this.model.samePositions(piece.position, position));
    }
    
    onPieceClick(piece: TPiece) {
        const selectedPiece = this.getSelectedPiece();

        if (this.areOpponents(selectedPiece, piece) && selectedPiece?.canMoveTo(this.board, piece.position)) {
           this.makeMove([selectedPiece.position, piece.position]);
           return;
        }

        this.isValidPieceToMove(piece) && this.selectPiece(piece);
    }

    areOpponents(piece1: TPiece, piece2: TPiece) {
        return piece1 && piece2 && (piece1.model.team !== piece2.model.team);
    }

    selectPiece(piece: TPiece) {
        piece.select();
        this.model.setSelectedPiece(piece);
        this.highlightPossibleMoves(piece);
        this.view.selectPiece(piece.view.mesh);
    }

    onCellClick(cell: Cell): void{
        const piece = this.getSelectedPiece();
        if (!piece) return;
        if (this.model.samePositions(piece.position, cell.position)) return;

        piece.canMoveTo(this.board, cell.position) && this.makeMove([piece.position, cell.position]);
        this.clearSelection();
    }

    async makeMove([fromPos, toPos]: TMove, instantly = false) {
        const [from, to] = [{...fromPos}, {...toPos}];
        this.model.makeMove([from, to]);
        if (!instantly) {
            this.model.record([from, to]);
            this.model.nextTurn();
            this.model.save();
            this.model.check();
            this.model.generateMoves();
        }

        const piece = this.getPieceOnPosition(from);
        const opponent = this.getPieceOnPosition(to);
        opponent?.kill(instantly);
        this.clearSelection();
        instantly ? piece.setPosition(to) : await piece.move(to, instantly);


        if (!instantly && !this.model.isGameOver() && this.model.turn === 'black') {
            this.generateNextMove();
        }
        // if (checkMove) {
        //     this.observer.emit(this.observer.events.check);
        // }

        // if (this.isCheckmate()) {
        //     this.observer.emit(this.observer.events.checkmate, this.model.state.turn);
        //     return;
        // }

        // if (this.model.turn === 'black') {
        //     this.generateNextMove();
        // }

    }
    
    clearSelection() {
        this.view.deselectPiece();
        this.getSelectedPiece()?.deselect();
        this.model.clearSelection();
        this.cells.forEach(row => row.forEach(cell => cell.dehighlight()));
    }

    highlightPossibleMoves(piece: TPiece) {
        const moves = this.model.getPieceMoves(piece);
        this.cells.flat().forEach(cell => cell.dehighlight());
        
        moves.forEach(([, position]: TMove) => {
            const cell = this.cells[position.row][position.col];
            const piece = this.getPieceOnPosition(position);
            cell.highlight(piece);
        });
    }

    async generateNextMove() {
        await new Promise(res => gsap.delayedCall(1, res));
        const [from, to] = this.ai.generateNextMove();
        this.makeMove([from, to]);
    }

    isOpponentOnPosition(piece: TPiece, position: TPosition) {
        return this.model.areOpponentValues(piece.value, this.board[position.row][position.col]);
    }

    undo() {
        const lastMove = this.model.undo();
        const piece = this.getPieceOnPosition(lastMove[1]);
        piece.undo();
        
        const opponent = this.pieces.find(piece => 
            piece.isDead && 
            this.doesPieceValueMatchMap(piece) &&
            this.model.samePositions(piece.position, lastMove[1])
        );

        opponent && opponent.undo();
    }

    isGameOver() {
        return this.model.isGameOver();
    }

    doesPieceValueMatchMap(piece: TPiece) {
        return piece.value === this.board[piece.position.row][piece.position.col];
    }

    isValidPieceToMove(piece: TPiece) {
        return (piece.isWhite && this.model.isWhiteTurn) || (piece.isBlack && this.model.isBlackTurn);
    }

    get board() {
        return this.model.board;
    }

}

export default Board;