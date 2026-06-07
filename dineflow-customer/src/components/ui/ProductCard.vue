<script setup lang="ts">
import type { MenuItem } from '@/services/menuService'
import { useCartStore } from '@/stores/cartStore'

const props = defineProps<{ item: MenuItem }>()

const cart = useCartStore()

const fallbackImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
</script>

<template>
  <article class="product-card" :class="{ 'product-card--unavailable': !item.is_available }">

    <!-- Image with its own border-radius, matching reference -->
    <div class="product-card__image-wrap">
      <img
        class="product-card__image"
        :src="item.image || fallbackImage"
        :alt="item.name"
        loading="lazy"
      />
    </div>

    <!-- Text body below the image -->
    <div class="product-card__body">
      <h3 class="product-card__name">{{ item.name }}</h3>
      <p v-if="item.description" class="product-card__desc">{{ item.description }}</p>

      <!-- Price row -->
      <div class="product-card__footer">
        <span class="product-card__price">$ {{ item.price.toFixed(2) }}</span>

        <button
          class="product-card__add-btn"
          @click.stop="cart.addItem(item)"
          :disabled="!item.is_available"
          :aria-label="item.is_available ? 'Add to Cart' : 'Sold Out'"
        >
          <span v-if="item.is_available" class="product-card__btn-inner">
            <!-- Cart icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="cart-icon"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <!-- Plus superscript -->
            <span class="plus-sign">+</span>
          </span>
          <span v-else class="sold-out-text">Sold</span>
        </button>
      </div>
    </div>

  </article>
</template>

<style lang="scss" scoped>
.product-card {
  // No card shadow/border — borderless layout, sits on white page
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 30px;

  // Image has its own rounded corners — key feature of this design
  &__image-wrap {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 10px;
    overflow: hidden;
    background: #e5e7eb;
    flex-shrink: 0;
    transition: opacity 0.2s ease;
    margin-bottom: 4px;

    .product-card:hover & {
      opacity: 0.95;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.35s ease;
    display: block;

    .product-card:hover & {
      transform: scale(1.03);
    }
  }

  // Text area — no card padding on left/right, sits flush
  &__body {
    padding: $space-3 0 0;
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
  }

  &__name {
    font-family: $font-heading;
    font-size: 1.3rem;
    font-weight: 800;
    color: #111827;
    line-height: 1.3;
    margin: 10px 0 12px;
  }

  &__desc {
    font-family: $font-body;
    font-size: 1.05rem;
    font-weight: 700;
    color: #6d6d6d;
    line-height: 36px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0 0 $space-3;
  }

  // Footer row: price left, button right
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  // Orange bold price — "$ 22.23" with a space
  &__price {
    font-family: $font-heading;
    font-size: 1.6rem;
    font-weight: 800;
    color: #f97316;
    letter-spacing: 0;
  }

  // Circular orange button with cart + plus
  &__add-btn {
    @include btn-reset;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #f97316;
    color: #ffffff;
    flex-shrink: 0;
    position: relative;
    transition: background 0.15s ease, transform 0.15s ease;

    &:hover {
      background: #ea6b0a;
      transform: scale(1.07);
    }

    &:active {
      transform: scale(0.93);
    }
  }

  // Inner: cart icon + "+" stacked
  &__btn-inner {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
  }

  .cart-icon {
    width: 22px;
    height: 22px;
  }

  // Small "+" superscript at top-right of the cart
  .plus-sign {
    font-size: 11px;
    font-weight: 900;
    line-height: 1;
    margin-left: 1px;
    margin-bottom: 6px; // lifts it to superscript position
  }

  .sold-out-text {
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &--unavailable {
    opacity: 0.5;
    pointer-events: none;

    .product-card__add-btn {
      background: #d1d5db;
    }
  }
}
</style>
