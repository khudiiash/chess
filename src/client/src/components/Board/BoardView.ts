import * as THREE from 'three';
import { IView } from '@/interfaces';
import { Position, Square, TSquares, Piece, Resources } from '@/types';
import PieceFactory from '@/components/Base/PieceFactory';
// @ts-ignore
import { Text } from "troika-three-text";
import { Cell } from '@/components'
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { START_FEN } from '@/../../globals';

class BoardView implements IView {
    
    cells: THREE.Mesh[];
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    whites: Piece[] = [];
    blacks: Piece[] = [];
    pieces: THREE.Mesh[] = [];
    cellsContainer: THREE.Object3D<THREE.Event>;
    piecesContainer: THREE.Object3D<THREE.Event>;
    resources: Resources;
    piecesFactory: PieceFactory;
    squares: TSquares;
    labelsContainer: THREE.Object3D<THREE.Event>;
    userSide: string;
    weightsWing: any;
    weights: any;
    
    build(resources: Resources) : void {
        this.resources = resources;
        this.cells = [];
        this.piecesFactory = new PieceFactory();
        this.squares = game.board.model.squares;
        const geometry = new THREE.BoxGeometry( 8.5, 0.1, 8.5 );
        const material = new THREE.MeshStandardMaterial( { 
            color: 0x111111, 
            roughness: 0.25,
            transparent: false,
            opacity: 1,
            depthWrite: true
        } );


        const board = new THREE.Mesh( geometry, material );
        board.receiveShadow = true;
        board.castShadow = true;
        this.cellsContainer = new THREE.Object3D();
        this.piecesContainer = new THREE.Object3D();
        this.cellsContainer.position.set(-3.5, 0.01, -3.5);
        this.piecesContainer.position.set(-3.5, 0.01, -3.5);

        this.cellsContainer.position.y = 0.1;
        this.piecesContainer.position.y = 0.1;
        board.add(this.cellsContainer);
        board.add(this.piecesContainer);
        this.mesh = board;

        this.addMirror();
        this.addFileRankLabels();
        this.userSide = 'white';
    }

    private addFileRankLabels(side = 'white') {
        const labels = 'ABCDEFGH';
        this.labelsContainer = new THREE.Object3D();
        const style = {
            color: 0xe2e,
            fontSize: 0.3,
            textAlign: 'center'
        }
        
        for (let i = 0; i < 8; i++) {
            // ranks on white side
            const label = i + 1;
            const white = new Text();
            white.name = 'white-rank';
            white.text = label;
            Object.assign(white, style);
            white.position.set(i - 3.5 + 0.15, 0.1, -5);
            white.rotateX(-Math.PI / 2);
            white.rotateZ(-Math.PI / 2);
            this.labelsContainer.add(white);

            // ranks on black side
            const black = new Text();
            black.name = 'black-rank';
            black.text = label;
            Object.assign(black, style);
            black.position.set(i - 3.5 + 0.15, 0.1, 5);
            black.rotateX(-Math.PI / 2);
            black.rotateZ(Math.PI / 2);
            this.labelsContainer.add(black);
        }
        for (let i = 0; i < 8; i++) {
            // white files
            const label = labels[i];
            const white = new Text();
            white.name = 'white-file';
            white.text = label;
            Object.assign(white, style);
            white.position.set(-5, 0.1, i - 3.5);
            white.rotateX(-Math.PI / 2);
            white.rotateZ(-Math.PI / 2);
            this.labelsContainer.add(white);

            // black files
            const black = new Text();
            black.name = 'black-file';
            black.text = label;
            Object.assign(black, style);
            black.position.set(5, 0.1, i - 3.5);
            black.rotateX(-Math.PI / 2);
            black.rotateZ(Math.PI / 2);
            this.labelsContainer.add(black);
        }
    
        this.mesh.add(this.labelsContainer);

        this.showLabelsBySide(side);
    }

