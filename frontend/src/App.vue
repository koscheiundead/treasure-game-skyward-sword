<script setup>
import GameBoard from './components/GameBoard.vue';
import { useBoardStore } from './stores/boardStore';

const store = useBoardStore();

console.log(store.cells);
store.initialize(4, 5);
console.log(store.cells);
</script>

<template>
  <div>Hello World</div>
  <GameBoard/>
</template>

<style scoped>
</style>
