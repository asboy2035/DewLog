<template>
  <div class="interior">
    <slot />
  </div>
</template>

<style scoped lang="sass">
@use "@/styles/colors"

a
  .interior
    width: 100%

    &:hover
      transform: translateY(-0.5rem)

    &:active
      transform: translateY(-0.15rem)

.interior
  position: relative
  --interior-radius: 1.25rem

  background: colors.$foregroundColor
  border-radius: var(--interior-radius)
  padding: 0.75rem
  transition: 0.2s ease
  backdrop-filter: saturate(150%) blur(1rem)

  &::after // Specular Highlight
      content: ""
      position: absolute
      top: 0
      bottom: 0
      right: 0
      left: 0

      border: 0.1rem solid colors.$shadowColor
      box-shadow: inset 0 0 0.5rem colors.$shadowColor
      border-radius: var(--interior-radius)
      opacity: 0.4
      pointer-events: none
      transition: 0.2s ease
      mask: conic-gradient(from -45deg, black, rgba(0, 0, 0, 0.2), black, rgba(0, 0, 0, 0.2), black)

  &::before // Shadow
      content: ""
      position: absolute
      top: 0
      bottom: 0
      right: 0
      left: 0

      box-shadow: 0 0.5rem 0.5rem colors.$shadowColor
      border-radius: var(--interior-radius)
      opacity: 0.15
      pointer-events: none
      transition: 0.2s ease

  &:hover
    &::before
      box-shadow: 0 1rem 0.75rem colors.$shadowColor
      opacity: 0.2

    &::after
      opacity: 0.7

  &:active
    &::before
      box-shadow: 0 0.35rem 0.55rem colors.$shadowColor

::v-deep(svg)
  width: 3rem
  height: 3rem

@media (max-width: 35rem)
  .interior
    --interior-radius: 1.25rem
    padding: 0.5rem
</style>
