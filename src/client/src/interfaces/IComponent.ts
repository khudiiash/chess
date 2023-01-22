import { IView } from './IView';
import { IModel } from './IModel';

export interface IComponent {
    view: IView;
    model: IModel;
}