<script setup lang="ts">
  import FullScreenCover from "@/components/premade/FullScreenCover.vue"
  import Card from "@/components/layout/Card.vue"
</script>

<template>
  <FullScreenCover class="modalCover">
    <Card class="modalCard">
      <slot />
    </Card>
  </FullScreenCover>
</template>

<style scoped lang="sass">
  .modalCard
    width: fit-content
    max-width: 50rem

  .modalCover
    z-index: 5
</style>
