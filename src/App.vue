<script setup lang="ts">
  import { ProgressiveBlur } from 'vue-progressive-blur'
</script>

<template>
  <h1 class="hidden">Your CSS is disabled!</h1>
  <img
    id="siteBackground"
    src="/PageBackground.svg"
    alt="Background" aria-hidden="true"
  />

  <RouterView />

  <div class="progBlurContainer">
    <progressive-blur class="progBlur" :blur="48" :border-radius="0"/>
  </div>
</template>

<style scoped lang="sass">
  $blurHeight: 7rem
  $blurTop: calc(100vh - $blurHeight)
  $blurTop: calc(100dvh - $blurHeight)

  #siteBackground
    position: fixed
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

    min-width: 100%
    min-height: 100%
    z-index: 0
    pointer-events: none
    opacity: 0.2

  .progBlurContainer
    position: fixed
    top: 0
    bottom: 0 !important
    left: 0
    right: 0
    z-index: 9
    pointer-events: none

    .progBlur
      left: 0
      right: 0
      bottom: 0
      height: $blurHeight
      z-index: 10
      margin-top: $blurTop
</style>
