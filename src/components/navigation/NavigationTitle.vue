<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import HStack from "@/components/layout/HStack.vue"
import { ProgressiveBlur } from 'vue-progressive-blur'
import InteriorItem from '@/components/layout/InteriorItem.vue'

defineProps<{
  title: string
  subtitle?: string
}>()

const sentinel = ref<HTMLElement | null>(null)
const isStuck = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      isStuck.value = !entry.isIntersecting
    },
    {
      threshold: 0,
      rootMargin: '0px 0px -1px 0px' // Prevents flickering at the exact intersection point
    }
  )

  if (sentinel.value) {
    observer.observe(sentinel.value)
  }

  onBeforeUnmount(() => {
    if (sentinel.value) {
      observer.unobserve(sentinel.value)
    }
    observer.disconnect()
  })
})
</script>

<template>
  <div>
    <!-- Sentinel positioned at the top, this is what we observe -->
    <div ref="sentinel" class="sentinel" aria-hidden="true" />

    <div class="navTitleWrapper" :class="{ stuck: isStuck }">
      <h-stack class="titleContent">
        <h1 v-if="!isStuck">{{ title }}</h1>

        <interior-item
          v-else-if="isStuck"
          class="stuckTitleContent fadeIn"
        >
          <p>{{ title }}</p>
        </interior-item>

        <h-stack
          class="stuckToolbar fadeIn"
          v-if="isStuck"
        >
          <slot />
        </h-stack>

        <h1
          class="light"
          v-if="subtitle && !isStuck"
        >
          {{ subtitle }}
        </h1>

        <h-stack class="toolbar" v-if="!isStuck">
          <slot />
        </h-stack>
      </h-stack>

      <progressive-blur
        :blur="48" :border-radius="0"
        class="stuckBlur" v-if="isStuck"
      />
    </div>
  </div>
</template>

<style scoped lang="sass">
@use "@/styles/colors"

.sentinel
  position: absolute
  top: 0
  height: 1px
  width: 100%
  pointer-events: none

.navTitleWrapper
  display: flex
  justify-content: flex-start
  position: relative
  z-index: 100
  border-radius: 0
  margin-top: 2rem

  &.stuck
    position: fixed
    justify-content: center
    top: 0
    left: 0
    right: 0
    width: 100%
    padding: 0
    margin-top: 0

    .titleContent
      justify-content: center
      background: linear-gradient(to top, transparent, colors.$backgroundColor)

  .titleContent
    display: flex
    z-index: 101
    padding: 0.75rem 0.75rem 0
    width: 100%
    border-radius: 0

    .stuckTitleContent
      padding: 0.25rem 0.75rem

    .stuckToolbar
      ::v-deep(button)
        padding: 0.35rem !important

  .stuckBlur
    transform: rotate(-180deg)
    z-index: 99
</style>