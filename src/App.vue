<script setup>
  import { ref, watch, onMounted } from 'vue'
  import { useHydrationStore } from './stores/hydration'
  import NotificationComponent from './components/NotificationComponent.vue'
  import HomeView from "@/views/HomeView.vue"
  import StatsView from "@/views/StatsView.vue"
  import SettingsView from "@/views/SettingsView.vue"
  import {Icon} from "@iconify/vue"

  // Define the application name
  const appName = ref('DewLog') // Renamed from Drank

  // Pinia store
  const hydrationStore = useHydrationStore()

  // Reactive variable for current view
  const currentView = ref('home')

  // Watch for changes in hydration progress and show notification
  watch(() => hydrationStore.hydrationProgress, (newValue, oldValue) => {
    if (newValue > oldValue) {
      hydrationStore.showNotification('Drink logged!', '', 3)
    }
  })

  // Watch for changes in daily goal and show notification
  watch(() => hydrationStore.dailyGoal, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      hydrationStore.showNotification(`Goal updated to ${newValue} cups!`, '#25be4d', 3)
    }
  })

  // On mount, initialize the store and check for updates
  onMounted(() => {
    hydrationStore.initializeStore()
  })
</script>

<template>
  <img
    class="siteBackground"
    src="@/visuals/PageBackground.svg"
    alt="Background" aria-hidden="true"
  >
  <div id="app-container">
    <!-- Notification Component -->
    <NotificationComponent />

    <!-- Main Title -->
    <h1>{{ appName }}</h1>

    <!-- Dynamic Content based on selected tab -->
    <HomeView v-if="currentView === 'home'" />
    <StatsView v-else-if="currentView === 'stats'" />
    <SettingsView v-else-if="currentView === 'settings'" />

    <!-- Tab Bar Navigation -->
    <div class="tabBar">
      <div
        :class="{ 'selected': currentView === 'home' }"
        @click="currentView = 'home'"
      >
        <Icon icon="solar:home-angle-line-duotone" />
      </div>

      <div
        :class="{ 'selected': currentView === 'stats' }"
        @click="currentView = 'stats'"
      >
        <Icon icon="solar:pie-chart-3-line-duotone" />
      </div>

      <div
        :class="{ 'selected': currentView === 'settings' }"
        @click="currentView = 'settings'"
      >
        <Icon icon="solar:settings-line-duotone" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
  .siteBackground
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

    min-width: 100%
    min-height: 100%
    z-index: 0
    pointer-events: none
    opacity: 0.2
</style>
