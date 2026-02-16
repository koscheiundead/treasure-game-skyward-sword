<script setup lang="ts">
const rupees = ["green", "blue", "red", "silver", "gold"];
</script>

<template>
  <div class="selector" @click.stop>
    <button v-for="r in rupees" :key="r" @click="$emit('select', r)">{{ r }}</button>
    <button @click="$emit('close')">X</button>
  </div>
</template>

<style scoped>
.selector {
  position: absolute;
  inset: -10px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid #fbbf24;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 14px;
  z-index: 10;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.5);
  border-radius: 8px;
  color: white;
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #fbbf24;
  color: #0f172a;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
}

button:last-child {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #ef4444;
}

button:last-child:hover {
  background: #ef4444;
  color: white;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
