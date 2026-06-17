<script setup lang="ts">
import TheNavbar from '@/components/navbar/TheNavbar.vue'
import TheFooter from '@/components/footer/TheFooter.vue'
import LoginModal from '@/components/ui/LoginModal.vue'
</script>

<template>
  <div class="layout">
    <TheNavbar />

    <main class="layout__main">
      <router-view />
    </main>

    <TheFooter />
    <LoginModal />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
  }
}
</style>
