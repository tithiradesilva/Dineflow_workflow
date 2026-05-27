<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navLinks = [
  { label: 'Home',    path: '/' },
  { label: 'Menu',    path: '/products' },
  { label: 'Cart',    path: '/cart' },
  { label: 'About',   path: '/about' },
  { label: 'Contact', path: '/contact' }
]

const helpLinks = [
  { label: 'How it Works', path: '/about' },
  { label: 'Contact Us',   path: '/contact' }
]
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">

      <!-- Top: Brand + Link columns -->
      <div class="footer__top">

        <!-- Brand Column -->
        <div class="footer__brand">
          <div class="footer__brand-logo">
            <div class="footer__brand-icon">🍳</div>
            <span class="footer__brand-name">DineFlow</span>
          </div>
          <p class="footer__brand-tagline">
            Scan, browse, and order from your table — no waiting, no hassle.
          </p>
        </div>

        <!-- Nav Links Column -->
        <div class="footer__column">
          <span class="footer__col-title">Navigation</span>
          <a
            v-for="link in navLinks"
            :key="link.path"
            class="footer__link"
            @click="router.push(link.path)"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Help Column -->
        <div class="footer__column">
          <span class="footer__col-title">Help</span>
          <a
            v-for="link in helpLinks"
            :key="link.path"
            class="footer__link"
            @click="router.push(link.path)"
          >
            {{ link.label }}
          </a>
        </div>
      </div>

      <!-- Bottom: Copyright -->
      <div class="footer__bottom">
        <span class="footer__bottom-text">
          &copy; {{ new Date().getFullYear() }} DineFlow. Built for seamless dining.
        </span>
      </div>

    </div>
  </footer>
</template>

<style lang="scss" scoped>
// Footer component styles — variables auto-injected by vite.config.ts

.footer {
  background: $color-secondary;
  color: rgba(255, 255, 255, 0.7);
  padding: $space-12 0 $space-6;

  &__inner { @include container; }

  &__top {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-8;
    padding-bottom: $space-8;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    @include md { grid-template-columns: 1.5fr 1fr 1fr; }
  }

  &__brand {
    @include flex-col($space-3);
    align-items: flex-start;
  }

  &__brand-logo { @include flex-row($space-2); }

  &__brand-icon {
    width: 36px;
    height: 36px;
    border-radius: $radius-md;
    background: $color-primary;
    @include flex-center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  &__brand-name {
    font-family: $font-heading;
    font-size: $text-xl;
    font-weight: 800;
    color: #fff;
  }

  &__brand-tagline {
    font-size: $text-sm;
    color: rgba(255, 255, 255, 0.55);
    max-width: 240px;
    line-height: 1.6;
  }

  &__column {
    @include flex-col($space-3);
    align-items: flex-start;
  }

  &__col-title {
    font-family: $font-heading;
    font-size: $text-xs;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  &__link {
    font-size: $text-sm;
    color: rgba(255, 255, 255, 0.65);
    cursor: pointer;
    transition: $transition-fast;
    text-decoration: none;

    &:hover { color: #fff; }
  }

  &__bottom {
    padding-top: $space-6;
    @include flex-row;
    justify-content: center;
  }

  &__bottom-text {
    font-size: $text-xs;
    color: rgba(255, 255, 255, 0.35);
    text-align: center;
  }
}
</style>
