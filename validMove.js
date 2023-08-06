//define options for each pit, as well as surrounding undesirable counts and bool for position validity
const green = { value: 1, surroundingMin: 0, surroundingMax: 0, edgeSafe: true, cornerSafe: true };
const blue = { value: 5, surroundingMin: 1, surroundingMax: 2, edgeSafe: true, cornerSafe: true };
const red = { value: 20, surroundingMin: 3, surroundingMax: 4, edgeSafe: true, cornerSafe: true };
const silver = { value: 100, surroundingMin: 5, surroundingMax: 6, edgeSafe: true, cornerSafe: false};
const gold = { value: 300, surroundingMin: 7, surroundingMax: 8, edgeSafe: false, cornerSafe: false };
const bomb = { undesireable: true };
const rupoor = { value: -100, undesireable: true };
const option = [green, blue, red, silver, gold, bomb, rupoor];

//TODO: define early valididty checker
let move = { row: 0, col: 0, treasure: green }; // move position y, move position x, and the thing that comes out of the ground

export default function validMove(move=move, grid, options = option) {
  //move should match options -- if it doesn't, the move is invalid
  //move.position (centerSafe, edgeSafe, cornerSafe) should match the grid position
  if (!cellOptions(move, options)) { return false }
  //move should be valid considering the grid itself
  //
}



// define cell options based on grid position and relevant safety levels
function cellOptions(move, grid, options, difficulty) {
  let pit = [...options];
  let position = gridPosition(move, grid);
  //check surrounding cells for undesirable count
  //check move to see if undesirable count exceeds surroundingMax
  //check options count based on undesirables and positions and difficulty
      //difficulty.undesirableCount should be dynamic responding to how many rupoors have been found in intermediate & expert!!
      //beginner level game can have: green, blue, red
      //intermediate & expert can have all types

  if (position === "centre") {
    //check
  }
}

function gridPosition(move, grid) {
  let cols = grid[0].length;

  //if the move is the maximum or minimum in row or column
    //it is on an edge. if it is both, it is on a corner.
    //if it is neither, it is in the centre
  if (move.row === 0 || move.row === 5) {
    if (move.col === 0 || move.col === cols - 1) {
      return "corner"
    } else {
      return "edge"
    }
  } else {
    return "centre"
  }
};
