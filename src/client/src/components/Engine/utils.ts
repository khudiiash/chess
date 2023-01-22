export const int8 = (arr: number[], reverse: boolean = false) => {
  // generate int8 arrays containing piece position evaluations
  let result = [...arr];
  for (let i = 1; i <= 16; i++) {
    if (i % 2 != 0) result.splice(i * 8, ...Array(8).fill(0));
  };
  if (reverse) {
    result.splice(0, 8);
    result.push(...Array(8).fill(0))
  }
  return new Int8Array(result);
}

export const rand32 = () => {
  return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16) | (Math.floor((Math.random() * 255) + 1) << 8) | Math.floor((Math.random() * 255) + 1);
}

export const validate_fen = (fen: string) => {
    /* 1st criterion: 6 space-seperated fields? */
    const tokens = fen.split(/\s+/)
    if (tokens.length !== 6) {
      return {
        ok: false,
        error: 'Invalid FEN: must contain six space-delimited fields',
      }
    }
  
    /* 2nd criterion: move number field is a integer value > 0? */
    const moveNumber = parseInt(tokens[5], 10)
    if (isNaN(moveNumber) || moveNumber <= 0) {
      return {
        ok: false,
        error: 'Invalid FEN: move number must be a positive integer',
      }
    }
  
    /* 3rd criterion: half move counter is an integer >= 0? */
    const halfMoves = parseInt(tokens[4], 10)
    if (isNaN(halfMoves) || halfMoves < 0) {
      return {
        ok: false,
        error:
          'Invalid FEN: half move counter number must be a non-negative integer',
      }
    }
  
    /* 4th criterion: 4th field is a valid e.p.-string? */
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return { ok: false, error: 'Invalid FEN: en-passant square is invalid' }
    }
  
    /* 5th criterion: 3th field is a valid castle-string? */
    if (/[^kKqQ-]/.test(tokens[2])) {
      return { ok: false, error: 'Invalid FEN: castling availability is invalid' }
    }
  
    /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
    if (!/^(w|b)$/.test(tokens[1])) {
      return { ok: false, error: 'Invalid FEN: side-to-move is invalid' }
    }
  
    /* 7th criterion: 1st field contains 8 rows? */
    const rows = tokens[0].split('/')
    if (rows.length !== 8) {
      return {
        ok: false,
        error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows",
      }
    }
  
    /* 8th criterion: every row is valid? */
    for (let i = 0; i < rows.length; i++) {
      /* check for right sum of fields AND not two numbers in succession */
      let sumFields = 0
      let previousWasNumber = false
  
      for (let k = 0; k < rows[i].length; k++) {
        if (/[0-9]/.test(rows[i][k])) {
          if (previousWasNumber) {
            return {
              ok: false,
              error: 'Invalid FEN: piece data is invalid (consecutive number)',
            }
          }
          sumFields += parseInt(rows[i][k], 10)
          previousWasNumber = true
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
            return {
              ok: false,
              error: 'Invalid FEN: piece data is invalid (invalid piece)',
            }
          }
          sumFields += 1
          previousWasNumber = false
        }
      }
      if (sumFields !== 8) {
        return {
          ok: false,
          error: 'Invalid FEN: piece data is invalid (too many squares in rank)',
        }
      }
    }
  
    if (
      (tokens[3][1] == '3' && tokens[1] == 'w') ||
      (tokens[3][1] == '6' && tokens[1] == 'b')
    ) {
      return { ok: false, error: 'Invalid FEN: illegal en-passant square' }
    }
  
    const kings = [
      { color: 'white', regex: /K/g },
      { color: 'black', regex: /k/g },
    ]
  
    // for (const { color, regex } of kings) {
    //   if (!regex.test(tokens[0])) {
    //     return { ok: false, error: `Invalid FEN: missing ${color} king` }
    //   }
  
    //   if ((tokens[0].match(regex) || []).length > 1) {
    //     return { ok: false, error: `Invalid FEN: too many ${color} kings` }
    //   }
    // }
  
    return { ok: true }
}

export const CASTLEBIT_TO_STR = (castle: number) => {
  let str = '';
  if (castle & 0x1) {
    str += 'K';
  }
  if (castle & 0x2) {
    str += 'Q';
  }
  if (castle & 0x4) {
    str += 'k';
  }
  if (castle & 0x8) {
    str += 'q';
  }
  return str;
}