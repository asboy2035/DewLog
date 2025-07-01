<template>
  <div class="stats-view">
    <card>
      <h2>Your Streak</h2>
      <p id="streak-info">You are on a {{ hydrationStore.streak }}-day streak.</p>
    </card>

    <card>
      <h2>Daily Hydration Log</h2>
      <ul id="daily-log">
        <li v-for="log in hydrationStore.formattedDailyStats" :key="log.date">
          {{ log.date }}: {{ log.amount.toFixed(1) }} cups
        </li>
        <li v-if="hydrationStore.formattedDailyStats.length === 0">No hydration data logged yet.</li>
      </ul>
    </card>

    <card style="margin-bottom: 7rem;">
      <h2>DewLog</h2>
      <h3 style="margin: 0;">A simple and modern water tracker.</h3>
      <p style="margin: 0;">Made by <a href="https://asboy2035.com/" target="_blank">ash</a></p>
    </card>
  </div>
</template>

<script setup>
import { useHydrationStore } from '../stores/hydration.ts'
import Card from '../components/Card.vue'

const hydrationStore = useHydrationStore();
</script>

<style scoped lang="sass">
  .stats-view
    display: flex
    flex-direction: column
    gap: 0.5rem
</style>