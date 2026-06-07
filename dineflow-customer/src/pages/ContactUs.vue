<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  description: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)

async function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.description) return
  isSubmitting.value = true
  
  // Simulate API post
  await new Promise((resolve) => setTimeout(resolve, 800))
  
  submitted.value = true
  isSubmitting.value = false
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    description: ''
  }
}
</script>

<template>
  <div class="contact-page">
    
    <!-- Page Header (Centered) -->
    <div class="contact-page__header">
      <div class="container">
        <span class="contact-page__category-count">Contact Us</span>
        <h1 class="contact-page__title">Get In Touch</h1>
      </div>
    </div>

    <!-- Contact Info Cards Grid -->
    <div class="container">
      <div class="contact-page__grid">
        
        <!-- Address Card -->
        <div class="contact-card">
          <div class="contact-card__icon-wrap">
            <svg class="contact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <h2 class="contact-card__title">Address</h2>
          <div class="contact-card__groups">
            <div class="contact-card__group">
              <span class="contact-card__group-label">Australia</span>
              <p class="contact-card__group-text">Melbourne, Victoria,<br>Australia.</p>
            </div>
            <div class="contact-card__group">
              <span class="contact-card__group-label">Sri Lanka</span>
              <p class="contact-card__group-text">Colombo, Western Province,<br>Sri Lanka.</p>
            </div>
          </div>
        </div>

        <!-- Phone Card -->
        <div class="contact-card">
          <div class="contact-card__icon-wrap">
            <svg class="contact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <h2 class="contact-card__title">Phone</h2>
          <div class="contact-card__groups">
            <div class="contact-card__group">
              <span class="contact-card__group-label">Australia</span>
              <p class="contact-card__group-text">+61 491 570 006</p>
            </div>
            <div class="contact-card__group">
              <span class="contact-card__group-label">Sri Lanka</span>
              <p class="contact-card__group-text">+94 12 34 567 89</p>
            </div>
          </div>
        </div>

        <!-- Email Card -->
        <div class="contact-card">
          <div class="contact-card__icon-wrap">
            <svg class="contact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <h2 class="contact-card__title">Email</h2>
          <div class="contact-card__groups">
            <div class="contact-card__group">
              <span class="contact-card__group-label">For Donations</span>
              <p class="contact-card__group-text">sampleemail@gmail.com</p>
            </div>
            <div class="contact-card__group">
              <span class="contact-card__group-label">Technical Help</span>
              <p class="contact-card__group-text">sampleemail@gmail.com</p>
            </div>
            <div class="contact-card__group">
              <span class="contact-card__group-label">Opportunities</span>
              <p class="contact-card__group-text">sampleemail@gmail.com</p>
            </div>
          </div>
        </div>

      </div>

    <!-- Social Media Panel -->
      <div class="contact-page__social">
        <h2 class="contact-page__social-title">Connect with Us on Social Media</h2>
        <div class="contact-page__social-icons">
          <a href="#" class="social-link" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>

    </div>

    <!-- Map and Help Form Section -->
    <div class="container">
      <div class="contact-page__split">
        
        <!-- Left: Map Container -->
        <div class="contact-page__map-container">
          <iframe
            src="https://maps.google.com/maps?q=Habibi,%20Goltzstraße%2024,%2010781%20Berlin,%20Germany&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen="true"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <!-- Right: Help Form -->
        <div class="help-form">
          <h2 class="help-form__title">You need help?</h2>
          <p class="help-form__subtitle">We will contact you</p>
          
          <form v-if="!submitted" @submit.prevent="handleSubmit" class="help-form__form">
            <div class="help-form__field">
              <input
                type="text"
                v-model="form.name"
                class="help-form__input"
                placeholder="Enter Name"
                required
              />
            </div>
            
            <div class="help-form__field">
              <input
                type="email"
                v-model="form.email"
                class="help-form__input"
                placeholder="Enter Email"
                required
              />
            </div>
            
            <div class="help-form__field">
              <textarea
                v-model="form.description"
                class="help-form__textarea"
                placeholder="Description"
                rows="6"
                required
              ></textarea>
            </div>

            <div class="help-form__actions">
              <button
                type="submit"
                class="help-form__submit-btn"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Sending...' : 'Send' }}
              </button>
            </div>
          </form>

          <!-- Success State -->
          <div v-else class="help-form__success">
            <span class="help-form__success-icon">✓</span>
            <h3 class="help-form__success-title">Message Sent!</h3>
            <p class="help-form__success-text">Thank you. We will get back to you shortly.</p>
            <button @click="submitted = false" class="help-form__reset-btn">Send Another Message</button>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.contact-page {
  padding-bottom: $space-20;
  background: #ffffff;

  &__header {
    background: #ffffff;
    padding: $space-12 0 $space-6;
    text-align: center;
    margin-bottom: $space-4;
  }

  &__category-count {
    font-family: $font-heading;
    font-size: 1.0rem;
    font-weight: 700;
    color: #4e4e4e; // Orange count color
    letter-spacing: 0.5px;
    display: inline-block;
    margin-bottom: $space-2;
  }

  &__title {
    font-family: $font-heading;
    font-size: 2.25rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0 0 $space-3;
    margin-top: 10px;
    margin-bottom: 40px;
  }

  &__subtitle {
    font-family: $font-body;
    font-size: $text-base;
    color: #4b5563;
    max-width: 600px;
    margin: 0 auto;
    font-weight: 500;
  }

  // Cards Grid
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-8;
    margin-bottom: $space-16;

    @include md {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  // Split Section Layout
  &__split {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-10;
    margin-top: 120px;
    margin-bottom: 40px;
    align-items: stretch;

    @include lg {
      grid-template-columns: 1.1fr 0.9fr;
    }
  }

  &__map-container {
    width: 100%;
    min-height: 400px;
    border-radius: $radius-xl;
    overflow: hidden;
    box-shadow: $shadow-md;
    border: 1px solid rgba(0, 0, 0, 0.05);

    @include lg {
      height: 100%;
      min-height: 500px;
    }
  }

  // Social Media Panel
  &__social {
    background: #18181b; // Dark premium background
    border-radius: $radius-xl;
    padding: $space-10 $space-6;
    padding-top: 90px;
    padding-bottom: 90px;
    text-align: center;
    @include flex-col($space-6);
    align-items: center;
    max-width: 1100px;
    margin: $space-12 auto 0;
  }

  &__social-title {
    font-family: $font-heading;
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
  }

  &__social-icons {
    display: flex;
    justify-content: center;
    gap: $space-6;
    align-items: center;
  }

  .social-link {
    color: #f97316; // Orange icons
    transition: $transition-fast;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 28px;
      height: 28px;
    }

    &:hover {
      color: #ea580c; // Darker orange on hover
      transform: translateY(-2px);
    }
  }
}

