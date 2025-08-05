<template>
  <ContentView class="settingsView">
    <NavigationTitle title="Settings" />

    <Card>
      <CardTitle
        title="Reminders"
        icon="solar:bell-line-duotone"
      />

      <button @click="requestNotificationPermission">
        <Icon icon="solar:bell-line-duotone" />
        Enable Notifications
      </button>

      <VStack class="reminderInput">
        <input type="time" v-model="newReminderTime">
        <button @click="addReminder">
          <Icon icon="solar:add-circle-line-duotone" />
          Add Reminder
        </button>
      </VStack>

      <ul class="remindersList">
        <li v-for="(reminder, index) in hydrationStore.reminders" :key="index">
          <span>{{ reminder.time }}</span>
          <button @click="toggleReminder(index)">
            {{ reminder.enabled ? 'Disable' : 'Enable' }}
          </button>
          <button @click="removeReminder(index)" class="remove-btn">Remove</button>
        </li>
        <li v-if="hydrationStore.reminders.length === 0">No reminders set.</li>
      </ul>
    </Card>

    <Card>
      <CardTitle
        title="Smart Mode"
        icon="solar:stars-line-duotone"
      />

      <div class="smartModeToggle">
        <p>Enable Smart Reminders (Every 2 hours, 8 AM - 8 PM)</p>

        <label class="switch">
          <input type="checkbox" v-model="hydrationStore.smartModeEnabled" @change="hydrationStore.toggleSmartMode">
          <span class="slider round"></span>
        </label>
      </div>
    </Card>

    <Card>
      <CardTitle
        title="Data Management"
        icon="solar:ssd-round-line-duotone"
      />

      <Grid class="tight">
        <InteriorItem
          @click="exportData"
        >
          <Icon icon="solar:export-line-duotone" />
          Export
        </InteriorItem>
        <label for="import-file" class="file-input-label">
          <InteriorItem
            @click="exportData"
            class="label"
          >
            <Icon icon="solar:import-line-duotone" />
            Import
          </InteriorItem>
        </label>
        <input type="file" id="import-file" @change="handleImport" accept="application/json">
      </Grid>
    </Card>

    <AboutCard />

    <NavBar />
  </ContentView>
</template>

<script setup>
  import { ref } from 'vue'
  import { useHydrationStore } from '@/stores/hydration.ts'
  import { Icon } from '@iconify/vue'
  import Card from '@/components/layout/Card.vue'
  import NavBar from '@/components/premade/navbar/NavBar.vue'
  import ContentView from '@/components/navigation/ContentView.vue'
  import NavigationTitle from '@/components/navigation/NavigationTitle.vue'
  import CardTitle from '@/components/layout/CardTitle.vue'
  import VStack from '@/components/layout/VStack.vue'
  import Grid from '@/components/layout/Grid.vue'
  import InteriorItem from '@/components/layout/InteriorItem.vue'
  import AboutCard from '@/components/premade/AboutCard.vue'

  const hydrationStore = useHydrationStore()
  const newReminderTime = ref('08:00') // Default reminder time
  
  const requestNotificationPermission = () => {
    hydrationStore.requestNotificationPermission()
  }
  
  const addReminder = () => {
    if (newReminderTime.value) {
      hydrationStore.addReminder(newReminderTime.value)
      newReminderTime.value = '08:00' // Reset to default after adding
    } else {
      hydrationStore.showNotification(
        'Please select a time for the reminder.', 
        'orange', 3
      )
    }
  }
  
  const toggleReminder = (index) => {
    hydrationStore
      .toggleReminder(index)
  }
  
  const removeReminder = (index) => {
    hydrationStore
      .removeReminder(index)
  }
  
  const exportData = () => {
    hydrationStore
      .exportData()
  }
  
  const handleImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      hydrationStore
        .importData(file)
    }
  }
</script>

<style scoped lang="sass">
  @use "@/styles/colors"
  
  .reminderInput
    display: flex
    gap: 0.5rem
    margin-top: 1rem

  .remindersList
    list-style: none
    padding: 0
    margin-top: 1rem

  .remindersList li
    display: flex
    justify-content: space-between
    align-items: center
    padding: 0.5rem 0
    border-bottom: 1px solid rgba(0, 0, 0, 0.1)

  .remindersList li:last-child
    border-bottom: none

  .remindersList button
    margin-left: 0.5rem
    padding: 0.3rem 0.6rem
    font-size: small

  .remindersList .remove-btn
    background-color: #ff4d4d
    color: white

  .file-input-label
    opacity: 1
    width: 100%

    .label
      width: 100%

  #import-file
    display: none /* Hide the actual file input */

  /* Styles for the toggle switch */
  .smartModeToggle
    display: flex
    align-items: center
    justify-content: space-between
    margin-top: 1rem
    padding: 0.5rem 0

  .switch
    position: relative
    display: inline-block
    width: 40px
    height: 24px

  .switch input
    opacity: 0
    width: 0
    height: 0

  .slider
    position: absolute
    cursor: pointer
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: #ccc
    -webkit-transition: .4s
    transition: .4s

  .slider:before
    position: absolute
    content: ""
    height: 16px
    width: 16px
    left: 4px
    bottom: 4px
    background-color: white
    -webkit-transition: .4s
    transition: .4s

  input:checked + .slider
    background-color: var(--primary-color)

  input:focus + .slider
    box-shadow: 0 0 1px var(--primary-color)

  input:checked + .slider:before
    -webkit-transform: translateX(16px)
    -ms-transform: translateX(16px)
    transform: translateX(16px)

  /* Rounded sliders */
  .slider.round
    border-radius: 24px

  .slider.round:before
    border-radius: 50%
</style>
