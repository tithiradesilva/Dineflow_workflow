<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()

// Local template state
const phoneDigits = ref('')
const otp = ref('')
const step = ref<'phone' | 'otp'>('phone')
const isLoading = ref(false)
const errorMessage = ref('')

// Compute full phone number for authentication
const phone = computed(() => {
  return `+94 ${phoneDigits.value}`
})

// Check if mobile number is valid (Sri Lankan mobile has exactly 9 digits starting with 7)
const isPhoneValid = computed(() => {
  const digitsOnly = phoneDigits.value.replace(/\D/g, '')
  return digitsOnly.length === 9 && digitsOnly.startsWith('7')
})

// Check if OTP is valid (6 digits)
const isOtpValid = computed(() => {
  return otp.value.trim().length === 6
})

// Auto-format phone input to 7X XXX XXXX format for Sri Lankan numbers
function formatPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // remove non-digits
  
  if (value.length > 0 && value.charAt(0) !== '7') {
    value = ''
  }

  if (value.length > 9) {
    value = value.slice(0, 9)
  }

  let formatted = ''
  if (value.length > 0) {
    formatted += value.slice(0, 2)
  }
  if (value.length > 2) {
    formatted += ' ' + value.slice(2, 5)
  }
  if (value.length > 5) {
    formatted += ' ' + value.slice(5)
  }

  phoneDigits.value = formatted
}

// Request OTP code
async function sendOtp() {
  if (!isPhoneValid.value) {
    errorMessage.value = 'Please enter a valid mobile number.'
    return
  }
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Simulate API request to send SMS OTP code
    await new Promise((resolve) => setTimeout(resolve, 800))
    step.value = 'otp'
  } catch (e) {
    errorMessage.value = 'Failed to send verification code. Try again.'
  } finally {
    isLoading.value = false
  }
}

// Verify OTP code
async function verifyOtp() {
  if (!isOtpValid.value) {
    errorMessage.value = 'OTP code must be 6 digits.'
    return
  }
  
  // For testing convenience, we verify if the OTP code matches 123456
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (otp.value.trim() === '123456') {
      auth.login(phone.value)
      closeModal()
    } else {
      errorMessage.value = 'Invalid OTP code. Please enter 123456.'
    }
  } catch (e) {
    errorMessage.value = 'Verification failed. Try again.'
  } finally {
    isLoading.value = false
  }
}

// Guest checkout bypass
function continueAsGuest() {
  auth.hasSkippedPhone = true
  closeModal()
}

// Reset form and close
function closeModal() {
  phoneDigits.value = ''
  otp.value = ''
  step.value = 'phone'
  errorMessage.value = ''
  auth.showLoginModal = false
}

// Sign out
function handleSignOut() {
  auth.logout()
  closeModal()
}
</script>

<template>
  <div v-if="auth.showLoginModal" class="login-modal-overlay">
    <div class="login-modal-card anim-scale-up">
      
      <!-- Close Header button -->
      <button class="login-modal-card__close-btn" @click="closeModal" aria-label="Close modal">
        ✕
      </button>

      <!-- LOGGED IN USER PROFILE STATE -->
      <div v-if="auth.isLoggedIn" class="login-modal-card__logged-in">
        <div class="login-modal-card__icon-container">
          👤
        </div>
        <h2 class="login-modal-card__title">Your Account</h2>
        <p class="login-modal-card__subtitle">You are currently logged in to Dineflow.</p>
        
        <div class="login-modal-card__profile-phone">
          {{ auth.phoneNumber }}
        </div>

        <button class="login-modal-card__btn-logout" @click="handleSignOut">
          Sign Out
        </button>
      </div>

      <!-- SIGN IN FLOW -->
      <div v-else>
        <!-- STEP 1: Phone number prompt -->
        <div v-if="step === 'phone'" class="login-modal-card__step">
          <h2 class="login-modal-card__title">Sign In</h2>
          <p class="login-modal-card__subtitle">
            Enter your mobile number to sign in and track your orders in real-time.
          </p>

          <form @submit.prevent="sendOtp" class="login-modal-card__form">
            <div class="login-modal-card__field">
              <label class="login-modal-card__label">Mobile Number</label>
              <div class="login-modal-card__phone-group">
                <span class="phone-prefix">+94</span>
                <input
                  type="text"
                  :value="phoneDigits"
                  @input="formatPhoneInput"
                  class="phone-input-field"
                  placeholder="71 234 5678"
                  autocomplete="tel"
                  required
                  :disabled="isLoading"
                />
              </div>
            </div>

            <p v-if="errorMessage" class="login-modal-card__error">{{ errorMessage }}</p>

            <button
              type="submit"
              class="login-modal-card__btn-primary"
              :disabled="isLoading || !isPhoneValid"
            >
              <span v-if="isLoading" class="anim-spin">⏳</span>
              <span v-else>Send OTP</span>
            </button>

            <!-- Option to continue as guest during checkout -->
            <button
              v-if="auth.isCheckoutTrigger"
              type="button"
              class="login-modal-card__btn-guest"
              @click="continueAsGuest"
            >
              Continue without phone number
            </button>
          </form>
        </div>

        <!-- STEP 2: OTP Prompt -->
        <div v-else-if="step === 'otp'" class="login-modal-card__step">
          <h2 class="login-modal-card__title">Verify Number</h2>
          <p class="login-modal-card__subtitle">
            We sent a verification code to <span class="phone-highlight">{{ phone }}</span>.
          </p>

          <form @submit.prevent="verifyOtp" class="login-modal-card__form">
            <div class="login-modal-card__field">
              <label class="login-modal-card__label">6-Digit Code</label>
              <input
                type="text"
                v-model="otp"
                maxlength="6"
                class="login-modal-card__input otp-input"
                placeholder="000000"
                autocomplete="one-time-code"
                required
                :disabled="isLoading"
              />
            </div>

            <!-- Testing Badge -->
            <div class="login-modal-card__test-badge">
              <span>💡 For testing, enter verification code <strong>123456</strong></span>
            </div>

            <p v-if="errorMessage" class="login-modal-card__error">{{ errorMessage }}</p>

            <button
              type="submit"
              class="login-modal-card__btn-primary"
              :disabled="isLoading || !isOtpValid"
            >
              <span v-if="isLoading" class="anim-spin">⏳</span>
              <span v-else>Verify & Sign In</span>
            </button>

            <button
              type="button"
              class="login-modal-card__btn-back"
              @click="step = 'phone'"
              :disabled="isLoading"
            >
              Edit phone number
            </button>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";

