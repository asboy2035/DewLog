<script setup>
  import { ref, onMounted } from 'vue'
  import { useHydrationStore } from '@/stores/hydration.ts'
  import { Icon } from '@iconify/vue'
  import NavBar from '@/components/premade/navbar/NavBar.vue'
  import ContentView from '@/components/navigation/ContentView.vue'
  import NavigationTitle from '@/components/navigation/NavigationTitle.vue'
  import HStack from '@/components/layout/HStack.vue'
  import VStack from '@/components/layout/VStack.vue'
  import CardTitle from '@/components/layout/CardTitle.vue'
  import Modal from '@/components/layout/Modal.vue'
  import Card from '@/components/layout/Card.vue'
  import CalendarView from '@/components/premade/CalendarView.vue'
  import MotivationalMessage from '@/components/premade/MotivationalMessage.vue'
  import QuickLog from '@/components/premade/QuickLog.vue'
  import AboutCard from '@/components/premade/AboutCard.vue'
  import Grid from '@/components/layout/Grid.vue'

  const hydrationStore = useHydrationStore()

  const selectedDrinkType = ref('Water')
  const drinkAmount = ref(1)
  const showingLogModal = ref(false)

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

<template>
  <ContentView class="homeView">
    <NavigationTitle title="DewLog">
      <button @click="showingLogModal = !showingLogModal">
        <Icon icon="solar:pen-2-line-duotone" />
      </button>
    </NavigationTitle>

    <HStack class="dailyHistory">
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
    </HStack>
    <label for="goal">Daily Goal (cups):</label>
    <input
      type="number"
      id="goal"
      min="0"
      v-model.number="hydrationStore.dailyGoal"
    >

    <Grid class="spaced">
      <!-- Display progress for the selected day -->
      <Card class="spaced autoSpace">
        <CardTitle
          title="Progress"
          icon="solar:chart-2-line-duotone"
        />

        <VStack class="fullWidth">
          <div id="progressContainer">
            <div
              id="progressBar"
              :style="{ width: hydrationStore.selectedDayProgressPercentage + '%' }"
            />
          </div>

          <p
            id="progressText"
            :class="{ 'light': !hydrationStore.selectedDayGoalMet }"
          >
            You've drank
            {{ hydrationStore.selectedDayProgressPercentage.toFixed(1).replace('.0', '') }}%
            of your goal<span v-if="!hydrationStore.isTodaySelected">&nbsp;on {{ hydrationStore.selectedDay }}</span>.
          </p>

          <p
            id="congratsMessage"
            v-if="hydrationStore.selectedDayGoalMet"
          >
            You’ve reached your goal!
          </p>
        </VStack>
      </Card>
      <QuickLog />
    </Grid>

    <MotivationalMessage />
    <CalendarView />
    <AboutCard />

    <Modal v-if="showingLogModal">
      <CardTitle
        title="Log Drink"
        icon="solar:pen-2-line-duotone"
      />

      <VStack>
        <label for="drink-type">Drink Type:</label>
        <select id="drink-type" v-model="selectedDrinkType">
          <option v-for="(multiplier, drink) in hydrationStore.drinks" :key="drink" :value="drink">
            {{ drink }} ({{multiplier}}×)
          </option>
        </select>
      </VStack>

      <VStack>
        <label for="drink-amount">Cups:</label>
        <input type="number" min="0" id="drink-amount" v-model.number="drinkAmount">
      </VStack>

      <HStack class="fullWidth autoSpace">
        <button @click="showingLogModal = false" class="transparent">
          Cancel
        </button>
        <button @click="logDrink(); showingLogModal = false">
          <Icon icon="solar:pen-2-line-duotone" />
          Log
        </button>
      </HStack>
    </Modal>

    <NavBar />
  </ContentView>
</template>

<style scoped lang="sass">
  @use "@/styles/colors"

  .dailyHistory
    flex-wrap: nowrap
    overflow: scroll
    gap: 0.75rem
    max-width: 100%

  .dailyHistoryButton
    min-width: fit-content
    text-wrap: nowrap

    span
      opacity: 0.6

    &:hover
      background: var(--accentColor)

  #progressContainer
    display: flex
    flex-direction: row
    justify-content: flex-start
    width: calc(100% - 0.5rem)
    height: 1.5rem
    border-radius: 1.5rem
    padding: 0.25rem
    background: colors.$foregroundColor

    #progressBar
      border-radius: 1.25rem
      background: linear-gradient(to bottom right, colors.$swirly01, colors.$swirly02)
      height: 100%
      transition: 0.3s ease

  #congratsMessage
    color: colors.$accentColor
</style>
