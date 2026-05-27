<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ui/ProductCard.vue'
import { menuService } from '@/services/menuService'
import type { MenuItem } from '@/services/menuService'

const router  = useRouter()
const isLoading = ref(true)
const featuredItems = ref<MenuItem[]>([])
const error = ref('')

// Fetch a limited set of items for the homepage "featured" section
async function loadFeatured() {
  try {
    const all = await menuService.getMenuItems()
    // Show up to 6 items on the homepage
    featuredItems.value = all.slice(0, 6)
  } catch (e: any) {
    error.value = 'Could not load menu. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadFeatured)
</script>

<template>
  <div class="home">

    <!-- ===== HERO SECTION ===== -->
    <section class="hero">
      <div class="hero__inner container">
        <div class="hero__text anim-fade-in">
          <span class="hero__label">🍳 Fresh · Fast · Delicious</span>
          <h1 class="hero__title">Order from your<br /><span class="hero__title--accent">table, instantly.</span></h1>
          <p class="hero__desc">Browse our menu, add what you love, and place your order — no waiting for a waiter.</p>
          <div class="hero__actions">
            <button class="hero__cta" @click="router.push('/products')">View Full Menu →</button>
            <button class="hero__cta-ghost" @click="router.push('/cart')">View Cart</button>
          </div>
        </div>
        <div class="hero__image-wrap anim-slide-right">
          <div class="hero__image-blob"></div>
          <img
            class="hero__image"
            src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=700&q=80"
            alt="Delicious food"
          />
        </div>
      </div>
    </section>

    <!-- ===== STATS STRIP ===== -->
    <section class="stats">
      <div class="container">
        <div class="stats__grid">
          <div class="stats__item">
            <span class="stats__num">50+</span>
            <span class="stats__label">Menu Items</span>
          </div>
          <div class="stats__item">
            <span class="stats__num">2 min</span>
            <span class="stats__label">Avg Order Time</span>
          </div>
          <div class="stats__item">
            <span class="stats__num">100%</span>
            <span class="stats__label">Fresh Ingredients</span>
          </div>
          <div class="stats__item">
            <span class="stats__num">⭐ 4.9</span>
            <span class="stats__label">Customer Rating</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== FEATURED MENU SECTION ===== -->
    <section class="section featured">
      <div class="container">
        <div class="featured__header">
          <div>
            <h2 class="featured__title">Featured Items</h2>
            <p class="featured__sub">Our most loved dishes, freshly prepared.</p>
          </div>
          <button class="featured__view-all" @click="router.push('/products')">
            See all →
          </button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="isLoading" class="featured__grid">
          <div v-for="n in 6" :key="n" class="skeleton-card"></div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="featured__error">{{ error }}</div>

        <!-- Product cards grid -->
        <div v-else class="featured__grid">
          <ProductCard
            v-for="item in featuredItems"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS SECTION ===== -->
    <section class="section how">
      <div class="container">
        <h2 class="how__title">How it works</h2>
        <div class="how__steps">
          <div class="how__step">
            <div class="how__step-icon">📖</div>
            <h3 class="how__step-label">Browse the Menu</h3>
            <p class="how__step-desc">Explore all available dishes by category.</p>
          </div>
          <div class="how__step-arrow">→</div>
          <div class="how__step">
            <div class="how__step-icon">🛒</div>
            <h3 class="how__step-label">Add to Cart</h3>
            <p class="how__step-desc">Pick what you want, adjust quantities.</p>
          </div>
          <div class="how__step-arrow">→</div>
          <div class="how__step">
            <div class="how__step-icon">✅</div>
            <h3 class="how__step-label">Place Order</h3>
            <p class="how__step-desc">Confirm your table number and submit. Done!</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style lang="scss" scoped>
// --- Hero ---
.hero {
  background: linear-gradient(135deg, $color-muted 0%, #fff 60%);
  padding: $space-16 0 $space-12;
  overflow: hidden;

  &__inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-10;
    align-items: center;

    @include lg {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__text { @include flex-col($space-5); }

  &__label {
    display: inline-block;
    padding: $space-1 $space-3;
    border-radius: $radius-full;
    background: rgba($color-primary, 0.1);
    color: $color-primary;
    font-size: $text-sm;
    font-weight: 700;
    letter-spacing: 0.5px;
    width: fit-content;
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    color: $color-secondary;
    line-height: 1.15;

    &--accent { color: $color-primary; }
  }

  &__desc {
    font-size: $text-lg;
    color: $text-muted;
    max-width: 420px;
    line-height: 1.7;
  }

  &__actions { @include flex-row($space-3); flex-wrap: wrap; }

  &__cta {
    @include btn-primary;
    padding: $space-3 $space-8;
    font-size: $text-base;
    border-radius: $radius-lg;
  }

  &__cta-ghost {
    @include btn-outline;
    padding: $space-3 $space-6;
    font-size: $text-base;
    border-radius: $radius-lg;
  }

  &__image-wrap {
    position: relative;
    @include flex-center;
    display: none;

    @include lg { display: flex; }
  }

  &__image-blob {
    position: absolute;
    width: 380px;
    height: 380px;
    border-radius: 60% 40% 55% 45% / 45% 55% 45% 55%;
    background: linear-gradient(135deg, rgba($color-primary, 0.12), rgba($color-accent, 0.08));
  }

  &__image {
    width: 340px;
    height: 340px;
    object-fit: cover;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    box-shadow: $shadow-xl;
  }
}

// --- Stats Strip ---
.stats {
  background: $color-secondary;
  padding: $space-8 0;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $space-6;

    @include md {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__item {
    @include flex-col($space-1);
    align-items: center;
    text-align: center;
  }

  &__num {
    font-family: $font-heading;
    font-size: $text-2xl;
    font-weight: 800;
    color: #fff;
  }

  &__label {
    font-size: $text-sm;
    color: rgba(255,255,255,0.55);
  }
}

// --- Featured Section ---
.featured {
  background: $color-background;

  &__header {
    @include flex-row;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: $space-8;
    flex-wrap: wrap;
    gap: $space-4;
  }

  &__title {
    font-size: $text-2xl;
    margin-bottom: $space-1;
  }

  &__sub {
    color: $text-muted;
    font-size: $text-sm;
  }

  &__view-all {
    @include btn-outline;
    padding: $space-2 $space-5;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: $space-6;

    @include sm { grid-template-columns: repeat(2, 1fr); }
    @include lg { grid-template-columns: repeat(3, 1fr); }
  }

  &__error {
    text-align: center;
    color: $color-danger;
    padding: $space-8;
  }
}

// Skeleton loading card
.skeleton-card {
  height: 320px;
  border-radius: $radius-lg;
  background: linear-gradient(90deg, $color-border 25%, #edf0f3 50%, $color-border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// --- How it Works ---
.how {
  background: $color-muted;

  &__title {
    text-align: center;
    margin-bottom: $space-10;
  }

  &__steps {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: $space-4;
  }

  &__step {
    @include card($radius-lg, $shadow-sm);
    padding: $space-6;
    text-align: center;
    max-width: 220px;
    @include flex-col($space-3);
    align-items: center;
  }

  &__step-icon {
    font-size: 2.5rem;
    line-height: 1;
  }

  &__step-label {
    font-size: $text-base;
    font-weight: 700;
    color: $color-secondary;
  }

  &__step-desc {
    font-size: $text-sm;
    color: $text-muted;
  }

  &__step-arrow {
    font-size: $text-2xl;
    color: $color-accent;
    font-weight: 300;
    display: none;

    @include md { display: block; }
  }
}
</style>
