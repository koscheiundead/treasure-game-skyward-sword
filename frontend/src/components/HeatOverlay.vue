<script setup lang="ts">
import { computed } from 'vue';
import { useBoardStore } from '../stores/boardStore';

const props = defineProps<{ coord: string }>();

const store = useBoardStore();

const cell = computed(() => store.cells.get(props.coord));
const prob = computed(() => store.probabilities[props.coord]);

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
  align-items: flex-end;
  justify-content: flex-end;
  padding: 4px;
  font-size: 10px;
  font-weight: bold;
  pointer-events: none;
}

.prob {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
}
</style>
