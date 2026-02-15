<script setup lang="ts">
const rupees = ["green", "blue", "red", "silver", "gold"];
</script>

<template>
  <div class="selector">
    <button v-for="r in rupees" :key="r" @click="$emit('select', r)">{{ r }}</button>
    <button @click="$emit('close')">X</button>
  </div>
</template>
