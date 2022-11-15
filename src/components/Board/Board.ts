import { IComponent } from "@/interfaces";
import { TPiece } from "@/types";
import { TPosition } from "@/types/TPosition";
import { clampToBoard, inRange } from "@/utils/math";
import { Cell } from "../Cell";
import Model from "./BoardModel";
import View from "./BoardView";

class Board implements IComponent {
    
    model: Model;
    view: View;
    cells: Cell[][];
    pieces: TPiece[];
    whites: TPiece[];
    blacks: TPiece[];

    constructor() {
        this.model = new Model();
        this.view = new View();
        this.cells = [];
        this.pieces = [];
    }

    build() : void {
        this.view.build({ cellComponents: this.cells });
        this.view._buildPiecesFromBoard(this.model.state.map, this.model.pieceFactory, this.pieces);
        this.pieces.forEach(piece => piece.addHandler('click', this.onPieceClick.bind(this)));
        this.cells.flat().forEach(cell => cell.addHandler('click', this.onCellClick.bind(this)));
    }

    start() {}
    
    fight(opponent: TPiece) {
        const piece = this.model.getSelectedPiece();
        const move = { from: { row: piece.row, col: piece.col }, to: { row: opponent.row, col: opponent.col } };
        this.model.makeMove(move);
        this.clearSelection();
    }
    
    onPieceClick(piece: TPiece) {
        if (this.isOpponentPiece(piece)) {
            this.makeMove({
                piece: this.model.getSelectedPiece(),
                cell: this.cells[piece.row][piece.col],
                pieceToKill: piece
            });
        }
        if (!this.isValidPiece(piece)) return;
        piece.select();
        this.model.setSelectedPiece(piece);
        this.highlightPossibleMoves(piece);
    }

    onCellClick(cell: Cell) {
        const piece = this.model.getSelectedPiece();

        if (piece && cell.isHighlighted) {
            this.makeMove({ piece, cell });
        }
    }

    async makeMove(params: { piece?: TPiece, cell?: Cell, pieceToKill?: TPiece } = {}) {
        const { piece, cell, pieceToKill } = params;
        const move = { from: { row: piece.row, col: piece.col }, to: { row: cell.row, col: cell.col } };
        pieceToKill && pieceToKill.kill();
        await this.model.getSelectedPiece().move(move.to);
        
        pieceToKill && this.killPiece(pieceToKill);
        this.model.makeMove(move);
        this.clearSelection();
    }

    killPiece(pieceToKill: TPiece) {
        this.pieces.splice(this.pieces.indexOf(pieceToKill), 1);
    }

    getPieceByPosition(position: TPosition) {
        return this.pieces.find(piece => piece.row === position.row && piece.col === position.col);
    }
    
    clearSelection() {
        this.model.clearSelection();
        this.cells.forEach(row => row.forEach(cell => cell.dehighlight()));
    }

    highlightPossibleMoves(piece: TPiece) {
       const moves = this.getValidPositions(piece.getPossibleMoves());
       this.cells.forEach(row => row.forEach(cell => cell.dehighlight()));
       moves.forEach((position: TPosition) => {
        const cell = this.cells[position.row][position.col];
        cell.highlight();
       });
    }

    getValidPositions(positions: TPosition[] | TPosition[][]): TPosition[] {
        const moves = [];
        for (const position of positions) {
            if (Array.isArray(position)) {
                for (const pos of position) {
                    if (this.isValidPosition(pos)) {
                        moves.push(pos);
                    } else {
                        break;
                    }
                }
            }
            else {
                this.isValidPosition(position) && moves.push(position);
            }
        }

        return moves;
    }

    isOpponentPiece(piece: TPiece) {
        const selected = this.model.getSelectedPiece();
        return selected && selected.model.team !== piece.model.team;
    }

    isValidPosition(position: TPosition): boolean {
        const pawn = this.model.getSelectedPiece();
        const cellValue = this.model.state.map[position.row][position.col];
        if (pawn.isWhite ? inRange(cellValue, 1, 6) : inRange(cellValue, 7, 12)) return false;
        return true;
    }

    isValidPiece(piece: TPiece) {
        return piece.isWhite === this.model.isWhiteTurn || piece.isBlack && this.model.isBlackTurn;
    }

}

export default Board;