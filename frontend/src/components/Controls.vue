<script setup lang="ts">
import { useBoardStore } from "../stores/boardStore";
import { solve } from "../services/solverClient";

const store = useBoardStore();

function newGame() {
  let res = prompt("Enter difficulty (1: Beginner, 2: Intermediate, 3: Expert): ");

  if (res) {
    res = res.trim()
    if (res === '1') {
      store.initialize(4, 5);
    } else if (res === '2') {
      store.initialize(5, 6);
    } else if (res === '3') {
      store.initialize(5, 8);
    }
  }
}
</script>

<template>
  <div>
    <button @click="newGame">New Game</button>
  </div>
</template>
