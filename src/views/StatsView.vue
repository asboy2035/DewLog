<template>
  <div class="stats-view">
    <div class="container">
      <h2>Your Streak</h2>
      <p id="streak-info">You are on a {{ hydrationStore.streak }}-day streak.</p>
    </div>

    <div class="container">
      <h2>Daily Hydration Log</h2>
      <ul id="daily-log">
        <li v-for="log in hydrationStore.formattedDailyStats" :key="log.date">
          {{ log.date }}: {{ log.amount.toFixed(1) }} cups
        </li>
        <li v-if="hydrationStore.formattedDailyStats.length === 0">No hydration data logged yet.</li>
      </ul>
    </div>

    <div class="container" style="margin-bottom: 7rem;">
      <h2>HydroFlow</h2>
      <h3 style="margin: 0;">A simple and modern water tracker.</h3>
      <p style="margin: 0;">Made by <a href="https://asboy2035.pages.dev/" target="_blank">ash</a></p>
    </div>
  </div>
</template>

<script setup>
import { useHydrationStore } from '../stores/hydration.js';

const hydrationStore = useHydrationStore();
</script>

<style scoped>
/* Scoped styles for StatsView if needed */
</style>
