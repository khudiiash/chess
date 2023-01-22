class User {
  socket: any;
  index: string;
  id: string;
  name: string;
  side: 'white' | 'black';
  gameId: any;
  
  constructor(socket, index) {
    this.socket = socket;
    this.index = index;
    this.id = socket.id;
    this.side = 'white';
    this.name = `Player ${index + 1}`;
  }

  setSide(side: 'white' | 'black') {
    this.side = side;
  }

  setName(name) {
    this.name = name;
  }

  setGameId(gameId) {
    this.gameId = gameId;
  }
}

export default User;