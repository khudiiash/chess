export enum events {
  // game (client)
  loaded = 'loaded',
  move = 'move',
  start = 'start',
  restart = 'restart',
  restore = 'restore',
  difficulty = 'difficulty',
  mode = 'mode',
  continue = 'continue',
  select = 'select',
  turn = 'turn',
  check = 'check',
  checkmate = 'checkmate',

  //game (server)
  hostLeft = 'host left',
  guestLeft = 'guest left',
  joinedGame = 'joined game',
  guestJoined = 'guest joined',
  gameCreated = 'game created',
  gameNotFound = 'game not found',

  // socket (server)
  connection = 'connection',
  connected = 'connected',
  disconnected = 'disconnected',
  playerConnected = 'player connected',
  playerDisconnected = 'player disconnected',

  // online
  find = 'find',
  join = 'join',
  invite = 'invite',
  leave = 'leave',
  opponentLeft = 'opponent left',
  gameID = 'game-id',
  restartRequest = 'restart request',
  restartRequested = 'restart requested',
  restartRefuse = 'restart refuse',
  restartAccept = 'restart accept',
  restartRefused = 'restart refused',
  restartAccepted = 'restart accepted',

  // user
  setUserName = 'name',
  setUserSide = 'side',

  // ui
  pause = 'pause',
  resume = 'resume',
  goto = 'goto',
  back = 'back',
  exit = 'exit',
}

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';