<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Card from '@/components/layout/Card.vue'
  import HStack from '@/components/layout/HStack.vue'
  import { Icon } from '@iconify/vue'

  const messages = [
    "Great things are done by a series of small things brought together.",
    "The secret of getting ahead is getting started.",
    "The journey of a thousand miles begins with a single step.",
    "Don't watch the clock; do what it does. Keep going.",
    "Believe you can and you're halfway there."
  ]

  const message = ref('')

  onMounted(() => {
    message.value = messages[Math.floor(Math.random() * messages.length)]
  })
</script>

<template>
  <Card>
    <HStack>
      <Icon icon="solar:hearts-line-duotone" />
      <p>{{ message }}</p>
    </HStack>
  </Card>
</template>

<style scoped lang="sass">
p
  font-style: italic
  text-align: center
</style>
