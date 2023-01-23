import { IComponent } from "@/interfaces";
import { Move, Piece, Resources, Side } from "@/types";
import { Cell, Network, Observer, Engine } from "@/components";
import Model from "./BoardModel";
import View from "./BoardView";
import { Square } from "../Engine/squares";
import { events } from "@/../../globals";
import {boundClass} from 'autobind-decorator'
import gsap from 'gsap';
import { King } from "../Pieces";

@boundClass
class Board implements IComponent {
    
    model: Model;
    view: View;
    observer: Observer;
    engine: Engine;
    events: {[event: string]: Function}
    network: Network;

    constructor() {
        this.model = new Model();
        this.view = new View();
        this.engine = new Engine();
        this.network = new Network();
    }

    async build(resources: Resources) {
        this.view.build(resources);
        this.view.buildBoard(this.model.fen);
        this._setObserver();
        this.getMoves();

        if (this.model.isRestore) {
            if (this.pieces.length < 32) {
                this.createCapturedPieces();
            }
            this.observer.emit(events.restore, this.model.state);
            this.observer.emit(events.turn, this.model.state.side);
            this.observer.emit(events.start);
        }
    }

    createCapturedPieces() {   
        // needed to stack captured pieces on weights when restoring game    
        let whites = 'RNBQKBNRPPPPPPPP';
        let blacks = 'pppppppprnbqkbnr';

        for (let i = 0; i < this.pieces.length; i++) {
            const wi = whites.indexOf(this.pieces[i].char);
            if (wi !== -1) {
                whites = whites.replace(this.pieces[i].char, '');
            }

            const bi = blacks.indexOf(this.pieces[i].char);
            if (bi !== -1) {
                blacks = blacks.replace(this.pieces[i].char, '');
            }
        }

        for (let i = 0; i < whites.length; i++) {
            const piece = this.view.addPiece('none', whites[i], 'white');
            piece.kill(true);
        }

        for (let i = 0; i < blacks.length; i++) {
            const piece = this.view.addPiece('none', blacks[i], 'black');
            piece.kill(true);
        }
    }

    async getMoves() {
        const moves = await this.engine.get_moves() as Move[];
        this.model.setMoves(moves);        
    }

    private _setObserver() {
        this.observer = new Observer();
        const bindObserver = ([event, handler]: [events, any]) => this.observer.on(event, handler);
        Object.entries({
            [events.setUserSide]:   this.setUserSide,
            [events.start]:         this.start,
            [events.restart]:       this.restart,
            [events.exit]:          this.exit,
        }).forEach(bindObserver);
    }

    private _setHandlers() {
        this.pieces.forEach(piece => piece.addHandler('click', this.onPieceClick));
        this.cells.forEach(cell => cell.addHandler('click', this.onCellClick));
    }

    async start() {
        this._setHandlers();
        await this.engine.set_board(this.model.fen);
        await this.engine.generate_moves();
        this.getMoves();
        this.observer.emit(events.turn, this.model.state.side);

        if (game.ai && this.model.opponentTurn) {
            this.makeComputerMove();
        }
    }

    restart() {
        this.model.reset();
        this.view.reset();
        this.observer.emit(events.start);
    }

    exit() {
        this.cells.forEach(cell => cell.dehighlight());
        this.model.reset();
        this.view.reset();
    }


    async printBoard() {
        const board = await this.engine.print_board();
        console.log(board);
    }

    async printMoves() {
        const moves = await this.engine.print_moves();
        console.log(moves);
    }

