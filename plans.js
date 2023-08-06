//BACK END ONLY - DOES NOT HANDLE VISIBILITY FOR ANYTHING!

//beginner: 4 bombs across a 4w5h grid of 20 blocks (-30)
//intermediate: 4 bombs 4 rupoors bombs across a 6w5h grid of 30 blocks (-50)
//expert: 8 bombs 8 rupoors across a 8w5h grid of 40 blocks (-70)

//green: 0 around (+1) 
  // declare all surrounding blocks Safe
//blue: 1-2 around (+5)
  // must have all surrounding blocks - 2 Safe
//red: 3-4 around (+20)
  // must have all surrounding blocks - 4 Safe
//silver: 5-6 around (+100)
  // must have all surrounding blocks - 6 Safe
//gold: 7-8 around (+300)
  // may have a maximum of one surrounding block Safe

const beginner = [
  [[''], [''], [''], ['']],
  [[''], [''], [''], ['']],
  [[''], [''], [''], ['']],
  [[''], [''], [''], ['']],
  [[''], [''], [''], ['']]
];
//TODO: calculate likelihood of each cell containing a bomb (1/20 to begin)

const intermediate = [
  [[''], [''], [''], [''], [''], ['']],
  [[''], [''], [''], [''], [''], ['']],
  [[''], [''], [''], [''], [''], ['']],
  [[''], [''], [''], [''], [''], ['']],
  [[''], [''], [''], [''], [''], ['']]
];
//TODO: calculate likelihood of each cell containing a bomb (1/30 to begin)

const expert = [
  [[''], [''], [''], [''], [''], [''], [''], ['']],
  [[''], [''], [''], [''], [''], [''], [''], ['']],
  [[''], [''], [''], [''], [''], [''], [''], ['']],
  [[''], [''], [''], [''], [''], [''], [''], ['']],
  [[''], [''], [''], [''], [''], [''], [''], ['']]
];
//TODO: calculate likelihood of each cell containing a bomb (1/40 to begin)

let grid;
let row;
let col;

//TODO: create object for each rupee colour to hold:
    // value
    // probability for each surrounding tile at min
    // probability for each surrounding tile at max
//TODO: create object for all games
    // money spent to play
    // games played
    // average per game
    // total winnings
    // current game's count (min 0)
//TODO: create object for current game
    // pits left to dig
    // bombs remaining
    // bombs found
    // rupoors remaining
    // rupoors found
//TODO: create object for game difficulties
    // grid size
    // total bombs
    // total rupoors
    // cost to play
//TODO:  define what happens when a square is selected
    //TODO: create an object to choose options--undug, rupees, bomb, or rupoor
    //TODO: define what happens when a rupee is selected: calculate probabilities for all unset squares
    //TODO: define what happens when a rupoor is selected: calculate probabilities for all unset squares, update value for rupoors found
    //TODO: define what happens when a bomb is selected: end game, apply changes to average per game, total winnings
    //TODO: identify how many squares surrounding have an undesirable present
      //TODO: calculate whether move was valid based on selection made (raise an alert if not)
      //TODO: calculate probabilities based on options vs remaining % of total
//TODO: calculate likelihood of surrounding squares (edge, not corner) (1-of-6)
    // number of undesirables remaining in puzzle
    // number of rupoors found nearby
    // types of rupees found nearby
//TODO: calculate likelihood of surrounding squares (corner) (1-of-4)
    // number of undesirables remaining in puzzle
    // number of rupoors found nearby
    // types of rupees found nearby
//TODO: calculate likelihood of surrounding squares (non-edge, non-corner) (1-of-9)
    // number of undesirables remaining in puzzle
    // number of rupoors found nearby
    // types of rupees found nearby
//TODO: when a green rupee is located, mark surrounding squares as safe 
    // handle safety on the front end
    // if a safe square is marked as undesirable, raise an aler
