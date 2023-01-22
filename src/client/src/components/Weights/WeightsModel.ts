class WeightsModel {

  private material: { white: number, black: number };
 
  constructor() {
    this.material = {
      white: 0,
      black: 0
    }
  }

  materials: {[key: string]: number} = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    P: 1,
    N: 3,
    B: 3,
    R: 5,
    Q: 9
  }

  clear() {
    this.material.black = 0;
    this.material.white = 0;
  }

  update(piece: string) {
    if (piece === piece.toUpperCase()) {
      this.material.white += this.materials[piece];
    }

    if (piece === piece.toLowerCase()) {
      this.material.black += this.materials[piece];
    }
  }

  getMaterial() {
    return this.material;
  }
  
   
}

export default WeightsModel;