// Contact Card Component styling
.contact-card {
  @include flex-col($space-6);
  align-items: center;
  text-align: center;
  padding: $space-6;

  &__icon-wrap {
    width: 100px;
    height: 100px;
    border-radius: $radius-full;
    background: #f97316; // Orange circle background
    color: #ffffff; // White icon color
    @include flex-center;
    box-shadow: 0 4px 14px rgba(249, 115, 22, 0.2);
  }

  &__icon {
    width: 32px;
    height: 32px;
  }

  &__title {
    font-family: $font-heading;
    font-size: 24px;
    font-weight: 750;
    color: #111827;
    margin: 0;
    margin-bottom: 16px;
    margin-top: 16px;
  }

  &__groups {
    @include flex-col($space-5);
    width: 100%;
  }

  &__group {
    @include flex-col($space-1);
    align-items: center;
  }

  &__group-label {
    font-family: $font-heading;
    font-size: 18px;
    font-weight: 725;
    color: #374151;
  }

  &__group-text {
    font-family: $font-body;
    font-size: 16px;
    font-weight: 650;
    color: #6b7280;
    line-height: 30px;
    margin: 0;
    margin-top: 8px;
  }
}

// Help Form component styling
.help-form {
  background: #ffffff;
  padding: $space-8 $space-6;
  @include flex-col($space-4);
  align-items: flex-start;
  width: 100%;

  @include lg {
    min-height: 570px;
  }

  &__title {
    font-family: $font-heading;
    font-size: 2.25rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0;
    text-align: left;
  }

  &__subtitle {
    font-family: $font-body;
    font-size: $text-base;
    color: #6b7280;
    margin: 0 0 $space-6;
    text-align: left;
    font-weight: 600;
  }

  &__form {
    @include flex-col($space-4);
    width: 100%;
    max-width: 480px;
  }

  &__field {
    width: 100%;
  }

  &__input,
  &__textarea {
    width: 100%;
    padding: $space-3 $space-4;
    border: 1.5px solid rgba(0, 0, 0, 0.08);
    border-radius: $radius-md;
    font-size: $text-base;
    color: #1f2937;
    background: #f9fafb;
    outline: none;
    transition: $transition-base;
    font-family: $font-body;
    font-weight: 600;

    &::placeholder {
      color: #9ca3af;
      font-weight: 500;
    }

    &:focus {
      border-color: #f97316;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
  }

  &__textarea {
    resize: none;
  }

  &__actions {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin-top: $space-4;
  }

  &__submit-btn {
    width: 160px;
    height: 48px;
    background: #f97316; // Solid orange
    color: #ffffff;
    border: none;
    border-radius: $radius-md;
    font-size: $text-base;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.15);
    transition: $transition-fast;
    @include flex-center;

    &:hover {
      background: #ea580c;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: #fdba74;
      cursor: not-allowed;
      transform: none;
    }
  }

  // Success State styles
  &__success {
    @include flex-col($space-4);
    align-items: center;
    text-align: center;
    padding: $space-10 $space-6;
    width: 100%;
    max-width: 480px;
    margin-top: auto;
    margin-bottom: auto;
  }

  &__success-icon {
    width: 64px;
    height: 64px;
    border-radius: $radius-full;
    background: #f97316;
    color: white;
    font-size: 24px;
    font-weight: 800;
    @include flex-center;
  }

  &__success-title {
    font-family: $font-heading;
    font-size: 1.5rem;
    font-weight: 800;
    color: #111827;
    margin: 0;
  }

  &__success-text {
    font-family: $font-body;
    font-size: $text-base;
    color: #858585;
    margin: 0 0 $space-4;
    font-weight: 600;
  }

  &__reset-btn {
    padding: $space-2 $space-4;
    border: 1.5px solid #f97316;
    border-radius: $radius-md;
    background: transparent;
    color: #f97316;
    font-size: $text-sm;
    font-weight: 700;
    cursor: pointer;
    transition: $transition-fast;

    &:hover {
      background: rgba(249, 115, 22, 0.05);
    }
  }
}
</style>
