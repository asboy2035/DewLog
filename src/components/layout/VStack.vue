<template>
  <div class="vStack">
    <slot />
  </div>
</template>

<style scoped lang="sass">
  .vStack
    display: flex
    flex-direction: column
    flex-wrap: wrap
    gap: 0.5rem
    justify-content: flex-start
    align-items: flex-start

    &.spaced
      row-gap: 1rem
      column-gap: 0
</style>
