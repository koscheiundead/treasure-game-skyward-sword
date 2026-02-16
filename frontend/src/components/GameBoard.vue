<script setup lang="ts">
import { useBoardStore } from "../stores/boardStore";
import Cell from "./Cell.vue";

const store = useBoardStore();
</script>

<template>
  <div class="board" :style="{gridTemplateColumns: `repeat(${store.cols}, 150px)`}">
    <Cell v-for="[coord] in store.cells" :key="coord" :coord="coord"/>
  </div>
</template>

<style>
.board {
  display: grid;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(251, 191, 36, 0.4);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.5);
  margin: 0 auto;
  width: max-content;
}
</style>
