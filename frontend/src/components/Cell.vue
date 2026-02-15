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
</script>

<template>
  <div class="cell" @click="openSelector" @contextmenu.prevent="flag">
    <span v-if="cell.state === 'revealed'">{{ cell.rupee }}</span>

    <span v-if="cell.state === 'flagged'">🚩</span>

    <HeatOverlay :coord="coord" />

    <RupeeSelector v-if="showSelector" @select="selectRupee" @close="showSelector = false"/>
  </div>
</template>

<style></style>
