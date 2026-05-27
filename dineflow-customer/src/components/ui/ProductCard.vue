<script setup lang="ts">
import type { MenuItem } from '@/services/menuService'
import { useCartStore } from '@/stores/cartStore'

// Props: the menu item to display
const props = defineProps<{ item: MenuItem }>()

const cart = useCartStore()

// Default food image if no image is provided
const fallbackImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80'
</script>

<template>
  <article class="product-card" :class="{ 'product-card--unavailable': !item.is_available }">

    <!-- Food Image -->
    <div class="product-card__image-wrap">
      <img
        class="product-card__image"
        :src="item.image || fallbackImage"
        :alt="item.name"
        loading="lazy"
      />
      <!-- Category badge on top of the image -->
      <span class="product-card__badge">{{ item.category }}</span>
    </div>

    <!-- Card Body -->
    <div class="product-card__body">
      <h3 class="product-card__name">{{ item.name }}</h3>
      <p v-if="item.description" class="product-card__desc">{{ item.description }}</p>

      <!-- Price + Add Button -->
      <div class="product-card__footer">
        <span class="product-card__price">${{ item.price.toFixed(2) }}</span>
        <button
          class="product-card__add-btn"
          @click.stop="cart.addItem(item)"
          :disabled="!item.is_available"
        >
          {{ item.is_available ? 'Add to Cart' : 'Sold Out' }}
        </button>
      </div>
    </div>

  </article>
</template>

<style lang="scss" scoped>
// ProductCard styles — variables auto-injected by vite.config.ts

.product-card {
  @include card;
  overflow: hidden;
  cursor: pointer;
  transition: $transition-base;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }

  &__image-wrap {
    position: relative;
    height: 200px;
    overflow: hidden;
    background: $color-border;
    flex-shrink: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    .product-card:hover & { transform: scale(1.05); }
  }

  &__badge {
    position: absolute;
    top: $space-3;
    left: $space-3;
    @include badge(rgba(255,255,255,0.9), $color-secondary);
    backdrop-filter: blur(4px);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  &__body {
    padding: $space-4;
    @include flex-col($space-3);
    flex: 1;
  }

  &__name {
    font-family: $font-heading;
    font-size: $text-base;
    font-weight: 700;
    color: $color-secondary;
    line-height: 1.3;
  }

  &__desc {
    font-size: $text-sm;
    color: $text-light;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    @include flex-row;
    justify-content: space-between;
    margin-top: auto;
  }

  &__price {
    font-family: $font-heading;
    font-size: $text-xl;
    font-weight: 800;
    color: $color-primary;
  }

  &__add-btn {
    @include btn-primary;
    padding: $space-2 $space-4;
    font-size: $text-sm;
    border-radius: $radius-md;
  }

  &--unavailable {
    opacity: 0.6;
    pointer-events: none;
    .product-card__add-btn { background: $text-light; }
  }
}
</style>
