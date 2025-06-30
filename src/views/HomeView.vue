<template>
  <div class="home-view">
    <label for="goal">Daily Goal (cups):</label>
    <input
        type="number"
        id="goal"
        min="0"
        v-model.number="hydrationStore.dailyGoal"
    >

    <div class="progress">
      <div id="progress-bar" :style="{ width: hydrationStore.progressPercentage + '%' }"></div>
    </div>
    <p id="progress-text" :class="{ 'light': !hydrationStore.goalMet }">
      You've drank {{ hydrationStore.progressPercentage.toFixed(1) }}% of your goal.
    </p>
    <p id="congrats-message" v-if="hydrationStore.goalMet">You’ve reached your goal!</p>

    <card class="spaced">
      <h2>Log Your Drink</h2>

      <label for="drink-type">Drink Type:</label>
      <select id="drink-type" v-model="selectedDrinkType">
        <option v-for="(multiplier, drink) in hydrationStore.drinks" :key="drink" :value="drink">
          {{ drink }}
        </option>
      </select>

      <label for="drink-amount">Amount (cups):</label>
      <input type="number" min="0" id="drink-amount" v-model.number="drinkAmount">

      <button @click="logDrink">Add Drink</button>
    </card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHydrationStore } from '../stores/hydration.js'
import Card from "@/components/Card.vue"

const hydrationStore = useHydrationStore()

const selectedDrinkType = ref('Water')
const drinkAmount = ref(1)

const logDrink = () => {
  hydrationStore.logDrink(selectedDrinkType.value, drinkAmount.value)
  drinkAmount.value = 1 // Reset amount after logging
}
</script>

<style scoped>
/* Scoped styles for HomeView if needed, otherwise global styles apply */
</style>
