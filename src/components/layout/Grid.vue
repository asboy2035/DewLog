<template>
  <div class="grid edgeToEdge">
    <slot />
  </div>
</template>

<style scoped lang="sass">
  .grid
    display: grid
    width: 100%
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr))
    align-items: stretch

    *
      display: inline-flex

    &.tight
      grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr))
      width: 100%

      .card
        width: calc(100% - 1.5rem)
</style>
