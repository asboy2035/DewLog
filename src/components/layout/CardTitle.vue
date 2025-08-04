<script setup lang="ts">
  import { Icon } from "@iconify/vue"
  import HStack from "@/components/layout/HStack.vue"

  defineProps<{
    title: string
    icon: string
  }>()
</script>

<template>
  <h-stack class="cardTitle">
    <icon :icon="icon" />
    <h2>{{ title }}</h2>
  </h-stack>
</template>

<style scoped lang="sass">
  ::v-deep(svg)
    width: 1.5rem
    height: 1.5rem

  .cardTitle
    gap: 0.5rem
    margin-bottom: 0.5rem
    padding: 0.25rem 0.3rem

    h2
      margin: 0
</style>