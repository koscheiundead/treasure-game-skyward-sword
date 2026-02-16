from flask import Flask, request, jsonify, make_response
from pydantic import BaseModel
from typing import List, Dict, Optional, Tuple, Set
from itertools import combinations
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
app.config['CORS_HEADERS'] = 'Content-Type'
class Cell(BaseModel):
  row: int
  col: int
  state: str # "hidden", "revealed", "flagged"
  number: Optional[int] = None

class Board(BaseModel):
  rows: int
  cols: int
  cells: List[Cell]

def detect_difficulty(rows: int, cols: int):
  if rows == 4 and cols == 5:
    return {"bombs": 4, "rupoors": 0}
  elif rows == 5 and cols == 6:
    return {"bombs": 4, "rupoors": 4}
  elif rows == 5 and cols == 8:
    return {"bombs": 8, "rupoors": 8}
  else:
    raise ValueError("Unsupported board size for Thrill Digger difficulty.")

def neighbors(r: int, c: int, rows: int, cols: int):
  for dr in [-1, 0, 1]:
    for dc in [-1, 0, 1]:
      if dr == 0 and dc == 0:
        continue
      nr, nc = r + dr, c + dc
      if 0 <= nr < rows and 0 <= nc < cols:
        yield nr, nc

def validate_configuration(board, hazard_positions: set):
  rows, cols = board.rows, board.cols

  revealed = {(cell.row, cell.col): cell.number for cell in board.cells if cell.state == "revealed"}

  for (r, c), clue in revealed.items():
    count = 0
    for nr, nc in neighbors(r, c, rows, cols):
      if (nr, nc) in hazard_positions:
        count += 1
    if count != clue:
      return False

  return True

def _build_cors_preflight_response():
  response = make_response()
  response.headers.add("Access-Control-Allow-Origin", "*")
  response.headers.add("Access-Control-Allow-Headers", "*")
  response.headers.add("Access-Control-Allow-Methods", "*")
  return response

@app.route("/solve-step", methods=['POST', 'OPTIONS'])
def solve_step():
  print("request hit early")
  if request.method == "OPTIONS":
    # handle this special for CORS
    print("options hit")
    return _build_cors_preflight_response()

  elif request.method != "POST":
    return RuntimeError("Don't know how to handle method {}".format(request.method))

  data = request.get_json()
  board = Board(**data)
  print("request hit")
  print(board)

  # parse out which board we're using
  difficulty = detect_difficulty(board.rows, board.cols)
  total_hazards = difficulty["bombs"] + difficulty["rupoors"]

  # set board state
  grid = {(c.row, c.col): c for c in board.cells}
  revealed_clues = {pos: c.number for pos, c in grid.items() if c.state == "revealed"}
  flagged_pos = {pos for pos, c in grid.items() if c.state == "flagged"}
  hidden_pos = {pos for pos, c in grid.items() if c.state == "hidden"}

  # categorize hidden cells as edge or non-edge
  edge_cells = set()
  for r, c in revealed_clues:
    for nb in neighbors(r, c, board.rows, board.cols):
      if nb in hidden_pos:
        edge_cells.add(nb)

  island_cells = hidden_pos - edge_cells
  edge_list = list(edge_cells)

  # solve edges - test every possible hazard on edge (k), (k) ranges from (0) to (total remaining hazards)
  remaining_to_find = total_hazards - len(flagged_pos)

  total_valid_global = 0
  hazard_counts = {pos: 0 for pos in hidden_pos}

  # optimization - only iterate through combinations of edge cells
  for k in range(min(len(edge_list), remaining_to_find) + 1):
    k_combos_valid = 0
    for combo in combinations(edge_list, k):
      hazard_set = set(combo) | flagged_pos

      # check if this edge configuration satisfies all revealed clues
      if validate_edge_config(revealed_clues, hazard_set, board):
        # how many ways can we pick the remaining hazards from the islands?
        remaining_after_edge = remaining_to_find - k
        if 0 <= remaining_after_edge <= len(island_cells):
          ways_to_fill_islands = nCr(len(island_cells), remaining_after_edge)

          k_combos_valid += ways_to_fill_islands
          # add to edge counts
          for pos in combo:
            hazard_counts[pos] += ways_to_fill_islands
          # add to island counts (proportionally)
          if len(island_cells) > 0 and remaining_after_edge > 0:
            island_weight = (ways_to_fill_islands * remaining_after_edge) / len(island_cells)
            for pos in island_cells:
              hazard_counts[pos] += island_weight

    total_valid_global += k_combos_valid

  # final probabilities
  probabilities = {}
  for pos in hidden_pos:
    prob = hazard_counts[pos] / total_valid_global if total_valid_global > 0 else 0
    probabilities[f"{pos[0]},{pos[1]}"] = round(prob, 4)

  return jsonify({
    "status": "success",
    "probabilities": probabilities,
    "total_configs": total_valid_global
  })

def validate_edge_config(clues, hazard_set, board):
  for (r, c), target in clues.items():
    count = 0
    for nb in neighbors(r, c, board.rows, board.cols):
      if nb in hazard_set:
        count += 1
    if count != target:
      return False
  return True

def nCr(n, r):
  import math
  return math.comb(n, r)

if __name__ == "__main__":
  app.run(host="127.0.0.1", port=5000, debug=True)
