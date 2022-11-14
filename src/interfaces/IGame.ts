import { IComponent } from './IComponent';

export interface IGame {
    
    board: IComponent
    scene: IComponent;

    start(): void;
}