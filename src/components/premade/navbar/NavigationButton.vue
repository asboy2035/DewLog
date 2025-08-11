<script setup lang="ts">
  import { Icon } from "@iconify/vue"

  defineProps<{
    link: string
    text?: string
    icon?: string
  }>()
</script>

<template>
  <div class="navWrapper">
    <div class="toolTip" v-if="text">
      <h4>{{ text }}</h4>
    </div>

    <RouterLink :to="link">
      <button class="navigationButton" :aria-label="'Go to: ' + link">
        <Icon v-if="icon" :icon="icon" />
        <slot />
      </button>
    </RouterLink>
  </div>
</template>

<style scoped lang="sass">
  @use "@/styles/colors"

  .navigationButton
    --buttonRadius: 1.25rem
    width: 3rem
    height: 3rem
    transition: 0.2s ease-in-out
    padding: 0

  .navigationButton
    ::v-deep(svg)
      height: 1.25rem
      width: 1.25rem

  /* Tooltip Styling */
  .toolTip
    display: none
    position: absolute
    background: colors.$foregroundOpaque
    padding: 0.5rem 0.75rem
    border-radius: 1rem
    white-space: nowrap
    z-index: 25
    animation: slideIn 0.2s ease-in-out forwards

    h4
      margin: 0

  /* Show tooltip on hover */
  .navWrapper:hover .toolTip
    display: flex
</style>
