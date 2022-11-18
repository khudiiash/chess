import * as THREE from 'three';
import { IView } from '@/interfaces';
import { TPiece, TResources } from '@/types';
import PieceFactory from '@/components/Base/PieceFactory';

import { Cell } from '@/components'

class BoardView implements IView {
    
    cells: THREE.Mesh[][];
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
    whites: TPiece[] = [];
    blacks: TPiece[] = [];
    pieces: THREE.Mesh[] = [];
    cellsContainer: THREE.Object3D<THREE.Event>;
    piecesContainer: THREE.Object3D<THREE.Event>;
    spotLight: THREE.SpotLight;
    spotLightHelper: THREE.SpotLightHelper;
    resources: TResources;
    piecesFactory: PieceFactory;
    
    build(resources: TResources) : void {
        this.resources = resources;
        this.cells = [];
        this.piecesFactory = new PieceFactory();
        
        const geometry = new THREE.BoxGeometry( 8, 0.1, 8 );
        const material = new THREE.MeshStandardMaterial( { color: 0x993300, roughness: 0.1 } );
        const board = new THREE.Mesh( geometry, material );
        board.receiveShadow = true;
        
        this.spotLight = new THREE.SpotLight(0xffffff, 10, 4, Math.PI / 9, 1, 3);
        this.spotLight.visible = false;

        this.cellsContainer = new THREE.Object3D();
        this.piecesContainer = new THREE.Object3D();
        this.cellsContainer.position.set(-3.5, 0.01, -3.5);
        this.piecesContainer.position.set(-3.5, 0.01, -3.5);
        
        board.add(this.cellsContainer);
        board.add(this.piecesContainer);

        this.mesh = board;
        this.piecesContainer.add(this.spotLight);
    }



    selectPiece(piece: THREE.Mesh) {
        // @ts-ignore
        game.fadeMainLight();
        this.spotLight.visible = true;
        this.spotLight.target = piece;
        this.spotLight.position.copy(piece.position);
        this.spotLight.position.y = 2;
    }

    deselectPiece() {
        // @ts-ignore
        game.restoreMainLight();
        this.spotLight.visible = false;
    }

    buildCells(cellComponents: Cell[][], resources: any) {
        this.cells = [];
        for (let i = 0; i < 8 * 8; i++) {
            const x = i % 8;
            const z = Math.floor(i / 8);
            const cell = new Cell(x, z, resources);
            
            if (!this.cells[x]) {
                this.cells.push([])
                cellComponents.push([]);
            }
            cellComponents[x].push(cell);
            this.cells[x].push(cell.view.mesh);
            this.cellsContainer.add(cell.view.mesh);
        }
    }

    buildPieces(map: number[][], piecesComponents: TPiece[], resources: any) {
        map.forEach((row, rowIndex) => {
            row.forEach((cellValue, cellIndex) => {
                if (!cellValue) return;
                const piece = this.piecesFactory.createPiece({ 
                    value: cellValue, 
                    row: rowIndex,
                    col: cellIndex,
                    resources
                });
                this.pieces.push(piece.view.mesh);
                piecesComponents.push(piece);
                this.piecesContainer.add(piece.view.mesh);
            })
       })
    }

    killPiece(piece: TPiece) {
        const index = this.pieces.indexOf(piece.view.mesh);
        this.pieces.splice(index, 1);
        this.piecesContainer.remove(piece.view.mesh);
    }

}

export default BoardView;
