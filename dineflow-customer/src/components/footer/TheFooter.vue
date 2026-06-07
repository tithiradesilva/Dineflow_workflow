<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">

      <!-- Logo -->
      <div class="footer__brand" @click="router.push('/')">
        <div class="footer__brand-logo">
          <span class="footer__brand-text-1">Delicious</span>
          <span class="footer__brand-text-2">&amp; Tasty</span>
        </div>
      </div>

      <!-- Links Column -->
      <div class="footer__column">
        <span class="footer__col-title">Links</span>
        <a class="footer__link" @click="router.push('/')">Terms of Service</a>
        <a class="footer__link" @click="router.push('/')">Privacy Policy</a>
      </div>

      <!-- Divider -->
      <hr class="footer__divider" />

      <!-- Bottom: Copyright -->
      <div class="footer__bottom">
        <span class="footer__bottom-text">
          &copy; 2024 Epit Global (Pvt) Ltd. All rights reserved.
        </span>
      </div>

    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

.footer {
  background: #18181b; // Sleek premium dark gray (zinc-900)
  color: rgba(255, 255, 255, 0.7);
  padding: $space-12 0 $space-6;
  text-align: center;

  &__inner {
    @include container;
    @include flex-col($space-6);
    align-items: center;
  }

  &__brand {
    cursor: pointer;
    margin-bottom: $space-4;
    transition: transform $transition-fast;

    &:hover {
      transform: scale(1.03);
    }
  }

  &__brand-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    // font-family: 'Satisfy', cursive;
    color: #fff;
    line-height: 1.1;
  }

  &__brand-text-1 {
    font-size: 2.5rem;
    font-weight: 400;
  }

  &__brand-text-2 {
    font-size: 2.1rem;
    font-weight: 400;
    margin-top: -0.25rem;
  }

  &__column {
    @include flex-col($space-3);
    align-items: center;
    margin-bottom: $space-4;
  }

  &__col-title {
    font-family: $font-heading;
    font-size: $text-sm;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 0.5px;
    margin-bottom: $space-1;
  }

  &__link {
    font-family: $font-body;
    font-size: $text-sm;
    color: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    transition: $transition-fast;
    text-decoration: none;

    &:hover {
      color: #fff;
    }
  }

  &__divider {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    width: 100%;
    max-width: 600px;
    margin: $space-4 0 $space-2;
  }

  &__bottom {
    @include flex-row;
    justify-content: center;
  }

  &__bottom-text {
    font-family: $font-body;
    font-size: $text-xs;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
  }
}
</style>
