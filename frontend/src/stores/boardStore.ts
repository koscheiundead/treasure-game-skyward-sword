import { defineStore } from 'pinia';
import { solve } from '../services/solverClient';

export const useBoardStore = defineStore('board', {
  state: () => ({
    rows: 4,
    cols: 5,
    totalFlags: 4,
    cells: new Map<string, any>(),
    probabilities: {} as Record<string, number>,
    remainingFlags: 0,
    validConfigurations: 0,
    solving: false,
  }),

  actions: {
    initialize(rows: number, cols: number) {
      this.rows = rows;
      this.cols = cols;

      if (rows === 4 && cols === 5) {
        this.totalFlags = 4;
      } else if (rows === 5 && cols === 6) {
        this.totalFlags = 8;
      } else if (rows === 5 && cols === 8) {
        this.totalFlags = 16;
      }

      this.remainingFlags = this.totalFlags;

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
      this.err = null;
      const result = await solve({
        ...this.serialize(),
        totalBombs: this.totalFlags
      }).then((res) => {
        console.log(res)
        this.probabilities = res.probabilities;
        this.remainingFlags = res.remainingBombs;
        this.validConfigurations = res.validConfigurations;
      }).catch((e) => {
        this.err = e;
      });
      console.log("r:", result);

      this.solving = false;
    }
  }
});
