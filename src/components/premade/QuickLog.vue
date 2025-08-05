<script setup lang="ts">
  import Card from '@/components/layout/Card.vue'
  import CardTitle from '@/components/layout/CardTitle.vue'
  import HStack from '@/components/layout/HStack.vue'
  import { Icon } from '@iconify/vue'
  import { useHydrationStore } from '@/stores/hydration'
  import { ref } from 'vue'

  const hydrationStore = useHydrationStore()
  const selectedDrink = ref(Object.keys(hydrationStore.drinks)[0])
</script>

<template>
  <Card class="autoSpace spaced">
    <CardTitle
      title="Quick Log"
      icon="solar:cup-hot-line-duotone"
    />

    <select v-model="selectedDrink">
      <option
        v-for="(name, key) in hydrationStore.drinks"
        :key="key" :value="key"
      >
        {{ key }}
      </option>
    </select>

    <HStack>
      <button @click="hydrationStore.logDrink(selectedDrink, 1)">
        <Icon icon="solar:cup-paper-line-duotone" />
      </button>
      <button @click="hydrationStore.logDrink(selectedDrink, 2)">
        <HStack>
          <Icon icon="solar:cup-paper-line-duotone" />
          <Icon icon="solar:cup-paper-line-duotone" />
        </HStack>
      </button>
      <button @click="hydrationStore.logDrink(selectedDrink, 3)">
        <HStack>
          <Icon icon="solar:cup-paper-line-duotone" />
          <Icon icon="solar:cup-paper-line-duotone" />
          <Icon icon="solar:cup-paper-line-duotone" />
        </HStack>
      </button>
    </HStack>
  </Card>
</template>
