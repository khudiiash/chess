import { IComponent } from "@/interfaces";
import { TPiece } from "@/types";
import { TPosition } from "@/types/TPosition";
import { clampToBoard } from "@/utils/math";
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

    onPieceClick(piece: TPiece) {
        // TODO: implement
        this.model.setSelectedPiece(piece);
        this.highlightPossibleMoves(piece);
    }

    onCellClick(cell: Cell) {
        // TODO: implement
        const piece = this.model.getSelectedPiece();
        if (piece && cell.isHighlighted) {
            this.model.makeMove({ from: piece.position, to: cell.position });
            this.model.state.selection.piece.move(cell.row, cell.col);
            this.model.clearSelection();
        } else {
            this.model.setSelectedCell(cell);
        }
    }

    highlightPossibleMoves(piece: TPiece) {
       const moves = this.getValidPositions(piece.getPossibleMoves());
       moves.forEach((position: TPosition) => {
        const cell = this.cells[position.row][position.col];
        cell.highlight();
       });
    }

    getValidPositions(positions: TPosition[] | TPosition[][]): TPosition[] {
        const moves = [];
        console.log({ positions });
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

        console.log(moves);
        return moves;
    }

    isValidPosition(position: TPosition): boolean {
        const open = this.model.state.map[position.row][position.col] === 0;
        if (!open) return false;
        return true;
    }

}

export default Board;