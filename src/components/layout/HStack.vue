<template>
  <div class="hStack">
    <slot />
  </div>
</template>

<style scoped lang="sass">
  .hStack
    display: flex
    flex-direction: row
    flex-wrap: wrap
    gap: 0.5rem

    &.spaced
      column-gap: 1rem
      row-gap: 0
</style>
