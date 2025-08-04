<script setup lang="ts">
  import NavigationButton from '@/components/premade/navbar/NavigationButton.vue'
  import HStack from '@/components/layout/HStack.vue'
</script>

<template>
  <h-stack>
    <NavigationButton
      link="/"
      icon="solar:home-angle-line-duotone"
      text="Home"
    />

    <NavigationButton
      link="/stats"
      icon="solar:pie-chart-line-duotone"
      text="Stats"
    />

    <NavigationButton
      link="/settings"
      icon="solar:settings-line-duotone"
      text="Settings"
    />
  </h-stack>
</template>
