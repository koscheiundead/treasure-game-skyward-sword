from flask import Flask
from pydantic import BaseModel
from typing import List, Dict, Optional, Tuple
from itertools import combinations
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
class Cell(BaseModel):
  row: int
  cor: int
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

@app.post("/solve-step")
def solve_step(board: Board):
  difficulty = detect_difficulty(board.rows, board.cols)
  total_hazards = difficulty["bombs"] + difficulty["rupoors"]

  all_positions = [(r, c) for r in range(board.rows) for c in range(board.cols)]

  revealed_or_flagged = {(cell.row, cell.col) for cell in board.cells if cell.state in ("revealed", "flagged")}

  hidden_positions = [pos for pos in all_positions if pos not in revealed_or_flagged]

  valid_configurations = []
  hazard_counts: Dict[Tuple[int, int], int] = {pos: 0 for pos in hidden_positions}

  for combo in combinations(hidden_positions, total_hazards):
    hazard_set = set(combo)

    if validate_configuration(board, hazard_set):
      valid_configurations.append(hazard_set)
      for pos in hazard_set:
        hazard_counts[pos] += 1

  total_valid = len(valid_configurations)

  probabilities = {}

  if total_valid > 0:
    for pos in hidden_positions:
      probabilities[f"{pos[0]},{pos[1]}"] = hazard_counts[pos] / total_valid
  else:
    uniform = total_hazards / len(hidden_positions) if hidden_positions else 0
    for pos in hidden_positions:
      probabilities[f"{pos[0]},{pos[1]}"] = uniform

  return {
    "probabilities": probabilities,
    "validConfigurations": total_valid,
    "totalHazards": total_hazards
  }
