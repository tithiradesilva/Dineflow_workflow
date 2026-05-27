<script setup lang="ts">
// DefaultLayout wraps all public pages.
// Every page automatically gets the navbar at the top and footer at the bottom.
import TheNavbar from '@/components/navbar/TheNavbar.vue'
import TheFooter from '@/components/footer/TheFooter.vue'
</script>

<template>
  <div class="layout">
    <TheNavbar />

    <!-- Page content renders here -->
    <main class="layout__main">
      <router-view />
    </main>

    <TheFooter />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  // Main content stretches to fill available space
  // so the footer always stays at the bottom
  &__main {
    flex: 1;
  }
}
</style>
