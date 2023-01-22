import { events } from "@/../../globals";
import { Engine, Observer } from "@/components";
import { Side, Resources } from "@/types";
import WeightsModel from "./WeightsModel";
import WeightsView from "./WeightsView";
import { boundClass } from "autobind-decorator";

@boundClass
export class Weights {

  model: WeightsModel;
  view: WeightsView;
  engine: Engine;
  observer: Observer;

  constructor() {
    this.model = new WeightsModel();
    this.view = new WeightsView();
    this.engine = new Engine();
    this.observer = new Observer();

    this.setupObservers();
  }

  private setupObservers() {
    this.observer.on(events.move, this.onMove);
    this.observer.on([events.restart, events.exit], this.clear);
  }

  private clear() {
    this.model.clear();
    this.view.clear();
  }

  private async onMove({ move }: any ) {
    if (!move.captured) return;
    this.update(move.captured);
  }

  public update(piece: string, params: any = {}) {
    this.model.update(piece);
    this.view.update(this.model.getMaterial(), params);
  }


  async build(resources: Resources) {
    this.view.build(resources);
  }

  public setUserSide(side: Side) {
    this.view.setSide(side);
  }


}