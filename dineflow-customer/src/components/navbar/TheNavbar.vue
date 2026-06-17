<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route  = useRoute()
const cart   = useCartStore()
const auth   = useAuthStore()

const currentLangLabel = ref('En')
const showLangDropdown = ref(false)

function getCookie(name: string): string {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
  return ''
}

function initGoogleTranslate() {
  if (document.getElementById('google-translate-script')) return

  let translateElement = document.getElementById('google_translate_element')
  if (!translateElement) {
    translateElement = document.createElement('div')
    translateElement.id = 'google_translate_element'
    document.body.appendChild(translateElement)
  }

  ;(window as any).googleTranslateElementInit = () => {
    new (window as any).google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,de,si',
      layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element')
  }

  const script = document.createElement('script')
  script.id = 'google-translate-script'
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  document.body.appendChild(script)
}

function changeLanguage(langCode: 'en' | 'de' | 'si') {
  const domain = window.location.hostname
  document.cookie = `googtrans=/en/${langCode}; path=/;`
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${domain};`
  document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain};`

  const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement
  if (selectEl) {
    selectEl.value = langCode
    selectEl.dispatchEvent(new Event('change', { bubbles: true }))
    selectEl.dispatchEvent(new Event('click', { bubbles: true }))
  } else {
    window.location.reload()
    return
  }

  if (langCode === 'en') currentLangLabel.value = 'En'
  else if (langCode === 'de') currentLangLabel.value = 'De'
  else if (langCode === 'si') currentLangLabel.value = 'Si'

  showLangDropdown.value = false
}

function closeLangDropdown() {
  showLangDropdown.value = false
}

function handleProfileClick() {
  auth.isCheckoutTrigger = false
  auth.showLoginModal = true
}

const mobileOpen = ref(false)

const isActive = (path: string) => route.path === path

function navigate(path: string) {
  router.push(path)
  mobileOpen.value = false
}

const navLinks = [
  { label: 'Home',       path: '/' },
  { label: 'Shop',       path: '/products' },
  { label: 'Contact Us', path: '/contact' }
]

const isScrolled = ref(false)

function handleScroll() {
  if (route.path === '/') {
    isScrolled.value = window.scrollY > 60
  } else {
    isScrolled.value = true
  }
}

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
  window.addEventListener('click', closeLangDropdown)
  handleScroll()

  const transCookie = getCookie('googtrans')
  if (transCookie.endsWith('/de')) currentLangLabel.value = 'De'
  else if (transCookie.endsWith('/si')) currentLangLabel.value = 'Si'
  else currentLangLabel.value = 'En'

  initGoogleTranslate()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', closeLangDropdown)
})
</script>

<template>
  <header class="navbar" :class="{ 'navbar--transparent': !isScrolled }">
    <div class="navbar__inner">

      <a class="navbar__brand" @click="navigate('/')">
        <img class="navbar__logo-img" src="@/assets/logoOriginal.png" alt="DineFlow Logo" />
      </a>

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

      <div class="navbar__actions">
        <div
          class="navbar__language"
          @click.stop="showLangDropdown = !showLangDropdown"
        >
          <span>{{ currentLangLabel }}</span>
          <svg class="navbar__language-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>

          <div v-show="showLangDropdown" class="navbar__language-dropdown">
            <button
              type="button"
              class="lang-option"
              :class="{ 'lang-option--active': currentLangLabel === 'En' }"
              @click.stop="changeLanguage('en')"
            >
              English
            </button>
            <button
              type="button"
              class="lang-option"
              :class="{ 'lang-option--active': currentLangLabel === 'De' }"
              @click.stop="changeLanguage('de')"
            >
              Deutsch
            </button>
            <button
              type="button"
              class="lang-option"
              :class="{ 'lang-option--active': currentLangLabel === 'Si' }"
              @click.stop="changeLanguage('si')"
            >
              සිංහල (Sinhala)
            </button>
          </div>
        </div>

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

        <button
          class="navbar__action-btn navbar__profile"
          @click="handleProfileClick"
          aria-label="User Account"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-svg">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>

        <button
          class="navbar__hamburger"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          {{ mobileOpen ? '✕' : '☰' }}
        </button>
      </div>
    </div>

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
    height: 52px; 
    width: auto;
    object-fit: contain;
    display: block;
  }

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

  &__language {
    position: relative;
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

    &-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: #ffffff;
      border: 1px solid $color-border;
      border-radius: $radius-md;
      box-shadow: $shadow-md;
      display: flex;
      flex-direction: column;
      min-width: 120px;
      overflow: hidden;
      z-index: 101;
      padding: 4px 0;

      .lang-option {
        @include btn-reset;
        width: 100%;
        text-align: left;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        transition: background 0.15s ease;

        &:hover, &--active {
          background: rgba(#f97316, 0.08);
          color: #f97316;
        }
      }
    }
  }

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

<style lang="scss">
#google_translate_element,
.skiptranslate,
iframe.skiptranslate,
.goog-te-banner-frame {
  display: none !important;
  visibility: hidden !important;
}
body {
  top: 0px !important;
}
</style>
