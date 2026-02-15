<script setup lang="ts">
import { useBoardStore } from "../stores/boardStore";
import Cell from "./Cell.vue";

const store = useBoardStore();
</script>

<template>
  <div class="board" :style="{gridTemplateColumns: `repeat(${store.cols}, 200px)`}">
    <Cell v-for="[coord] in store.cells" :key="coord" :coord="coord"/>
  </div>
</template>

<style>
.board {
  display: grid;
  gap: 4px;
}
</style>
