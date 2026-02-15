<script setup>
import GameBoard from './components/GameBoard.vue';
import { useBoardStore } from './stores/boardStore';

const store = useBoardStore();

store.initialize();
</script>

<template>
  <div>Hello World</div>
  <GameBoard/>
</template>

<style scoped>
</style>
