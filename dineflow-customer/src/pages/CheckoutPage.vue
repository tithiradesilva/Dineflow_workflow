<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { orderService } from '@/services/orderService'

const router = useRouter()
const cart   = useCartStore()

// Customer Details
const tableName  = ref('')
const isSubmitting = ref(false)
const error      = ref('')
const successOrderId = ref<number | null>(null)

// Coupon Codes
const couponCode = ref('')
const appliedCoupon = ref('')
const couponDiscount = ref(0)
const couponError = ref('')
const couponSuccess = ref('')

function claimCoupon() {
  couponError.value = ''
  couponSuccess.value = ''
  if (!couponCode.value.trim()) {
    couponError.value = 'Please enter a coupon code.'
    return
  }
  const code = couponCode.value.trim().toUpperCase()
  if (code === 'DINEFLOW' || code === 'WELCOME10') {
    appliedCoupon.value = code
    // 10% off subtotal
    couponDiscount.value = cart.totalPrice * 0.1
    couponSuccess.value = `Coupon "${code}" applied successfully! 10% discount applied.`
  } else {
    couponError.value = 'Invalid coupon code. Try DINEFLOW or WELCOME10.'
  }
}

// Payment details
const paymentMethod = ref<'card' | 'cash'>('card')
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

function setPaymentMethod(method: 'card' | 'cash') {
  paymentMethod.value = method
}

function handleCardNumberInput(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 16) {
    value = value.slice(0, 16)
  }
  const parts = value.match(/.{1,4}/g)
  cardNumber.value = parts ? parts.join(' ') : value
}

function handleCardExpiryInput(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  
  // 1. Format single digit starting months
  if (value.length > 0) {
    const firstChar = value.charAt(0)
    if (firstChar !== '0' && firstChar !== '1' && value.length === 1) {
      value = '0' + value
    }
  }
  
  // 2. Validate month digits (must be 01-12)
  if (value.length >= 2) {
    const month = value.slice(0, 2)
    const monthNum = parseInt(month, 10)
    if (monthNum > 12 || month === '00') {
      value = value.slice(0, 1) // reject invalid month second digit
    }
  }

  // 3. Validate year first digit (must be >= 2 for years 2026+)
  if (value.length >= 3) {
    const firstYearDigit = parseInt(value.charAt(2), 10)
    if (firstYearDigit < 2) {
      value = value.slice(0, 2) // reject invalid year prefix
    }
  }

  // 4. Validate complete year (must be between current year and 15 years in the future)
  if (value.length >= 4) {
    const year = parseInt(value.slice(2, 4), 10)
    const month = parseInt(value.slice(0, 2), 10)
    const now = new Date()
    const currentYear = now.getFullYear() % 100 // e.g. 26
    const currentMonth = now.getMonth() + 1 // 1-indexed month
    const maxYear = currentYear + 15 // maximum 15 years in the future (e.g. 41)
    if (year < currentYear || year > maxYear || (year === currentYear && month < currentMonth)) {
      value = value.slice(0, 3) // reject expired/invalid future year/month combination
    }
  }
  
  if (value.length > 4) {
    value = value.slice(0, 4)
  }
  
  if (value.length <= 2) {
    cardExpiry.value = value
  } else {
    cardExpiry.value = `${value.slice(0, 2)} / ${value.slice(2)}`
  }
}

function handleCardCvvInput(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length > 4) {
    value = value.slice(0, 4)
  }
  cardCvv.value = value
}

