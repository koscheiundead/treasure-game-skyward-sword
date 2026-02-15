import { defineStore } from 'pinia';
import { solve } from '../services/solverClient';

export const useBoardStore = defineStore('board', {
  state: () => ({
    rows: 4,
    cols: 5,
    totalBombs: 4,
    cells: new Map<string, any>(),
    probabilities: {} as Record<string, number>,
    remainingBombs: 0,
    validConfigurations: 0,
    solving: false
  }),

  actions: {
    initialize(rows: number, cols: number) {
      this.rows = rows;
      this.cols = cols;
      this.cells.clear();
      this.probabilities = {};

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          this.cells.set(`${r},${c}`, {
            state: "hidden",
            rupee: null
          });
        }
      }
    },

    setRupee(coord: string, rupee: string) {
      const cell = this.cells.get(coord);
      cell.state = "revealed";
      cell.rupee = rupee;
      this.solveBoard();
    },

    flagCell(coord: string) {
      const cell = this.cells.get(coord);
      cell.state = cell.state === "flagged" ? "hidden" : "flagged";
      this.solveBoard();
    },

    serialize() {
      return {
        rows: this.rows,
        cols: this.cols,
        cells: Array.from(this.cells.entries()).map(([key, value]) => {
          const [row, col] = key.split(",").map(Number);
          return { row, col, state: value.state, number: this.rupeeToNumber(value.rupee) };
        })
      };
    },

    rupeeToNumber(rupee: string | null) {
      const map: Record<string, number> = {
        green: 0,
        blue: 1,
        red: 2,
        silver: 3,
        gold: 4
      };

      return rupee ? map[rupee] : null;
    },

    async solveBoard() {
      this.solving = true;
      const result = await solve({
        ...this.serialize(),
        totalBombs: this.totalBombs
      });

      this.probabilities = result.probabilities;
      this.remainingBombs = result.remainingBombs;
      this.validConfigurations = result.validConfigurations;

      this.solving = false;
    }
  }
});
