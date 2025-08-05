<script setup>
  import { useHydrationStore } from '@/stores/hydration'
  import Card from '@/components/layout/Card.vue'
  import VStack from '@/components/layout/VStack.vue'
  import { ref, watch } from 'vue'

  const hydrationStore = useHydrationStore()
  const show = ref(false)

  watch(() => hydrationStore.notification, (newNotification) => {
    if (newNotification) {
      show.value = true
      setTimeout(() => {
        show.value = false
        hydrationStore.notification = null
      }, newNotification.timeout * 1000)
    }
  })
</script>

<template>
  <Transition name="notification">
    <Card
      v-if="show && hydrationStore.notification"
      class="notificationContainer"
    >
      <VStack
        class="notificationContent"
      >
        <h2>{{ hydrationStore.notification.message }}</h2>

        <div id="notificationProgressContainer">
          <div id="notificationProgressContainerInner">
            <div
              id="notificationProgressBar"
              :style="{
                animationDuration: hydrationStore.notification.timeout + 's',
                backgroundColor: hydrationStore.notification.color,
                boxShadow: '0 0 3rem ' + hydrationStore.notification.color
              }"
            />
            <div
              id="notificationProgressBarBackground"
              :style="{ animationDuration: hydrationStore.notification.timeout + 's' }"
            />
          </div>
        </div>
      </VStack>
    </Card>
  </Transition>
</template>

<style scoped lang="sass">
  @use "@/styles/colors"

  .notificationContainer
    position: fixed
    gap: 0.75rem
    top: 1rem
    left: 1rem
    width: calc(100vw - 3rem)
    margin-top: var(--safe-area-inset-top)
    max-width: 25rem
    z-index: 101

    .notificationContent
      width: calc(100% - 1rem)

      #notificationProgressContainer
        display: flex
        width: 100%
        height: 1.5rem
        border-radius: 1.5rem
        padding: 0.25rem
        background: colors.$foregroundColor

        #notificationProgressContainerInner
          position: relative
          flex-direction: row
          justify-content: flex-start
          width: 100%
          height: 100%
          border-radius: 1.5rem
          overflow: hidden

          #notificationProgressBar, #notificationProgressBarBackground
            position: absolute
            animation: progress forwards
            border-radius: 1.25rem
            height: 100%
            transition: 0.3s ease

          #notificationProgressBar
            mask: linear-gradient(to bottom right, black, black, rgba(0, 0, 0, 0.4))
            z-index: 110

          #notificationProgressBarBackground
            background: colors.$accentColor
            z-index: 109

  @keyframes progress
    0%
      width: 100%
    100%
      width: 0

  .notification-enter-active,
  .notification-leave-active
    transition: transform 0.5s ease

  .notification-enter-from,
  .notification-leave-to
    transform: translateY(calc(-100% - 1rem))
</style>