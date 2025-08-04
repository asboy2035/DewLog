<script setup lang="ts">
  import InteriorItem from '@/components/layout/InteriorItem.vue'
  import NavigationLinks from '@/components/premade/navbar/NavigationLinks.vue'
  import VStack from '@/components/layout/VStack.vue'
</script>

<template>
  <VStack class="navBarContainer">
    <slot />

    <InteriorItem class="navBar">
      <NavigationLinks />
    </InteriorItem>
  </VStack>
</template>

<style scoped lang="sass">
  .navBarContainer
    position: sticky
    flex-wrap: wrap
    bottom: 1rem
    max-width: calc(100vw - 2rem)
    z-index: 19
    align-items: center
    margin-top: auto

  .navBar
    --interior-radius: 2rem
    flex-direction: row
    z-index: 20
    padding: 0.75rem
</style>