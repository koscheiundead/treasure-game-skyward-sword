<script setup lang="ts">
import { computed, ref } from 'vue';
import { useBoardStore } from '../stores/boardStore';
import RupeeSelector from './RupeeSelector.vue';
import HeatOverlay from './HeatOverlay.vue';

const props = defineProps<{ coord: string }>();
const store = useBoardStore();

const showSelector = ref(false);

const cell = computed(() => store.cells.get(props.coord));

function openSelector() {
  if (cell.value.state === "hidden") {
    showSelector.value = true;
  }
}

function selectRupee(rupee: string) {
  store.setRupee(props.coord, rupee);
  showSelector.value = false;
}

function flag() {
  store.flagCell(props.coord);
}

function closeCell() {
  showSelector.value = false;
}
</script>

<template>
  <div class="cell" @click.self="openSelector" @contextmenu.prevent="flag">
    <span v-if="cell.state === 'revealed'">{{ cell.rupee }}</span>

    <span v-if="cell.state === 'flagged'">🚩</span>

    <HeatOverlay :coord="coord" />

    <RupeeSelector v-if="showSelector" @select="selectRupee" @close="closeCell"/>
  </div>
</template>

<style>
.cell {
  width: 100%;
  height: 150px;
  position: relative;
  background: linear-gradient(145deg, #e7e5e4, #d6d3d1);
  border-radius: 12px;
  box-shadow: 4px 4px 8px #a8a29e, -4px -4px 8px #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  font-weight: 800;
  color: #44403c;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-out;
  overflow: hidden;
}

.cell:hover {
  transform: translateY(-4px);
  box-shadow: 6px 6px 12px #a8a29e, -6px -6px 12px #ffffff;
}

.cell:active {
  transform: translateY(0);
  box-shadow: inset 4px 4px 8px #a8a29e, inset -4px -4px 8px #ffffff;
}
</style>
