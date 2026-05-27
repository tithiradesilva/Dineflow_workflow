<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { orderService } from '@/services/orderService'

const router = useRouter()
const cart   = useCartStore()

// The customer's table number (e.g. "Table 3")
const tableName  = ref('')
const isSubmitting = ref(false)
const error      = ref('')
const successOrderId = ref<number | null>(null)  // set after successful placement

// Tax + grand total (same as CartPage for consistency)
const tax   = computed(() => cart.totalPrice * 0.05)
const grand = computed(() => cart.totalPrice + tax.value)

// Place the order via Supabase
async function placeOrder() {
  if (!tableName.value.trim()) {
    error.value = 'Please enter your table number.'
    return
  }
  if (cart.items.length === 0) {
    error.value = 'Your cart is empty.'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    const order = await orderService.placeOrder({
      table_name: tableName.value.trim(),
      total: grand.value,
      items: cart.items.map(item => ({
        menu_item_id: item.id,
        quantity: item.cartQty,
        price: item.price
      }))
    })

    successOrderId.value = order.id
    cart.clearCart()   // clear cart after success
  } catch (e: any) {
    error.value = 'Failed to place order. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="checkout-page">
    <div class="container">

      <!-- Success State (shown after order is placed) -->
      <div v-if="successOrderId" class="checkout-page__success anim-slide-up">
        <span class="checkout-page__success-icon">🎉</span>
        <h1>Order Placed!</h1>
        <p>Order <strong>#ORD-{{ String(successOrderId).padStart(3, '0') }}</strong> has been sent to the kitchen.</p>
        <p class="checkout-page__success-note">You'll be notified when your food is ready. Sit back and relax!</p>
        <button class="checkout-page__back-btn" @click="router.push('/')">
          Back to Home
        </button>
      </div>

      <!-- Checkout Form -->
      <div v-else class="checkout-page__layout">

        <!-- Left: Order Review -->
        <div class="checkout-page__review">
          <h2 class="checkout-page__section-title">Order Review</h2>

          <!-- Empty cart guard -->
          <div v-if="cart.items.length === 0" class="checkout-page__empty">
            <p>Your cart is empty. <a @click="router.push('/products')">Add some items</a>.</p>
          </div>

          <!-- Items List -->
          <div v-else class="checkout-page__items">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="checkout-page__item"
            >
              <img
                class="checkout-page__item-img"
                :src="item.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=100&q=80'"
                :alt="item.name"
              />
              <div class="checkout-page__item-info">
                <span class="checkout-page__item-name">{{ item.name }}</span>
                <span class="checkout-page__item-qty">x{{ item.cartQty }}</span>
              </div>
              <span class="checkout-page__item-price">
                ${{ (item.price * item.cartQty).toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Price breakdown -->
          <div class="checkout-page__totals">
            <div class="checkout-page__total-row">
              <span>Subtotal</span><span>${{ cart.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="checkout-page__total-row">
              <span>Tax (5%)</span><span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="checkout-page__total-row checkout-page__total-row--grand">
              <span>Total</span><span>${{ grand.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Table & Confirm -->
        <div class="checkout-page__form">
          <h2 class="checkout-page__section-title">Your Table</h2>

          <!-- Table Number Input -->
          <div class="checkout-page__field">
            <label class="checkout-page__label" for="table-input">
              Table Number or Name
            </label>
            <input
              id="table-input"
              v-model="tableName"
              class="checkout-page__input"
              type="text"
              placeholder="e.g. Table 5, Window Seat..."
              :disabled="isSubmitting"
            />
          </div>

          <!-- Error message -->
          <p v-if="error" class="checkout-page__error">{{ error }}</p>

          <!-- Place Order Button -->
          <button
            class="checkout-page__place-btn"
            :disabled="isSubmitting || cart.items.length === 0"
            @click="placeOrder"
          >
            <span v-if="isSubmitting" class="anim-spin">⏳</span>
            <span v-else>Place Order · ${{ grand.toFixed(2) }}</span>
          </button>

          <p class="checkout-page__note">
            Once placed, your order goes straight to the kitchen.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.checkout-page {
  padding: $space-10 0 $space-16;

  // --- Success Screen ---
  &__success {
    @include flex-col($space-4);
    align-items: center;
    text-align: center;
    max-width: 480px;
    margin: $space-16 auto;
    @include card($radius-xl, $shadow-lg);
    padding: $space-12 $space-8;

    h1 { font-size: $text-3xl; }
    p  { color: $text-muted; }
  }

  &__success-icon { font-size: 4rem; line-height: 1; }

  &__success-note {
    font-size: $text-sm;
    color: $text-light;
  }

  &__back-btn {
    @include btn-primary;
    padding: $space-3 $space-8;
    font-size: $text-base;
    border-radius: $radius-lg;
    margin-top: $space-2;
  }

  // --- Two-column layout ---
  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-8;
    align-items: flex-start;

    @include lg {
      grid-template-columns: 1fr 420px;
    }
  }

  &__section-title {
    font-size: $text-xl;
    margin-bottom: $space-6;
    padding-bottom: $space-4;
    border-bottom: 1px solid $color-border;
  }

  // --- Order Review Panel ---
  &__review {
    @include card($radius-xl, $shadow-md);
    padding: $space-6;
  }

  &__empty {
    color: $text-muted;
    text-align: center;
    padding: $space-8 0;

    a {
      color: $color-primary;
      cursor: pointer;
      font-weight: 600;
    }
  }

  &__items {
    @include flex-col($space-3);
    margin-bottom: $space-6;
  }

  // Single item row in review
  &__item {
    @include flex-row($space-3);
    padding: $space-3;
    border-radius: $radius-md;
    background: $color-background;
    border: 1px solid $color-border;
  }

  &__item-img {
    width: 52px;
    height: 52px;
    border-radius: $radius-md;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__item-info {
    @include flex-col($space-1);
    flex: 1;
    min-width: 0;
  }

  &__item-name {
    font-weight: 700;
    font-size: $text-sm;
    color: $color-secondary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-qty {
    font-size: $text-xs;
    color: $text-light;
  }

  &__item-price {
    font-weight: 700;
    font-size: $text-sm;
    color: $color-primary;
    flex-shrink: 0;
  }

  // Price totals section
  &__totals {
    @include flex-col($space-3);
    padding-top: $space-4;
    border-top: 1px solid $color-border;
  }

  &__total-row {
    @include flex-row;
    justify-content: space-between;
    font-size: $text-sm;
    color: $text-muted;

    &--grand {
      font-family: $font-heading;
      font-size: $text-xl;
      font-weight: 800;
      color: $color-secondary;
      padding-top: $space-3;
      border-top: 1px solid $color-border;

      span:last-child { color: $color-primary; }
    }
  }

  // --- Form Panel ---
  &__form {
    @include card($radius-xl, $shadow-md);
    padding: $space-6;

    @include lg {
      position: sticky;
      top: calc(#{$navbar-height} + #{$space-6});
    }
  }

  &__field {
    @include flex-col($space-2);
    margin-bottom: $space-4;
  }

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-secondary;
  }

  &__input {
    padding: $space-3 $space-4;
    border: 1.5px solid $color-border;
    border-radius: $radius-lg;
    font-size: $text-base;
    outline: none;
    transition: $transition-base;
    color: $color-secondary;
    background: $color-surface;

    &:focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }

    &:disabled {
      background: $color-background;
      opacity: 0.7;
    }
  }

  &__error {
    color: $color-danger;
    font-size: $text-sm;
    margin-bottom: $space-4;
    padding: $space-3;
    background: rgba($color-danger, 0.06);
    border-radius: $radius-md;
    border-left: 3px solid $color-danger;
  }

  &__place-btn {
    @include btn-primary;
    width: 100%;
    padding: $space-4;
    font-size: $text-base;
    border-radius: $radius-lg;
    margin-bottom: $space-3;

    &:disabled {
      background: $text-light;
      transform: none;
      box-shadow: none;
    }
  }

  &__note {
    font-size: $text-xs;
    color: $text-light;
    text-align: center;
  }
}
</style>