// Tax + grand total calculations
const tax   = computed(() => cart.totalPrice * 0.05)
const grand = computed(() => {
  const t = cart.totalPrice + tax.value - couponDiscount.value
  return Math.max(0, t)
})

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
  if (paymentMethod.value === 'card') {
    if (!cardName.value.trim() || !cardNumber.value.trim() || !cardExpiry.value.trim() || !cardCvv.value.trim()) {
      error.value = 'Please fill in all credit card details.'
      return
    }
    if (cardNumber.value.replace(/\D/g, '').length !== 16) {
      error.value = 'Card number must be 16 digits.'
      return
    }
    if (!/^\d{2}\s\/\s\d{2}$/.test(cardExpiry.value)) {
      error.value = 'Expiry date must be in MM / YY format.'
      return
    }
    if (cardCvv.value.replace(/\D/g, '').length < 3) {
      error.value = 'CVV must be at least 3 digits.'
      return
    }
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
    cart.clearCart()
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
      <div v-else>
        <!-- Page Title Header (matching Cart page style) -->
        <div class="checkout-page__header">
          <p class="checkout-page__sub">
            {{ cart.totalItems }} {{ cart.totalItems === 1 ? 'item' : 'items' }}
          </p>
          <h1 class="checkout-page__title">Checkout</h1>
        </div>

        <div class="checkout-page__layout">
          <!-- Left: Forms, Coupon, Payment -->
          <div class="checkout-page__left">
            
            <!-- 1. Order Review (Allows Removing Items / Going to Cart) -->
            <div class="checkout-page__section-card">
              <h2 class="checkout-page__section-title">Order Review</h2>
              <div v-if="cart.items.length === 0" class="checkout-page__empty">
                <p>Your cart is empty. <a @click="router.push('/products')">Add some items</a>.</p>
              </div>
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
                    <span class="checkout-page__item-qty-price">${{ item.price.toFixed(2) }} x {{ item.cartQty }}</span>
                  </div>

                  <!-- Price & Remove button -->
                  <div class="checkout-page__item-right">
                    <span class="checkout-page__item-price">
                      ${{ (item.price * item.cartQty).toFixed(2) }}
                    </span>
                    <button class="checkout-page__item-remove" @click="cart.removeItem(item.id)">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Table Details -->
            <div class="checkout-page__section-card">
              <h2 class="checkout-page__section-title">Your Table Number or Name</h2>
              <div class="checkout-page__field">
                <input
                  id="table-input"
                  v-model="tableName"
                  class="checkout-page__input"
                  type="text"
                  placeholder="e.g. Table 5 or Peter Colin"
                  autocomplete="off"
                  :disabled="isSubmitting"
                />
              </div>
            </div>

            <!-- 3. Promo Coupon Section -->
            <div class="checkout-page__section-card">
              <h2 class="checkout-page__section-title">Promo Coupon</h2>
              <div class="checkout-page__coupon-group">
                <input
                  v-model="couponCode"
                  class="checkout-page__input checkout-page__coupon-input"
                  type="text"
                  placeholder="Enter coupon code (e.g. DINEFLOW)"
                  :disabled="isSubmitting"
                />
                <button
                  class="checkout-page__coupon-btn"
                  @click="claimCoupon"
                  :disabled="isSubmitting"
                >
                  Claim
                </button>
              </div>
              <p v-if="couponSuccess" class="checkout-page__coupon-success">{{ couponSuccess }}</p>
              <p v-if="couponError" class="checkout-page__coupon-error">{{ couponError }}</p>
            </div>

            <!-- 4. Cash or Card Options -->
            <div class="checkout-page__section-card">
              <h2 class="checkout-page__section-title">Payment Method</h2>
              
              <div class="checkout-page__payment-selector">
                <button
                  type="button"
                  class="payment-tab"
                  :class="{ 'payment-tab--active': paymentMethod === 'card' }"
                  @click="setPaymentMethod('card')"
                >
                  Credit / Debit Card
                </button>
                <button
                  type="button"
                  class="payment-tab"
                  :class="{ 'payment-tab--active': paymentMethod === 'cash' }"
                  @click="setPaymentMethod('cash')"
                >
                  Cash at Counter
                </button>
              </div>

              <!-- Card Details -->
              <div v-if="paymentMethod === 'card'" class="checkout-page__card-fields">
                <div class="checkout-page__field">
                  <label class="checkout-page__label">Cardholder Name</label>
                  <input
                    v-model="cardName"
                    class="checkout-page__input"
                    type="text"
                    placeholder="John Doe"
                    :disabled="isSubmitting"
                  />
                </div>
                <div class="checkout-page__field">
                  <label class="checkout-page__label">Card Number</label>
                  <input
                    v-model="cardNumber"
                    class="checkout-page__input"
                    type="text"
                    placeholder="1234 5678 1234 5678"
                    @input="handleCardNumberInput"
                    :disabled="isSubmitting"
                  />
                </div>
                <div class="checkout-page__row-fields">
                  <div class="checkout-page__field">
                    <label class="checkout-page__label">Expiry Date</label>
                    <input
                      v-model="cardExpiry"
                      class="checkout-page__input"
                      type="text"
                      placeholder="MM / YY"
                      @input="handleCardExpiryInput"
                      :disabled="isSubmitting"
                    />
                  </div>
                  <div class="checkout-page__field">
                    <label class="checkout-page__label">CVV</label>
                    <input
                      v-model="cardCvv"
                      class="checkout-page__input"
                      type="password"
                      placeholder="***"
                      maxlength="4"
                      @input="handleCardCvvInput"
                      :disabled="isSubmitting"
                    />
                  </div>
                </div>
              </div>

              <!-- Cash Message (Simple Visible Text, No Box) -->
              <div v-else class="checkout-page__cash-message">
                <p>Ready to provide cash at the counter</p>
              </div>
            </div>

          </div>

          <!-- Right side: Sticky Order Summary (Total Order Area) -->
          <aside class="checkout-page__summary">
            <h2 class="checkout-page__summary-title">Order Summary</h2>

            <div class="checkout-page__summary-rows">
              <div class="checkout-page__summary-row">
                <span>Subtotal</span>
                <span>${{ cart.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="checkout-page__summary-row">
                <span>Tax (5%)</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
              <div v-if="couponDiscount > 0" class="checkout-page__summary-row checkout-page__summary-row--discount">
                <span>Discount</span>
                <span>-${{ couponDiscount.toFixed(2) }}</span>
              </div>
              <div class="checkout-page__summary-row checkout-page__summary-row--total">
                <span>Total</span>
                <span>${{ grand.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Error message (Simple visible text, no box) -->
            <p v-if="error" class="checkout-page__error">{{ error }}</p>

            <button
              class="checkout-page__place-btn"
              :disabled="isSubmitting || cart.items.length === 0"
              @click="placeOrder"
            >
              <span v-if="isSubmitting" class="anim-spin">⏳</span>
              <span v-else>Place Order</span>
            </button>

            <!-- Back to Cart Option to edit items -->
            <button
              class="checkout-page__back-to-cart-btn"
              @click="router.push('/cart')"
            >
              Back to Cart
            </button>

            <p class="checkout-page__note">
              Once placed, your order goes straight to the kitchen.
            </p>
          </aside>

        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

.checkout-page {
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
    background: #f97316;
    padding: $space-3 $space-8;
    font-size: $text-base;
    border-radius: $radius-lg;
    margin-top: $space-2;

    &:hover {
      background: color.adjust(#f97316, $lightness: -8%);
      box-shadow: 0 6px 18px rgba(#f97316, 0.3);
    }
  }

  // --- Two-column layout ---
  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-8;
    align-items: flex-start;

    @include lg {
      grid-template-columns: 1fr 380px;
    }
  }

  &__left {
    @include flex-col($space-6);
  }

  &__section-card {
    @include card($radius-xl, $shadow-md);
    padding: $space-6;
  }

  &__section-title {
    font-size: 16px;
    margin-bottom: $space-6;
    padding-bottom: $space-4;
    border-bottom: 1px solid $color-border;
    font-weight: 700;
    color: black;
  }

  &__empty {
    color: $text-muted;
    text-align: center;
    padding: $space-4 0;

    a {
      color: #f97316;
      cursor: pointer;
      font-weight: 600;
      text-decoration: underline;
    }
  }

  &__items {
    @include flex-col($space-3);
  }

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
    font-weight: 800;
    font-size: 15px;
    color: $color-secondary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-qty-price {
    font-size: 13px;
    color: #828282;
    font-weight: 700;
  }

  &__item-right {
    @include flex-col($space-1);
    align-items: flex-end;
    flex-shrink: 0;
    margin-left: $space-4;
  }

  &__item-price {
    font-weight: 800;
    font-size: 17px;
    color: #f97316;
  }

  &__item-remove {
    @include btn-reset;
    font-size: $text-xs;
    color: $text-light;
    transition: $transition-fast;
    &:hover { color: $color-danger; text-decoration: underline}
  }

  // --- Form Controls & Fields ---
  &__field {
    @include flex-col($space-2);
    margin-bottom: $space-4;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__label {
    font-size: 14px;
    font-weight: 700;
    color: rgb(95, 95, 95);
  }

  &__input {
    padding: $space-3 $space-4;
    border: 1.5px solid $color-border;
    border-radius: $radius-lg;
    font-size: 14px;
    font-weight: 600;
    outline: none;
    transition: $transition-base;
    color: $color-secondary;
    background: $color-surface;

    &::placeholder {
      font-weight: 600;
    }

    &:focus {
      border-color: #f97316;
      box-shadow: 0 0 0 3px rgba(#f97316, 0.1);
    }

    &:disabled {
      background: $color-background;
      opacity: 0.7;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px $color-surface inset !important;
      -webkit-text-fill-color: $color-secondary !important;
      transition: background-color 5000s ease-in-out 0s;
    }
  }

  // --- Coupon Styles ---
  &__coupon-group {
    display: flex;
    gap: $space-3;
  }

  &__coupon-input {
    flex: 1;
  }

  &__coupon-btn {
    @include btn-primary;
    background: #f97316;
    padding: $space-3 $space-6;
    border-radius: $radius-lg;
    font-size: $text-sm;
    font-weight: 700;

    &:hover {
      background: color.adjust(#f97316, $lightness: -8%);
    }
  }

  &__coupon-success {
    font-size: $text-sm;
    color: #f97316;
    margin-top: 20px;
    font-weight: 600;
  }

  &__coupon-error {
    font-size: $text-sm;
    color: $color-danger;
    margin-top: 20px;
    font-weight: 600;
  }

  // --- Payment Switcher ---
  &__payment-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-4;
    margin-bottom: $space-5;
  }

  .payment-tab {
    @include btn-reset;
    padding: $space-4;
    border: 2px solid $color-border;
    border-radius: $radius-lg;
    font-size: $text-sm;
    font-weight: 700;
    color: $color-secondary;
    text-align: center;
    background: $color-surface;
    transition: $transition-base;

    &--active {
      border-color: #f97316;
      color: #f97316;
      background: rgba(#f97316, 0.04);
    }

    &:hover:not(&--active) {
      border-color: #f97316;
    }
  }

  &__row-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $space-4;
  }

  &__cash-message {
    font-size: $text-sm;
    font-weight: 600;
    color: #065f46;
    margin-top: $space-2;
    display: block;
  }

  // --- Sticky Summary Panel ---
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
    font-size: $text-base;

    &--discount {
      color: #f97316;
    }

    &--total {
      font-family: $font-heading;
      font-size: $text-xl;
      font-weight: 800;
      color: $color-secondary;
      padding-top: $space-3;
      border-top: 1px solid $color-border;

      span:last-child { color: #f97316; }
    }
  }

  &__error {
    color: $color-danger;
    font-size: $text-sm;
    font-weight: 600;
    margin-top: $space-2;
    margin-bottom: $space-4;
    display: block;
  }

  &__place-btn {
    @include btn-primary;
    background: #f97316;
    width: 100%;
    padding: $space-4;
    font-size: $text-base;
    border-radius: $radius-lg;
    margin-bottom: $space-3;

    &:hover {
      background: color.adjust(#f97316, $lightness: -8%);
      box-shadow: 0 6px 18px rgba(#f97316, 0.3);
    }

    &:disabled {
      background: $text-light;
      transform: none;
      box-shadow: none;
      cursor: not-allowed;
    }
  }

  &__back-to-cart-btn {
    @include btn-reset;
    width: 100%;
    text-align: center;
    font-size: $text-sm;
    color: rgb(67, 67, 67);
    padding: $space-2;
    transition: $transition-fast;
    margin-bottom: $space-3;

    &:hover {
      color: #f97316;
      text-decoration: underline;
    }
  }

  &__note {
    font-size: $text-xs;
    color: $text-light;
    text-align: center;
  }
}
</style>
