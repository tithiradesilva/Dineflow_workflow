<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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

// Nav links config aligned with the screenshot: Home, Shop, About Us, Contact Us
const navLinks = [
  { label: 'Home',       path: '/' },
  { label: 'Shop',       path: '/products' },
  { label: 'About Us',   path: '/about' },
  { label: 'Contact Us', path: '/contact' }
]

// Dynamic transparency logic on scroll
const isScrolled = ref(false)

function handleScroll() {
  if (route.path === '/') {
    isScrolled.value = window.scrollY > 60
  } else {
    isScrolled.value = true
  }
}

// Reset state on route change
watch(
  () => route.path,
  (newPath) => {
    if (newPath !== '/') {
      isScrolled.value = true
    } else {
      isScrolled.value = window.scrollY > 60
    }
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="navbar" :class="{ 'navbar--transparent': !isScrolled }">
    <div class="navbar__inner">

      <!-- Brand Logo (Left) -->
      <a class="navbar__brand" @click="navigate('/')">
        <img class="navbar__logo-img" src="@/assets/logoOriginal.png" alt="DineFlow Logo" />
      </a>

      <!-- Desktop Nav Links (Center) -->
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

      <!-- Right Actions (Language, Cart, Profile, Hamburger) -->
      <div class="navbar__actions">
        <!-- Language Switcher -->
        <div class="navbar__language">
          <span>En</span>
          <svg class="navbar__language-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        <!-- Cart Action Icon -->
        <button class="navbar__action-btn navbar__cart" @click="navigate('/cart')" aria-label="View Cart">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-svg">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span v-if="cart.totalItems > 0" class="navbar__cart-badge">
            {{ cart.totalItems }}
          </span>
        </button>

        <!-- Account Profile Action Icon -->
        <button class="navbar__action-btn navbar__profile" @click="navigate('/')" aria-label="User Account">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-svg">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        <!-- Mobile Hamburger Toggle -->
        <button
          class="navbar__hamburger"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
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
      <a class="navbar__mobile-link" @click="navigate('/cart')">
        Cart <span v-if="cart.totalItems > 0">({{ cart.totalItems }})</span>
      </a>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: $navbar-height;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  // Transparent variant when scroll is at top on homepage
  &--transparent {
    background: transparent;
    border-bottom: none;
    box-shadow: none;

    .navbar__link {
      color: rgba(255, 255, 255, 0.85);

      &:hover {
        color: #ffffff;
      }

      &--active {
        color: #ffffff;
      }
    }

    .navbar__language {
      color: rgba(255, 255, 255, 0.85);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .navbar__language-chevron {
        color: rgba(255, 255, 255, 0.85);
      }
    }

    .navbar__action-btn {
      color: rgba(255, 255, 255, 0.85);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }
    }

    .navbar__hamburger {
      color: rgba(255, 255, 255, 0.85);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__inner {
    @include container;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  &__brand {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;
    text-decoration: none;
    @include md {
      flex: 1;
      justify-content: flex-start;
    }
  }

  &__logo-img {
    height: 52px; /* Visually balanced larger size for original logo */
    width: auto;
    object-fit: contain;
    display: block;
  }

  // Centered navigation links on desktop
  &__links {
    display: none;
    @include md {
      display: flex;
      gap: $space-8;
      justify-content: center;
      flex: 0 0 auto;
    }
  }

  &__link {
    font-family: $font-body;
    font-size: 1.0rem;
    font-weight: 700;
    color: #939393;
    cursor: pointer;
    transition: $transition-fast;
    text-decoration: none;
    padding: $space-1 0;
    position: relative;

    &:hover {
      color: #000000;
    }

    &--active {
      color: #000000;
      font-weight: 800;
    }
  }

  // Right action controls
  &__actions {
    display: flex;
    align-items: center;
    gap: $space-4;
    flex-shrink: 0;
    @include md {
      flex: 1;
      justify-content: flex-end;
    }
  }

  // Language switcher
  &__language {
    display: flex;
    align-items: center;
    gap: $space-1;
    font-family: $font-body;
    font-size: 1.0rem;
    font-weight: 600;
    color: #333333;
    cursor: pointer;
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
    transition: $transition-fast;

    &:hover {
      background: rgba(0, 0, 0, 0.03);
    }

    &-chevron {
      width: 12px;
      height: 12px;
      color: #666666;
    }
  }

  // Action circular buttons (Cart, Profile)
  &__action-btn {
    @include btn-reset;
    @include flex-center;
    width: 38px;
    height: 38px;
    border-radius: $radius-full;
    background: transparent;
    color: #333333;
    transition: $transition-fast;
    position: relative;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
      color: #000000;
    }

    .action-svg {
      width: 20px;
      height: 20px;
    }
  }

  &__cart-badge {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 18px;
    height: 18px;
    border-radius: $radius-full;
    background: #ff4e50;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    @include flex-center;
    border: 2px solid #ffffff;
    padding: 0 2px;
  }

  // Mobile Hamburger Toggle
  &__hamburger {
    @include btn-reset;
    @include flex-center;
    width: 38px;
    height: 38px;
    border-radius: $radius-full;
    color: #333333;
    transition: $transition-fast;
    display: flex;
    font-size: $text-lg;

    @include md {
      display: none;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  }

  // Mobile dropdown menu styling
  &__mobile-menu {
    display: none;
    position: absolute;
    top: $navbar-height;
    left: 0;
    right: 0;
    background: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    padding: $space-4;
    @include flex-col($space-1);

    &--open {
      display: flex;
    }

    @include md {
      display: none !important;
    }
  }

  &__mobile-link {
    display: block;
    padding: $space-3 $space-4;
    border-radius: $radius-md;
    font-size: $text-base;
    font-weight: 600;
    color: #4b5563;
    cursor: pointer;
    transition: $transition-fast;
    text-decoration: none;

    &:hover, &--active {
      color: #000000;
      background: rgba(0, 0, 0, 0.03);
    }
  }
}
</style>
