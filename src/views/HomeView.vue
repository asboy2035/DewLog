<template>
  <div class="homeView">
    <div class="dailyHistory">
      <button
        v-for="day in hydrationStore.recentDays"
        :key="day.date"
        @click="hydrationStore.setSelectedDay(day.date)"
        :class="{ 'selected-day': hydrationStore.selectedDay === day.date }"
        class="dailyHistoryButton"
      >
        <Icon :icon="hydrationStore.selectedDay === day.date ? 'solar:check-circle-line-duotone' : 'solar:calendar-search-line-duotone'" />
        {{ day.displayDate }}
        <span v-if="day.amount !== undefined"> {{ day.amount.toFixed(1) }} cups</span>
        <span v-else> No data</span>
      </button>

      <div class="dailyHistorySpacer" />
    </div>

    <!-- Display progress for the selected day -->
    <div>
      <div class="progress">
        <div id="progress-bar" :style="{ width: hydrationStore.selectedDayProgressPercentage + '%' }"></div>
      </div>
      <p id="progress-text" :class="{ 'light': !hydrationStore.selectedDayGoalMet }">
        You've drank {{ hydrationStore.selectedDayProgressPercentage.toFixed(1) }}% of your goal
        <span v-if="!hydrationStore.isTodaySelected">on {{ hydrationStore.selectedDay }}</span>.
      </p>
      <p id="congrats-message" v-if="hydrationStore.selectedDayGoalMet">You’ve reached your goal!</p>
    </div>

    <card class="spaced flexColumn">
      <h2>Log Your Drink (Today)</h2>

      <div class="flexColumn">
        <label for="drink-type">Drink Type:</label>
        <select id="drink-type" v-model="selectedDrinkType">
          <option v-for="(multiplier, drink) in hydrationStore.drinks" :key="drink" :value="drink">
            {{ drink }} ({{multiplier}}x)
          </option>
        </select>
      </div>

      <div class="flexColumn">
        <label for="drink-amount">Amount (cups):</label>
        <input type="number" min="0" id="drink-amount" v-model.number="drinkAmount">
      </div>

      <button @click="logDrink">
        <Icon icon="solar:add-circle-line-duotone" />
        Add Drink
      </button>
    </card>

    <label for="goal">Daily Goal (cups):</label>
    <input
      type="number"
      id="goal"
      min="0"
      v-model.number="hydrationStore.dailyGoal"
    >
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useHydrationStore } from '@/stores/hydration.ts'
  import Card from "@/components/Card.vue"
  import {Icon} from '@iconify/vue'

  const hydrationStore = useHydrationStore()

  const selectedDrinkType = ref('Water')
  const drinkAmount = ref(1)

  const logDrink = () => {
    // Only log if a valid amount is entered
    if (drinkAmount.value > 0) {
      hydrationStore.logDrink(selectedDrinkType.value, drinkAmount.value)
      drinkAmount.value = 1 // Reset amount after logging
    } else {
      hydrationStore.showNotification('Please enter a valid amount!', 'red', 3)
    }
  }

  // Ensure the selectedDay is set to today when the component mounts
  onMounted(() => {
    hydrationStore.setSelectedDay(new Date().toISOString().split('T')[0])
  })
</script>

<style scoped lang="sass">
  @use "../styles/colors"

  .dailyHistory
    display: flex
    flex-wrap: nowrap
    overflow: scroll
    gap: 0.75rem
    margin-top: 1rem

  .dailyHistoryButton
    min-width: fit-content
    text-wrap: nowrap

    span
      opacity: 0.6

    &:hover
      background: var(--accentColor)
      scale: 1

    &:active
      scale: 1
</style>
