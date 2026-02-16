<script setup lang="ts">
import { ref } from 'vue';
import { useBoardStore } from "../stores/boardStore";

const store = useBoardStore();
const level = ref('beginner');

function newGame() {

  if (level.value === 'beginner') {
    store.initialize(4, 5);
  } else if (level.value === 'intermediate') {
    store.initialize(5, 6);
  } else if (level.value === 'expert') {
    store.initialize(5, 8);
  }
}
</script>

<template>
  <div class="controls">
    <label><input type="radio" name="level" v-model="level" value="beginner">Beginner (4x5, 4 bombs, 0 rupoors)</label><br>
    <label><input type="radio" name="level" v-model="level" value="intermediate">Intermediate (5x6, 4 bombs, 4 rupoors)</label><br>
    <label><input type="radio" name="level" v-model="level" value="expert">Expert (5x8, 8 bombs, 8 rupoors)</label><br>
    <button @click="newGame">New Game</button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
  border: 2px solid #fbbf24;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(56, 189, 248, 0.2);
  font-family: 'Cinzel', serif;
  color: #1e293b;
  max-width: 400px;
  margin: 0 auto 24px auto;
}

label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1.1rem;
  transition: color 0.3s;
}

label:hover {
  color: #b45309;
}

input[type="radio"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #fbbf24;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

input[type="radio"]:checked {
  background: #fbbf24;
  box-shadow: 0 0 10px #fcd34d;
}

button {
  margin-top: 16px;
  padding: 12px 24px;
  background: #1e293b;
  color: #fbbf24;
  border: 2px solid #fbbf24;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button:hover {
  background: #fbbf24;
  color: #1e293b;
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.5);
  transform: translateY(-2px);
}
</style>