    public showLabelsBySide(side: string) {
        const labels = this.labelsContainer.children;
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i] as Text;
            label.name.includes(side) ? label.visible = true : label.visible = false;
        }
    }

    public setUserSide(side: 'white' | 'black') {
        this.userSide = side;
        this.showLabelsBySide(side);
    }

    private addMirror() {
        const geometry = new THREE.PlaneGeometry( 8, 8 );
        const mirror = new Reflector( geometry, {
            clipBias: 0.003,
            textureWidth: 1024,
            textureHeight: 1024,
            color: 0x777777,
        } );
        mirror.rotateX( - Math.PI / 2 );
        mirror.position.y = 0.09;
        this.mesh.add( mirror );
    }

    clearPiece(piece: Piece) {
        const index = this.pieces.indexOf(piece.view.mesh);
        this.pieces.splice(index, 1);
        this.piecesContainer.remove(piece.view.mesh);

        const sq = Cell.toSquare(piece.row, piece.col);
        this.squares[sq].piece = null;
    }

    addPiece(sq: Square | Position, piece: string = 'P', side: string = 'white'): Piece {
        let row = null;
        let col = null;

        if (typeof sq === 'string' && /[a-h][1-8]/.test(sq)) {
            const {row: r, col: c} = Cell.fromSquare(sq);
            row = r;
            col = c;
        }

        if (typeof sq !== 'string' && 'row' in sq && 'col' in sq) {
            row = sq.row;
            col = sq.col;
        }

        if (sq === 'none') {
            row = -1;
            col = -1;
        }

        if (!Number.isInteger(row) || !Number.isInteger(col)) {
            throw new Error('Invalid square');
        }

        const newPiece = this.piecesFactory.createPiece({
            value: side === 'white' ? piece.toUpperCase() : piece.toLowerCase(), 
            row: row,
            col: col,
            resources: this.resources
        });
        this.pieces.push(newPiece.view.mesh);
        this.piecesContainer.add(newPiece.view.mesh);

        if (sq === 'none') return newPiece;
        this.squares[Cell.toSquare(row, col)].piece = newPiece;
        
        return newPiece;
    }

    reset() {
        this.pieces.forEach(piece => {
            this.piecesContainer.remove(piece);
        });
        this.pieces = [];
        this.buildPieces();
    }

    parseFen(fen: string) {
        fen = fen.split(' ')[0];
        const fenRows = fen.split('/');
        const map = fenRows.map(row => {
            const cells = row.split('');
            const result = [];
            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                if (/[1-8]/.test(cell)) {
                    for (let j = 0; j < parseInt(cell); j++) {
                        result.push(0);
                    }
                } else {
                    result.push(cell);
                }
            }

            return result;
        })
        return map.reverse();
    }

    addCell(row: number, col: number) {
        const cell = new Cell(row, col, this.resources);
        this.squares[Cell.toSquare(row, col)].cell = cell;
        this.cells.push(cell.view.mesh);
        this.cellsContainer.add(cell.view.mesh);
    }

    buildBoard(fen: string = START_FEN) {
        const map = this.parseFen(fen);

        for (let i = 0; i < 8 * 8; i++) {
            const x = i % 8;
            const z = Math.floor(i / 8);
            const cell = map[x][z];
            this.addCell(x, z);

            if (typeof cell === 'string') {
                const side = cell === cell.toUpperCase() ? 'white' : 'black';
                this.addPiece({row: x, col: z}, cell, side);
            }
        }

        
    }

    buildPieces(fen: string = START_FEN) {
        const map = this.parseFen(fen);

        for (let i = 0; i < 8 * 8; i++) {
            const x = i % 8;
            const z = Math.floor(i / 8);
            const cell = map[x][z];
            if (typeof cell === 'string') {
                const side = cell === cell.toUpperCase() ? 'white' : 'black';
                this.addPiece({row: x, col: z}, cell, side);
            }
        }
    }


    

}

export default BoardView;
