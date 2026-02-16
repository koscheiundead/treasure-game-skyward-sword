<script setup lang="ts">
import { computed } from 'vue';
import { useBoardStore } from '../stores/boardStore';

const props = defineProps<{ coord: string }>();

const store = useBoardStore();

const cell = computed(() => store.cells.get(props.coord));
const prob = computed(() => store.probabilities ? store.probabilities[props.coord] : undefined);

const heatStyle = computed(() => {
  if (prob.value === undefined) return {};

  //gradient where green = safe and red = danger
  const p = prob.value;

  const red = Math.floor(p * 255);
  const green = Math.floor((1 - p) * 255);

  return {
    backgroundColor: `rgba(${red}, ${green}, 0, 0.5)`
  };
});
</script>

<template>
  <div v-if="prob !== undefined && cell.state === 'hidden'" class="heat-overlay" :style="heatStyle">
    <span class="prob">
      {{ (prob * 100).toFixed(0) }}%
    </span>
  </div>
</template>

<style scoped>
.heat-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  mix-blend-mode: multiply;
  transition: background-color 0.4s ease;
}

.prob {
  font-family: 'Nunito', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.6), 0px 0px 10px rgba(0,0,0,0.3);
  z-index: 2;
  mix-blend-mode: normal;
}
</style>
