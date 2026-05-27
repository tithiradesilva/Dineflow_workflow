<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const route  = useRoute()
const cart   = useCartStore()

// Mobile menu open/close toggle
const mobileOpen = ref(false)

// Check if a given path is the current active route
const isActive = (path: string) => route.path === path

// Navigate to a page and close the mobile menu
function navigate(path: string) {
  router.push(path)
  mobileOpen.value = false
}

// Nav links config — easy to add more routes here
const navLinks = [
  { label: 'Home',    path: '/' },
  { label: 'Menu',    path: '/products' },
  { label: 'About',   path: '/about' },
  { label: 'Contact', path: '/contact' }
]
</script>

<template>
  <header class="navbar">
    <div class="navbar__inner">

      <!-- Brand Logo -->
      <a class="navbar__brand" @click="navigate('/')">
        <div class="navbar__brand-icon">🍳</div>
        <span class="navbar__brand-name">DineFlow</span>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="navbar__links">
        <a
          v-for="link in navLinks"
          :key="link.path"
          class="navbar__link"
          :class="{ 'navbar__link--active': isActive(link.path) }"
          @click="navigate(link.path)"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Right Actions -->
      <div class="navbar__actions">
        <!-- Cart Button (shows item count badge) -->
        <button class="navbar__cart" @click="navigate('/cart')">
          🛒 Cart
          <span v-if="cart.totalItems > 0" class="navbar__cart-badge">
            {{ cart.totalItems }}
          </span>
        </button>

        <!-- Mobile Hamburger -->
        <button
          class="navbar__hamburger"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <!-- Simple icon: ☰ when closed, ✕ when open -->
          {{ mobileOpen ? '✕' : '☰' }}
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <nav class="navbar__mobile-menu" :class="{ 'navbar__mobile-menu--open': mobileOpen }">
      <a
        v-for="link in navLinks"
        :key="link.path"
        class="navbar__mobile-link"
        :class="{ 'navbar__mobile-link--active': isActive(link.path) }"
        @click="navigate(link.path)"
      >
        {{ link.label }}
      </a>
      <!-- Cart link in mobile menu too -->
      <a class="navbar__mobile-link" @click="navigate('/cart')">
        🛒 Cart <span v-if="cart.totalItems > 0">({{ cart.totalItems }})</span>
      </a>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
// Navbar styles — variables and mixins auto-injected by vite.config.ts

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: $navbar-height;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $color-border;
  box-shadow: $shadow-sm;

  &__inner {
    @include container;
    @include flex-row($space-6);
    justify-content: space-between;
    height: 100%;
  }

  &__brand {
    @include flex-row($space-2);
    flex-shrink: 0;
    cursor: pointer;
    text-decoration: none;
  }

  &__brand-icon {
    width: 36px;
    height: 36px;
    border-radius: $radius-md;
    background: linear-gradient(135deg, $color-primary, #f87171);
    @include flex-center;
    font-size: 1.1rem;
    box-shadow: 0 4px 12px rgba($color-primary, 0.25);
    flex-shrink: 0;
  }

  &__brand-name {
    font-family: $font-heading;
    font-size: $text-xl;
    font-weight: 800;
    color: $color-secondary;
    letter-spacing: -0.5px;
  }

  // Desktop nav links — hidden on mobile
  &__links {
    @include flex-row($space-1);
    display: none;
    @include md { display: flex; }
  }

  &__link {
    padding: $space-2 $space-4;
    border-radius: $radius-md;
    font-size: $text-sm;
    font-weight: 600;
    color: $text-muted;
    cursor: pointer;
    transition: $transition-base;
    text-decoration: none;

    &:hover { color: $color-secondary; background: rgba($color-secondary, 0.05); }
    &--active { color: $color-primary; background: rgba($color-primary, 0.07); }
  }

  &__actions { @include flex-row($space-3); flex-shrink: 0; }

  // Cart button with badge
  &__cart {
    @include flex-row($space-2);
    @include btn-reset;
    padding: $space-2 $space-4;
    border-radius: $radius-md;
    background: $color-primary;
    color: #fff;
    font-size: $text-sm;
    transition: $transition-base;

    &:hover { background: $color-primary-dark; transform: translateY(-1px); }
  }

  &__cart-badge {
    min-width: 20px;
    height: 20px;
    border-radius: $radius-full;
    background: #fff;
    color: $color-primary;
    font-size: 11px;
    font-weight: 800;
    @include flex-center;
    padding: 0 $space-1;
  }

  // Hamburger — visible on mobile only
  &__hamburger {
    @include btn-reset;
    @include flex-center;
    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    color: $color-secondary;
    transition: $transition-base;
    display: flex;
    font-size: $text-lg;
    @include md { display: none; }

    &:hover { background: $color-border; }
  }

  // Mobile dropdown menu
  &__mobile-menu {
    display: none;
    position: absolute;
    top: $navbar-height;
    left: 0;
    right: 0;
    background: $color-surface;
    border-bottom: 1px solid $color-border;
    box-shadow: $shadow-lg;
    padding: $space-4;
    @include flex-col($space-2);

    &--open { display: flex; }
    @include md { display: none !important; }
  }

  &__mobile-link {
    display: block;
    padding: $space-3 $space-4;
    border-radius: $radius-md;
    font-size: $text-base;
    font-weight: 600;
    color: $text-muted;
    cursor: pointer;
    transition: $transition-base;
    text-decoration: none;

    &:hover, &--active { color: $color-primary; background: rgba($color-primary, 0.07); }
  }
}
</style>

