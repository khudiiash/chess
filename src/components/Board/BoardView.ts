import * as THREE from 'three';
import { IView } from '@/interfaces';
import { TPiece } from '@/types';
import PieceFactory from '../Pieces/PieceFactory';

import { Cell } from '@/components'

class BoardView implements IView {
    
    cells: THREE.Mesh[][];
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    whites: TPiece[] = [];
    blacks: TPiece[] = [];
    pieces: THREE.Mesh[] = [];
    cellsContainer: THREE.Object3D<THREE.Event>;
    piecesContainer: THREE.Object3D<THREE.Event>;
    
    build({ cellComponents } : {cellComponents: Cell[][]}) : void {
        this.cells = [];
        const geometry = new THREE.BoxGeometry( 8, 1, 8 );
        const material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
        const board = new THREE.Mesh( geometry, material );
        // board.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
        this.cellsContainer = new THREE.Object3D();
        this.piecesContainer = new THREE.Object3D();

        for (let i = 0; i < 8 * 8; i++) {
            const x = i % 8;
            const z = Math.floor(i / 8);
            const cell = new Cell(x, z);
            
            if (!this.cells[x]) {
                this.cells.push([])
                cellComponents.push([]);
            }
            cellComponents[x].push(cell);
            this.cells[x].push(cell.view.mesh);
            this.cellsContainer.add(cell.view.mesh);
        }

        this.cellsContainer.position.set(-3.5, 0.5, -3.5);
        this.piecesContainer.position.set(-3.5, 0.5, -3.5);
        board.add(this.cellsContainer);
        board.add(this.piecesContainer);
        this.mesh = board;
    }

    _buildPiecesFromBoard(board: number[][], pieceFactory: PieceFactory, piecesComponents: TPiece[]) {
       board.forEach((row, rowIndex) => {
            row.forEach((cellValue, cellIndex) => {
               if (!cellValue) return;
                const piece = pieceFactory.createPiece(cellValue);
                piece.setPosition(rowIndex, cellIndex);
                this.pieces.push(piece.view.mesh);
                piecesComponents.push(piece);
                this.piecesContainer.add(piece.view.mesh);
            })
       })
    }

}

export default BoardView;
