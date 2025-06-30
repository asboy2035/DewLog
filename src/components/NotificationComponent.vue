<template>
  <div v-if="hydrationStore.notification" class="notification" :style="{ animationDuration: hydrationStore.notification.timeout + 's' }">
    <h3>{{ hydrationStore.notification.message }}</h3>
    <div
        class="notificationProgressBar"
        :style="{
        animationDuration: hydrationStore.notification.timeout + 's',
        backgroundColor: hydrationStore.notification.color,
        boxShadow: '0 0 3rem ' + hydrationStore.notification.color
      }"
    ></div>
  </div>
</template>

<script setup>
import { useHydrationStore } from '../stores/hydration';

const hydrationStore = useHydrationStore();
</script>

<style scoped>
/* Notification styles are mostly global, but can be scoped here if preferred */
/* The styles from the original styles.css for .notification and .notificationProgressBar are used */
</style>
