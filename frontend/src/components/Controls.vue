<script setup lang="ts">
import { useBoardStore } from "../stores/boardStore";
import { solve } from "../services/solverClient";

const store = useBoardStore();

async function solveBoard() {
  const result = await solve(store.serialize());
  store.solution = result;
}
</script>

<template>
  <div>
    <button @click="solveBoard">Solve</button>
  </div>
</template>
