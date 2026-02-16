from flask import Flask, request, jsonify, make_response
from pydantic import BaseModel
from typing import List, Dict, Optional, Tuple, Set
from itertools import combinations
from flask_cors import CORS

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
  if request.method == "OPTIONS":
    # handle this special for CORS
    return _build_cors_preflight_response()

  elif request.method != "POST":
    return RuntimeError("Don't know how to handle method {}".format(request.method))

  data = request.get_json()
  board = Board(**data)

  difficulty = detect_difficulty(board.rows, board.cols)
  total_hazards = difficulty["bombs"] + difficulty["rupoors"]

  grid = {(cell.row, cell.col): cell for cell in board.cells}
  revealed = {pos: cell.number for pos, cell in grid.items() if cell.state == "revealed"}
  flagged = {pos for pos, cell in grid.items() if cell.state == "flagged"}
  hidden = {pos for pos, cell in grid.items() if cell.state == "hidden"}

  remaining_to_place = total_hazards - len(flagged)

  # force safe certain cells (neighbors of green rupees)
  forced_safe = set()

  for (r, c), value in revealed.items():
    min_h, max_h = clue_range(value)
    if max_h == 0:
      # we must be green
      for nb in neighbors(r, c, board.rows, board.cols):
        if nb in hidden:
          forced_safe.add(nb)

  # remove forced safe from hidden hazard candidates
  hidden = hidden - forced_safe

  # if forced safe eliminated too many cells
  if remaining_to_place > len(hidden):
    return jsonify({
      "status": "inconsistent",
      "probabilities": {},
      "total_configs": 0
    })

  # identify edge cells (has revealed clue beside it)
  edge_cells = set()
  for (r, c) in revealed:
    for nb in neighbors(r, c, board.rows, board.cols):
      if nb in hidden:
        edge_cells.add(nb)

  island_cells = hidden - edge_cells
  edge_list = list(edge_cells)

  total_valid = 0
  hazard_counts = {pos: 0 for pos in hidden}

  # enumerate edge configurations
  for k in range(min(len(edge_list), remaining_to_place) + 1):
    for combo in combinations(edge_list, k):

      edge_hazards = set(combo) | flagged
      remaining_after_edge = remaining_to_place - k

      # global check - do we have enough islands to hold the remaining hazards?
      if remaining_after_edge < 0 or remaining_after_edge > len(island_cells):
        continue

      valid = True

      # check constraints per revealed cell
      for (r, c), rupee_value in revealed.items():
        min_h, max_h = clue_range(rupee_value)

        count_edge = 0

        for nb in neighbors(r, c, board.rows, board.cols):
          if nb in edge_hazards:
            count_edge += 1

        # do edge hazards satisfy clue's range?
        if not (min_h <= count_edge <= max_h):
          valid = False
          break

      if not valid:
        continue

      # if we get here, edge config must be valid

      # count island combinations
      ways = nCr(len(island_cells), remaining_after_edge)
      total_valid += ways

      # edge contributions
      for pos in combo:
        hazard_counts[pos] += ways

      # island contributions
      if remaining_after_edge > 0 and len(island_cells) > 0:
        prob_per_island = remaining_after_edge / len(island_cells)
        for pos in island_cells:
          hazard_counts[pos] += ways * prob_per_island

  if total_valid == 0:
    # inconsistent state - return uniform fallback
    uniform = remaining_to_place / len(hidden) if hidden else 0
    probabilities = {f"{r},{c}": round(uniform, 4) for (r, c) in hidden}
    return jsonify({
      "status": "inconsistent",
      "probabilities": probabilities,
      "total_configs": 0
    })

  probabilities = {f"{r},{c}": round(hazard_counts[(r,c)] / total_valid, 4) for (r, c) in hidden}

  # don't forget to include forced-safe cells explicitly at 0!!!
  for (r, c) in forced_safe:
    probabilities[f"{r},{c}"] = 0.0

  return jsonify({
    "status": "success",
    "probabilities": probabilities,
    "total_configs": total_valid
  })

def nCr(n, r):
  import math
  return math.comb(n, r)

def clue_range(value: int):
  if value == 0:
    # green
    return (0, 0)
  elif value == 1:
    # blue
    return (1, 2)
  elif value == 2:
    # red
    return (3, 4)
  elif value == 3:
    # silver
    return (5, 6)
  elif value == 4:
    # gold
    return (7, 8)
  else:
    # literally anything else how did you happen
    raise ValueError("Invalid rupee number")

if __name__ == "__main__":
  app.run(host="127.0.0.1", port=5000, debug=True)
