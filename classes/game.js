//define the base values of each game
const begGame = {
  level: "beginner",
  row: 5,
  col: 4,
  cost: 30,
  baseProbability: 0.2,
  bombCount: 4,
  rupoorCount: 0,
  undesireableCount: 4,
};
const intGame = {
  level: "intermediate",
  row: 5,
  col: 6,
  cost: 50,
  baseProbability: 0.2667,
  bombCount: 4,
  rupoorCount: 4,
  undesireableCount: 8,
};
const expGame = {
  level: "expert",
  row: 5,
  col: 8,
  cost: 70,
  baseProbability: 0.4,
  bombCount: 8,
  rupoorCount: 8,
  undesireableCount: 16,
};
const gameChoices = [begGame, intGame, expGame]

//TODO: define what qualities a game should have
class NewGame {
  constructor(difficulty = gameChoices[0]) {
    this.difficulty = difficulty.level;
    this.rows = difficulty.row;
    this.cols = difficulty.col;
    this.pitCount = difficulty.row * difficulty.col;
    this.undesireableCount = difficulty.undesireableCount;
    this.pitBase = difficulty.baseProbability;
    this.bombCount = difficulty.bombCount;
    this.rupoorCount = difficulty.rupoorCount;
    this.grid = [];

    for (let i = 0; i <= this.rows; i++) {
      let row = [];
      for (let j = 0; j <= this.cols; j++) {
        row.push(this.pitBase);
      }
      this.grid.push(row);
    }
  }
}

const jimothy = new NewGame(gameChoices[2]);
console.log(jimothy);
