<script setup lang="ts">

</script>

<template>
  <div class="contentView">
    <slot />
  </div>
</template>

<style scoped lang="sass">
  :root
    --contentPadding: 3rem 1rem 0

  .contentView
    display: flex
    flex-direction: column
    align-items: flex-start
    width: calc(100vw - 3rem)
    max-width: 55rem
    min-height: 100vh
    padding: var(--contentPadding)
    gap: 0.5rem

  @media (max-width: 35rem)
    :root
      --contentPadding: 0.5rem

    .contentView
      width: calc(100vw - 1rem)
</style>
