module.exports = {
  boardSize: 8,
  sunkShips: 0,
  computerBoard: [],
  computerDifficulty: 1,
  ships: {
    destroyer: {
      location: [
        // [x, y]
        [],
        [],
      ],
      hits: [false, false],
      length: 2,
    },
    cruiser: {
      location: [
        // [x, y]
        [],
        [],
        [],
      ],
      hits: [false, false, false],
      length: 3,
    },
    battleShip: {
      location: [
        // [x, y]
        [],
        [],
        [],
        [],
      ],
      hits: [false, false, false, false],
      length: 4,
    },
  },


  /**
   * Bot difficulty settings:
   * 1 (Easy): randomly shoot at board until win (avoid already shot places)
   * 2 (Medium): randomly shoot near ships (requires rng restrictions)
   * 3 (Hard): Each shot has a 50% chance of hitting
   * 4 (Impossible): Every shot lands
   */

  startGame: function (difficulty) {
    if (difficulty) {
      this.computerDifficulty = difficulty;
    }
    this.resetShips();
    this.computerBoard = this.generateEmptyBoard();
    this.generateShipLocations();
  },

  generateEmptyBoard: function () {
    let board = [];
    for (let i = 0; i < this.boardSize; i++) {
      board.push(new Array(this.boardSize).fill(0));
    }
    return board;
  },

  resetShips: function () {
    this.sunkShips = 0;
    Object.entries(this.ships).forEach((ship) => {
      ship.hits = new Array(ship.length).fill(false);
    });
  },

  generateShipLocations: function () {
    let count = 1;
    do {
      this.generateShip(this.ships.battleShip);
      this.generateShip(this.ships.cruiser);
      this.generateShip(this.ships.destroyer);
      console.log(this.drawBoard('C'))
      if (!this.collision(this.computerBoard)) break;
      this.computerBoard = this.generateEmptyBoard();
      count++;
    } while (true);
    console.log(`Generated Board.\nTook ${count} tries`);
  },

  generateShip: function (ship) {
    const direction = Math.floor(Math.random() * 2);
    let row, col;
    if (direction === 1) {
      // horizontal
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - ship.length + 1));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - ship.length + 1));
      col = Math.floor(Math.random() * this.boardSize);
    }

    for (let i = 0; i < ship.length; i++) {
      if (direction === 1) {
        // horizontal
        ship.location[i] = [row, col + i];
        this.computerBoard[col + i][row]++;
      } else {
        ship.location[i] = [row + i, col];
        this.computerBoard[col][row + i]++;
      }
    }
  },

  collision: function (board) {
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        if (board[y][x] >= 2) return true;
      }
    }
    return false;
  },

  fire: function (board, coordinates) {
    if (coordinates.length !== 2) return 'Incorrect input!';
    coordinates = coordinates.split('');
    if (!coordinates[0].match(/[a-zA-Z]/) || !coordinates[1].match(/^\d+$/))
      return 'Incorrect input!';

    const yCoord = coordinates[0].toUpperCase().charCodeAt(0) - 65;
    const xCoord = parseInt(coordinates[1]);
    if (xCoord >= 8 || yCoord >= 8) return 'Incorrect input!';

    switch (board[yCoord][xCoord]) {
      case 0:
        // miss
        board[yCoord][xCoord]--;
        return 'Oof! Ya missed.';
      case 1:
        // hit
        board[yCoord][xCoord]++;
        return updateShipHit(xCoord, yCoord);
      case -1:
        // already missed here
        return "Oi Matey! You already missed 'ere!";
      default:
        // already hit here
        return "Oi Matey! You already hit 'ere!";
    }
  },

  updateShipHit: function (xCoord, yCoord) {
    console.log(xCoord, yCoord);
    const shipKeys = Object.keys(this.ships);
    let hitShipKey = '';
    for (let i = 0; i < shipKeys.length; i++) {
      console.log(`${shipKeys[i]}`, this.ships[shipKeys[i]].location);
      // loop through ships
      const currShip = this.ships[shipKeys[i]];
      for (let j = 0; j < currShip.length; j++) {
        // loop through current ship's coordinates
        if (
          currShip.location[j][0] === xCoord && // compare x-coord
          currShip.location[j][1] === yCoord // compare y-coord
        ) {
          console.log('HIT!', xCoord, yCoord);
          currShip.hits[j] = true;
          hitShipKey = shipKeys[i];
        }
      }
    }
    console.log('hits', this.ships[hitShipKey].hits);
    if (this.ships[hitShipKey].hits.every((hit) => hit === true)) {
      // sunk
      this.sunkShips++;
      if (this.sunkShips >= Object.keys(this.ships).length) {
        this.startGame();
        return 'Argh! You win!\nRestarting game...';
      }
      return `Argh! You sunk my ${hitShipKey}!`;
    } else {
      return 'Argh! You hit my ship!';
    }
  },

  drawBoard: function (choice) {
    let board = [];
    if (choice === 'C') {
      board = this.computerBoard;
    }
    let topRow = ['\\'];
    let boardRows = [];
    for (let i = 0; i < this.boardSize; i++) {
      topRow.push(`\t${i}`);
      let currRow = [];
      currRow.push(`${String.fromCharCode(i + 65)}\t`);
      for (let j = 0; j < this.boardSize; j++) {
        const state = board[i][j];
        switch (state) {
          case 0:
            // nothing
            currRow.push('?\t');
            break;
          case 1:
            // ship is here
            currRow.push('?\t');
            break;
          case -1:
            // miss
            currRow.push('O\t');
            break;
          case 2:
            // hit
            currRow.push('X\t');
            break;
          default:
            console.error(
              `While generating ships got a unexpected state of: ${state}`
            );
            break;
        }
      }
      currRow.push('\n');
      boardRows.push(currRow.join(''));
    }
    boardRows = boardRows.join('');
    topRow.push('\n');
    topRow.push(boardRows);
    return topRow.join('');
  },
};
