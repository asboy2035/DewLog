<script setup lang="ts">
  import Card from '@/components/layout/Card.vue'
  import CardTitle from '@/components/layout/CardTitle.vue'
  import NavBar from '@/components/premade/navbar/NavBar.vue'
  import ContentView from '@/components/navigation/ContentView.vue'
  import NavigationTitle from '@/components/navigation/NavigationTitle.vue'
</script>

<template>
  <ContentView id="homeView">
    <NavigationTitle title="Home" />

    <Card>
      <CardTitle
        title="You did it!"
        icon="solar:hearts-line-duotone"
      />
      <p>This is ash's Vue template.</p>
    </Card>

    <NavBar />
  </ContentView>
</template>

<style scoped>

</style>