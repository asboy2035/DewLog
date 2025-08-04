<script setup lang="ts">
  import NavigationButton from '@/components/premade/navbar/NavigationButton.vue'
  import HStack from '@/components/layout/HStack.vue'
</script>

<template>
  <h-stack>
    <NavigationButton
      link="/"
      icon="solar:question-square-line-duotone"
      text="No Navigation Links"
    />
  </h-stack>
</template>