    async makeMove(move: Move) {
        this.clearSelection();
        const piece = this.model.getPiece(move.from);
        const capture = this.model.getPiece(move.to);
        this.observer.emit(events.move, { move, piece, capture, side: this.model.state.side });

        this.model.makeMove(move);
        const moving = piece.move(move);

        if (move.enpassant) {
            const offset = this.model.state.side === 'white' ? -1 : 1;
            const sq = move.to[0] + (Number(move.to[1]) + offset);
            const enpassant = this.model.getPiece(sq);
            enpassant.kill();
        }
        
        if (move.captured) {
            capture.kill();
        }

        if (move.promoted) {
            await moving;
            this.clearPiece(piece);
            this.addPiece(move.to as Square, move.promoted, this.model.state.side);
        }

        if (move.castling) {
            let rook = null;
            switch (move.to) {
                case 'g1': rook = this.model.castle('h1', 'f1'); break;
                case 'c1': rook = this.model.castle('a1', 'd1'); break;
                case 'g8': rook = this.model.castle('h8', 'f8'); break;
                case 'c8': rook = this.model.castle('a8', 'd8'); break;
            }
            rook.castle();
        }
        await this.engine.make_move(move.bit);
        await this.engine.generate_moves();

        if (await this.isGameOver()) {
            this.observer.emit(events.checkmate, { winner: this.model.state.side });
            this.network.move({ move, side: this.model.userSide });
            return;
        }

        this.model.swapSide();
        this.observer.emit(events.turn, this.model.state.side);

        if (await this.isCheck()) {
            this.observer.emit(events.check, this.model.state.side);
            this.model.getKing(this.model.state.side).check();
        } else {
            const king = this.model.getPieces().find((p: Piece)=> p.isKing && (p as King).checked) as King;
            king?.uncheck();
        }

        
        if (game.ai && this.model.opponentTurn) {
            await this.makeComputerMove();
            return;
        }

        if (game.online && this.model.side === this.model.sides.opponent) {
            this.network.move({ move, side: this.model.userSide });
        }
        this.model.updateFen();
        this.model.storeState();
        await this.getMoves();

    }

    setUserSide(side: Side) {
        this.model.setUserSide(side);
        this.view.setUserSide(side);
    }

    onNetworkMove(data: {move: Move, side: Side}) {
        this.makeMove(data.move);
    }

    private clearPiece(piece: Piece) {
        this.model.clearPiece(piece);
        this.view.clearPiece(piece);
    }

    private addPiece(sq: any, piece: string, side: Side) {
        const newPiece = this.view.addPiece(sq, piece, side);
        this.model.addPiece(newPiece);
        newPiece.addHandler('click', this.onPieceClick);
    }

    async isCheck() {
        return this.engine.in_check();
    }  

    async isGameOver() {
        const inCheck = await this.engine.in_check();
        const moves = await this.engine.get_moves() as Move[];
        if (inCheck && moves.length === 0) {
            this.observer.emit(events.checkmate, { winner: this.model.state.side });
            return true;
        }
        return false;
    }

    clearSelection() {
        this.model.getSelected()?.deselect();
        this.model.clearSelected();
        this.cells.forEach(cell => cell.dehighlight());
        
    }

    async makeComputerMove() {
        // search ai move, make move after 1 second
        const move = await this.engine.get_best_move() as Move;
        await new Promise(resolve => gsap.delayedCall(1, resolve));
        if (!move) {
            this.observer.emit(events.checkmate, { winner: this.model.userSide });
            return;
        }
        this.makeMove(move);
    }

    onPieceClick(piece: Piece) {
        if (this.model.side === this.model.sides.opponent) return;
        const previous = this.model.getSelected();

        if (previous && piece.side !== previous.side) {
            // select enemy piece, checking if can capture it
            const moves = this.model.getMovesForPiece(previous);
            const move = moves.find(move => move.to === piece.square);
            move && this.makeMove(move);
        } 
        
        if (piece.side === this.model.state.side) {
            // select piece
            piece.select();
            this.observer.emit(events.select, piece);
            this.model.selecPiece(piece);
            this.highlightMoves(this.model.getMovesForPiece(piece));
        }

        previous && previous !== piece && previous.deselect();
    }
    
    highlightMoves(moves: Move[]) {
        this.cells.forEach(cell => cell.dehighlight());

        for (const move of moves) {
            try {
                const {cell} = this.model.squares[move.to];
                cell.highlight(move.captured);
            } catch (e) {
                console.error(e);
            }
           
        }
    }

    onCellClick(cell: Cell) {
        if (!cell.isHighlighted) return this.model.getCells().forEach(cell => cell.dehighlight());
        const piece = this.model.getSelected();
        const from = piece.position.square;
        const to = cell.position.square;
        const move = this.model.getMove(from, to);
        this.makeMove(move);
    }

    get pieces(): Piece[] {
        return this.model.getPieces();
    }

    get cells(): Cell[] {
        return this.model.getCells();
    }

}

export default Board;