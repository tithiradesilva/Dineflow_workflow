<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CartItem from '@/components/ui/CartItem.vue'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cart   = useCartStore()

const isEmpty = computed(() => cart.items.length === 0)

const tax   = computed(() => cart.totalPrice * 0.05)
const grand = computed(() => cart.totalPrice + tax.value)
</script>

<template>
  <div class="cart-page">
    <div class="container">

      <div class="cart-page__header">
        <p class="cart-page__sub">
          {{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }}
        </p>
        <h1 class="cart-page__title">Your Cart</h1>
      </div>

      <div v-if="isEmpty" class="cart-page__empty">
        <img src="@/assets/EmptyItemsIcon.png" alt="Empty Cart" class="cart-page__empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Add some items from our menu.</p>
        <button class="cart-page__browse-btn" @click="router.push('/products')">
          Browse Menu
        </button>
      </div>

      <div v-else class="cart-page__content">

        <div class="cart-page__items">
          <CartItem
            v-for="item in cart.items"
            :key="item.id"
            :item="item"
          />
        </div>

        <aside class="cart-page__summary">
          <h2 class="cart-page__summary-title">Order Summary</h2>

          <div class="cart-page__summary-rows">
            <div class="cart-page__summary-row">
              <span>Subtotal</span>
              <span>${{ cart.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="cart-page__summary-row">
              <span>Tax (5%)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="cart-page__summary-row cart-page__summary-row--total">
              <span>Total</span>
              <span>${{ grand.toFixed(2) }}</span>
            </div>
          </div>

          <button
            class="cart-page__checkout-btn"
            @click="router.push('/checkout')"
          >
            Proceed to Checkout
          </button>

          <button
            class="cart-page__continue-btn"
            @click="router.push('/products')"
          >
            Continue Shopping
          </button>
        </aside>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";
.cart-page {
  padding: $space-10 0 $space-16;

  &__header {
    text-align: center;
    margin-bottom: $space-10;
  }

  &__title {
    font-family: $font-heading;
    font-size: 2.25rem;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: $space-2;
  }

  &__sub {
    font-family: $font-body;
    font-size: 18px;
    color: #f97316;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
  }

  &__empty {
    @include flex-col($space-4);
    align-items: center;
    text-align: center;
    padding: 10px 0;

    h2 { font-size: 22px; color: rgb(34, 34, 34); font-weight: 700;}
    p  { color: grey; font-weight: 600;}
  }

  &__empty-icon {
    width: 180px;
    height: auto;
    opacity: 0.35;
  }

  &__browse-btn {
    @include btn-reset;
    font-size: $text-base;
    color: #f97316;
    margin-top: 20px;
    transition: $transition-fast;
    margin-bottom: 20px;
    font-weight: 700;

    &:hover {
      color: color.adjust(#f97316, $lightness: -8%);
      text-decoration: underline;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-8;
    align-items: flex-start;

    @include lg {
      grid-template-columns: 1fr 380px;
    }
  }

  &__items {
    @include flex-col($space-4);
  }

  &__summary {
    @include card($radius-xl, $shadow-md);
    padding: $space-6;

    @include lg {
      position: sticky;
      top: calc(#{$navbar-height} + #{$space-6});
    }
  }

  &__summary-title {
    font-size: 16px;
    margin-bottom: $space-6;
    padding-bottom: $space-4;
    border-bottom: 1px solid $color-border;
    font-weight: 700;
    color: black;
  }

  &__summary-rows {
    @include flex-col($space-3);
    margin-bottom: $space-6;
    color: rgb(48, 48, 48);
    font-weight: 700;
  }

  &__summary-row {
    @include flex-row;
    justify-content: space-between;
    font-size: 15px;
    color: rgb(81, 81, 81);

    &--total {
      font-family: $font-heading;
      font-size: 20px;
      font-weight: 680;
      color: $color-secondary;
      padding-top: $space-3;
      border-top: 1px solid $color-border;

      span:last-child { color: #f97316; }
    }
  }

  &__checkout-btn {
    @include btn-primary;
    background: #f97316;
    width: 100%;
    padding: $space-4;
    font-size: $text-base;
    border-radius: $radius-lg;
    margin-bottom: $space-3;

    &:hover {
      background: color.adjust(#f97316, $lightness: -8%);
      box-shadow: 0 6px 18px rgba($color-success, 0.3);
    }
  }

  &__continue-btn {
    @include btn-reset;
    width: 100%;
    text-align: center;
    font-size: $text-sm;
    color: $text-muted;
    padding: $space-2;
    transition: $transition-fast;

    &:hover { color: #f97316; text-decoration: underline; }
  }
}
</style>