.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-4;
}

.login-modal-card {
  position: relative;
  background: $color-surface;
  @include card($radius-xl, $shadow-xl);
  width: 100%;
  max-width: 420px;
  padding: $space-8 $space-6;
  text-align: center;
  box-sizing: border-box;

  &__close-btn {
    @include btn-reset;
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 18px;
    color: $text-muted;
    transition: $transition-fast;
    padding: 6px;
    border-radius: 50%;
    
    &:hover {
      color: $color-primary-dark;
      background: rgba(0, 0, 0, 0.05);
    }
  }

  &__icon-container {
    width: 68px;
    height: 68px;
    background: rgba(#f97316, 0.08);
    color: #f97316;
    font-size: 28px;
    border-radius: 50%;
    @include flex-center;
    margin: 0 auto $space-4;
  }

  &__title {
    font-family: $font-heading;
    font-size: 24px;
    font-weight: 800;
    color: $color-secondary;
    margin-bottom: $space-2;
  }

  &__subtitle {
    font-family: $font-body;
    font-size: 14px;
    color: $text-muted;
    line-height: 1.5;
    margin-bottom: $space-6;
    font-weight: 700;
    
    .phone-highlight {
      font-weight: 800;
      color: $color-secondary;
    }
  }

  &__profile-phone {
    font-family: $font-heading;
    font-size: 20px;
    font-weight: 800;
    color: #f97316;
    margin: $space-4 0 $space-6;
  }

  &__form {
    @include flex-col($space-4);
    align-items: stretch;
    text-align: left;
  }

  &__field {
    @include flex-col($space-2);
  }

  &__label {
    font-size: 13px;
    font-weight: 700;
    color: rgb(85, 85, 85);
  }

  &__input {
    padding: $space-3 $space-4;
    border: 1.5px solid $color-border;
    border-radius: $radius-lg;
    font-size: 15px;
    font-weight: 600;
    outline: none;
    transition: $transition-base;
    color: $color-secondary;
    background: $color-surface;

    &::placeholder {
      font-weight: 600;
      color: $text-light;
    }

    &:focus {
      border-color: #f97316;
      box-shadow: 0 0 0 3px rgba(#f97316, 0.1);
    }
  }

  &__phone-group {
    display: flex;
    align-items: center;
    border: 1.5px solid $color-border;
    border-radius: $radius-lg;
    padding: 0 $space-4;
    background: $color-surface;
    transition: $transition-base;

    &:focus-within {
      border-color: #f97316;
      box-shadow: 0 0 0 3px rgba(#f97316, 0.1);
    }

    .phone-prefix {
      font-size: 15px;
      font-weight: 700;
      color: $color-secondary;
      margin-right: 8px;
      user-select: none;
    }

    .phone-input-field {
      border: none;
      outline: none;
      padding: $space-3 0;
      font-size: 15px;
      font-weight: 600;
      color: $color-secondary;
      background: transparent;
      flex: 1;

      &::placeholder {
        font-weight: 600;
        color: $text-light;
      }
    }
  }

  .otp-input {
    letter-spacing: 4px;
    text-align: center;
  }

  &__test-badge {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: $radius-md;
    padding: 10px 14px;
    font-size: 12px;
    color: #065f46;
    text-align: center;
    font-weight: 500;
  }

  &__error {
    color: $color-danger;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 0;
  }

  &__btn-primary {
    @include btn-primary;
    background: #f97316;
    height: 48px;
    font-size: 15px;
    font-weight: 700;
    border-radius: $radius-lg;
    @include flex-center;
    width: 100%;

    &:hover {
      background: color.adjust(#f97316, $lightness: -8%);
      box-shadow: 0 6px 18px rgba(#f97316, 0.25);
    }
  }

  &__btn-guest {
    @include btn-reset;
    font-size: 14px;
    color: $text-muted;
    text-align: center;
    padding: $space-2 0;
    transition: $transition-fast;
    font-weight: 600;

    &:hover {
      color: #f97316;
      text-decoration: underline;
    }
  }

  &__btn-back {
    @include btn-reset;
    font-size: 14px;
    color: $text-muted;
    text-align: center;
    padding: $space-2 0;
    transition: $transition-fast;
    font-weight: 600;

    &:hover {
      color: $color-secondary;
      text-decoration: underline;
    }
  }

  &__btn-logout {
    @include btn-primary;
    background: transparent;
    color: $color-danger;
    border: 1.5px solid $color-danger;
    height: 46px;
    font-size: 15px;
    font-weight: 700;
    border-radius: $radius-lg;
    width: 100%;
    margin-bottom: $space-3;
    @include flex-center;

    &:hover {
      background: rgba($color-danger, 0.05);
      transform: translateY(-1px);
      box-shadow: none;
    }
  }
}
</style>
