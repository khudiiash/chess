import { IComponent } from "@/interfaces";
import { TMove, TMoveOptions, TPiece,TPosition, TResources } from "@/types";
import { inRange } from "@/utils/math";
import { Cell, Observer } from "@/components";

import Model from "./BoardModel";
import View from "./BoardView";
import { areOpponentValues } from "@/utils/board";

class Board implements IComponent {
    
    model: Model;
    view: View;
    cells: Cell[][];
    pieces: TPiece[];
    whites: TPiece[];
    blacks: TPiece[];
    observer: Observer;

    constructor() {
        this.model = new Model();
        this.view = new View();
        this.cells = [];
        this.pieces = [];
    }

    build(resources: TResources) : void {
        this.view.build(resources);
        this.view.buildCells(this.cells, resources);
        this.view.buildPieces(this.model.startMap, this.pieces, resources);
        this.reproduceHistory(this.model.state.history);
        this._setObserver();
        this._setHandlers();

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

    reproduceHistory(history: TMove[]) {
        history.forEach(move => {
            this.makeMove(move, { instantly: true, shouldRecord: false });
        });
    }

    getPieceOnPosition(position: TPosition) {
        return this.pieces.find(piece => this.positionsMatch(piece.position, position));
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
        return this.pieces.find(piece => piece.isAlive && this.positionsMatch(piece.position, position));
    }
    
    onPieceClick(piece: TPiece) {
        const selectedPiece = this.getSelectedPiece();
        
        if (this.areOpponents(selectedPiece, piece) && selectedPiece?.canMoveTo(piece.position)) {
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
        if (this.positionsMatch(piece.position, cell.position)) return;

        piece.canMoveTo(cell.position) && this.makeMove([piece.position, cell.position]);
        this.clearSelection();
    }

    positionsMatch(pos1: TPosition, pos2: TPosition) {
        return pos1.row === pos2.row && pos1.col === pos2.col;
    }

    makeMove([fromPos, toPos]: TMove, { instantly, shouldRecord }: TMoveOptions = { instantly: false, shouldRecord: true }) {
        const [from, to] = [{...fromPos}, {...toPos}];
        shouldRecord && this.model.makeMove([from, to]);
        this.getPieceOnPosition(to)?.kill(instantly);
        this.getPieceOnPosition(from)?.move(to, instantly);
        this.clearSelection();
        this.observer?.emit(this.observer.events.turn, this.model.state.turn);
    }
    
    clearSelection() {
        this.view.deselectPiece();
        this.getSelectedPiece()?.deselect();
        this.model.clearSelection();
        this.cells.forEach(row => row.forEach(cell => cell.dehighlight()));
    }

    highlightPossibleMoves(piece: TPiece) {
        const moves = this.getValidPositions(piece.getPossibleMoves());
        const validMoves: TPosition[] = [];
        this.cells.forEach(row => row.forEach(cell => cell.dehighlight()));
        
        moves.forEach((position: TPosition) => {
            validMoves.push(position);
            const cell = this.cells[position.row][position.col];
            const piece = this.getPieceOnPosition(position);
            cell.highlight(piece);
        });

        piece.setValidMoves(validMoves);
    }

    getValidPositions(positions: TPosition[] | TPosition[][]): TPosition[] {
        const moves: TPosition[] = [];
        for (const position of positions) {
            if (Array.isArray(position)) {
                for (const pos of position) {
                    const res = this.checkPosition(pos);
                    if (res.empty) {
                        moves.push(pos);
                    } 
                    else if (res.opponent) {
                        moves.push(pos);
                        break;
                    }
                    else if (res.teammate) {
                        break;
                    }
                }
            }
            else {
                const res = this.checkPosition(position);
                if (res.empty || res.opponent) {
                    moves.push(position);
                }
            }
        }

        return moves;
    }

    isTeamPiece(piece: TPiece) {
        return piece.model.team === this.getSelectedPiece()?.model.team;
    }

    isOpponentPiece(piece: TPiece) {
        return this.getSelectedPiece() && (piece.model.team !== this.getSelectedPiece().model.team);
    }

    checkPosition(position: TPosition): { empty: boolean, teammate: boolean, opponent: boolean } {
        const res = { empty: false, opponent: false, teammate: false}
        const piece = this.getSelectedPiece();
        const cellValue = this.model.state.map[position.row][position.col];
        
        res.opponent = cellValue && areOpponentValues(piece.model.value, cellValue);
        res.teammate = cellValue && !areOpponentValues(piece.model.value, cellValue);
        res.empty = cellValue === 0;
        return res;
    }

    isValidPieceToMove(piece: TPiece) {
        return (piece.isWhite && this.model.isWhiteTurn) || (piece.isBlack && this.model.isBlackTurn);
    }

}

export default Board;