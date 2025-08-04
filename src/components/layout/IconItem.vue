<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import InteriorItem from "@/components/layout/InteriorItem.vue"

  defineProps<{
    name: string
    link?: string
    icon: string
  }>()
</script>

<template>
  <a v-if="link" :href="link" target="_blank" rel="noopener noreferrer">
    <interior-item class="centered">
      <Icon :icon="icon" width="48" height="48" />
      <p>{{ name }}</p>
    </interior-item>
  </a>

  <interior-item v-if="!link" class="centered">
    <Icon :icon="icon" width="48" height="48" />
    <p>{{ name }}</p>
  </interior-item>
</template>
