<script setup lang="ts">
import { useHydrationStore } from '@/stores/hydration'
import { computed } from 'vue'
import Card from '@/components/layout/Card.vue'
import CardTitle from '@/components/layout/CardTitle.vue'
import Grid from '@/components/layout/Grid.vue'
import InteriorItem from '@/components/layout/InteriorItem.vue'

const hydrationStore = useHydrationStore()

const weeks = computed(() => {
  const weeks: any[] = []
  let currentWeek: any[] = []
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0)

  for (let i = 0; i < startDate.getDay(); i++) {
    currentWeek.push(null)
  }

  for (let i = 1; i <= endDate.getDate(); i++) {
    const date = new Date(year, month, i)
    const dateString = date.toISOString().split('T')[0]
    const dayData = hydrationStore.getDayData(dateString)
    currentWeek.push({
      date: dateString,
      dayOfMonth: i,
      goalMet: dayData ? dayData.total >= hydrationStore.dailyGoal : false,
    })
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null)
    }
    weeks.push(currentWeek)
  }
  return weeks
})
</script>

<template>
  <Grid class="spaced">
    <Card class="calendarCard">
      <CardTitle
        title="Monthly Overview"
        icon="solar:calendar-line-duotone"
      />

      <div class="calendar">
        <div class="dayHeader" v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day">{{ day }}</div>
        <div class="day" v-for="(day, index) in weeks.flat()" :key="index" :class="{ 'goal-met': day?.goalMet, 'goal-not-met': day && !day.goalMet }">
          {{ day?.dayOfMonth }}
        </div>
      </div>
    </Card>

    <Card>
      <CardTitle
        title="Stats"
        icon="solar:pie-chart-line-duotone"
      />

      <InteriorItem>
        <p class="light">Streak</p>
        <h2>{{ hydrationStore.streak }} day</h2>
      </InteriorItem>

      <h3>Log</h3>
      <ul id="dailyLog">
        <li
          v-for="log in hydrationStore.formattedDailyStats"
          :key="log.date"
        >
          {{ log.date }}: {{ log.amount.toFixed(1) }} cups
        </li>

        <li
          v-if="hydrationStore.formattedDailyStats.length === 0"
        >
          No hydration data logged yet.
        </li>
      </ul>
    </Card>
  </Grid>
</template>

<style scoped lang="sass">
  @use "@/styles/colors"

  .overviewInfo
    align-items: flex-start

  .calendar
    display: grid
    grid-template-columns: repeat(7, 1fr)
    gap: 0.5rem
    margin-top: 1rem
  
  .dayHeader
    font-weight: bold
    text-align: center
    opacity: 0.7
  
  .day
    display: flex
    text-align: center
    padding: 0.5rem
    border-radius: 50%
    aspect-ratio: 1/1
    align-items: center
    justify-content: center
  
  .goal-met
    background-color: colors.$accentColor

  .goal-not-met
    background-color: rgba(255, 80, 246, 0.2)

  #dailyLog
    display: flex
    flex-direction: column
    overflow: scroll

    li
      display: list-item
</style>
