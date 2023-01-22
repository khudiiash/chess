import { IView } from "@/interfaces";

class UIView implements IView {

  dom: HTMLDivElement;

  build() {}

  add(...components: any[]) {
    for (const component of components) {
      component.build();
      document.body.appendChild(component.dom);
    }
  }



}

export default UIView;