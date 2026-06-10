<script setup lang="ts">
import type { CartItem } from '@/stores/cartStore'
import { useCartStore } from '@/stores/cartStore'

// Props: the cart item to display
const props = defineProps<{ item: CartItem }>()

const cart = useCartStore()

const fallbackImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=300&q=80'

// Computed subtotal for this item
const subtotal = () => (props.item.price * props.item.cartQty).toFixed(2)
</script>

<template>
  <div class="cart-item">

    <!-- Food thumbnail -->
    <img
      class="cart-item__image"
      :src="item.image || fallbackImage"
      :alt="item.name"
    />

    <!-- Item name + unit price -->
    <div class="cart-item__info">
      <span class="cart-item__name">{{ item.name }}</span>
      <span class="cart-item__unit-price">${{ item.price.toFixed(2) }} each</span>
    </div>

    <!-- Quantity Controls: − [qty] + -->
    <div class="cart-item__controls">
      <button class="cart-item__qty-btn" @click="cart.decreaseItem(item.id)">−</button>
      <span class="cart-item__qty">{{ item.cartQty }}</span>
      <button class="cart-item__qty-btn" @click="cart.addItem(item)">+</button>
    </div>

    <!-- Subtotal + Remove -->
    <div class="cart-item__right">
      <span class="cart-item__subtotal">${{ subtotal() }}</span>
      <button class="cart-item__remove" @click="cart.removeItem(item.id)">Remove</button>
    </div>

  </div>
</template>

<style lang="scss" scoped>
// CartItem styles — variables auto-injected by vite.config.ts

.cart-item {
  @include flex-row($space-4);
  padding: $space-4;
  background: $color-surface;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  transition: $transition-fast;

  &:hover { border-color: #d0d6de; }

  &__image {
    width: 72px;
    height: 72px;
    border-radius: $radius-md;
    object-fit: cover;
    flex-shrink: 0;
    border: 1px solid $color-border;
  }

  &__info {
    @include flex-col($space-1);
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-weight: 800;
    font-size: 17px;
    color: $color-secondary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgb(29, 29, 29);
  }

  &__unit-price {
    font-size: 14px;
    color: #7b7b7b;
    font-weight: 700;
  }

  &__controls { @include flex-row($space-2); flex-shrink: 0; }

  &__qty-btn {
    @include btn-reset;
    width: 32px;
    height: 32px;
    border-radius: $radius-md;
    border: 1.5px solid $color-border;
    color: $color-secondary;
    font-size: $text-lg;
    font-weight: 700;
    @include flex-center;
    transition: $transition-fast;

    &:hover {
      border-color: $color-primary;
      color: $color-primary;
      background: rgba($color-primary, 0.05);
    }
  }

  &__qty {
    min-width: 24px;
    text-align: center;
    font-weight: 700;
    font-size: $text-base;
    color: $color-secondary;
  }

  &__right {
    @include flex-col($space-2);
    align-items: flex-end;
    flex-shrink: 0;
    margin-left: 30px;
  }

  &__subtotal {
    font-family: $font-heading;
    font-weight: 800;
    font-size: 18px;
    color: #f97316;
  }

  &__remove {
    @include btn-reset;
    font-size: $text-xs;
    color: $text-light;
    transition: $transition-fast;
    &:hover { color: $color-danger; }
  }
}
</style>

