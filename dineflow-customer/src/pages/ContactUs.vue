<script setup lang="ts">
import { ref } from 'vue'

// Form state — simple local form with no backend needed for skeleton
const form = ref({ name: '', email: '', message: '' })
const submitted = ref(false)
const isSubmitting = ref(false)

// Submit handler (placeholder — wire to email service or Supabase later)
async function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.message) return

  isSubmitting.value = true
  // Simulate async delay (replace with real submission logic)
  await new Promise(resolve => setTimeout(resolve, 800))
  submitted.value = true
  isSubmitting.value = false
}
</script>

<template>
  <div class="contact-page">

    <!-- Header -->
    <div class="contact-page__header">
      <div class="container">
        <h1 class="contact-page__title">Get in Touch</h1>
        <p class="contact-page__sub">Have feedback, a question, or want to work with us? We'd love to hear from you.</p>
      </div>
    </div>

    <div class="container">
      <div class="contact-page__layout">

        <!-- Left: Contact Form -->
        <div class="contact-page__form-wrap">

          <!-- Success Message -->
          <div v-if="submitted" class="contact-page__success anim-fade-in">
            <span>✅</span>
            <h3>Message Sent!</h3>
            <p>We'll get back to you within 24 hours.</p>
          </div>

          <!-- Form -->
          <form v-else class="contact-page__form" @submit.prevent="handleSubmit">
            <h2 class="contact-page__form-title">Send a Message</h2>

            <!-- Name -->
            <div class="contact-page__field">
              <label class="contact-page__label" for="contact-name">Your Name</label>
              <input
                id="contact-name"
                v-model="form.name"
                class="contact-page__input"
                type="text"
                placeholder="Jane Doe"
                required
              />
            </div>

            <!-- Email -->
            <div class="contact-page__field">
              <label class="contact-page__label" for="contact-email">Email Address</label>
              <input
                id="contact-email"
                v-model="form.email"
                class="contact-page__input"
                type="email"
                placeholder="jane@example.com"
                required
              />
            </div>

            <!-- Message -->
            <div class="contact-page__field">
              <label class="contact-page__label" for="contact-message">Message</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                class="contact-page__textarea"
                rows="5"
                placeholder="Tell us what's on your mind..."
                required
              ></textarea>
            </div>

            <button
              class="contact-page__submit-btn"
              type="submit"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Sending...' : 'Send Message →' }}
            </button>
          </form>
        </div>

        <!-- Right: Contact Info -->
        <aside class="contact-page__info">
          <h2 class="contact-page__info-title">Contact Info</h2>

          <div class="contact-page__info-items">
            <div class="contact-page__info-item">
              <span class="contact-page__info-icon">📍</span>
              <div>
                <strong>Location</strong>
                <p>123 Restaurant Row, Dine City</p>
              </div>
            </div>
            <div class="contact-page__info-item">
              <span class="contact-page__info-icon">🕐</span>
              <div>
                <strong>Hours</strong>
                <p>Mon–Fri: 11am – 10pm<br />Weekends: 10am – 11pm</p>
              </div>
            </div>
            <div class="contact-page__info-item">
              <span class="contact-page__info-icon">✉️</span>
              <div>
                <strong>Email</strong>
                <p>hello@dineflow.com</p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contact-page {
  padding-bottom: $space-16;

  &__header {
    background: linear-gradient(135deg, $color-muted, #fff);
    padding: $space-10 0;
    margin-bottom: $space-10;
  }

  &__title { margin-bottom: $space-2; }
  &__sub   { color: $text-muted; max-width: 480px; }

  // Two-column layout
  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-8;
    align-items: flex-start;

    @include lg {
      grid-template-columns: 1fr 340px;
    }
  }

  // --- Form Panel ---
  &__form-wrap {
    @include card($radius-xl, $shadow-md);
    padding: $space-8;
  }

  &__form-title {
    font-size: $text-xl;
    margin-bottom: $space-6;
  }

  &__form {
    @include flex-col($space-5);
  }

  &__field {
    @include flex-col($space-2);
  }

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: $color-secondary;
  }

  &__input,
  &__textarea {
    padding: $space-3 $space-4;
    border: 1.5px solid $color-border;
    border-radius: $radius-lg;
    font-size: $text-base;
    color: $color-secondary;
    background: $color-surface;
    outline: none;
    transition: $transition-base;
    resize: vertical;  // textarea only

    &:focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }

  &__submit-btn {
    @include btn-primary;
    padding: $space-3 $space-8;
    font-size: $text-base;
    border-radius: $radius-lg;
    align-self: flex-start;
  }

  // Success message
  &__success {
    @include flex-col($space-3);
    align-items: center;
    text-align: center;
    padding: $space-12 $space-6;

    span { font-size: 3rem; }
    h3   { font-size: $text-2xl; color: $color-success; }
    p    { color: $text-muted; }
  }

  // --- Info Panel ---
  &__info {
    @include card($radius-xl, $shadow-sm);
    padding: $space-6;
    background: $color-secondary;

    @include lg {
      position: sticky;
      top: calc(#{$navbar-height} + #{$space-6});
    }
  }

  &__info-title {
    font-size: $text-lg;
    color: #fff;
    margin-bottom: $space-6;
  }

  &__info-items {
    @include flex-col($space-5);
  }

  &__info-item {
    @include flex-row($space-4);
    align-items: flex-start;

    strong {
      display: block;
      color: #fff;
      font-size: $text-sm;
      margin-bottom: $space-1;
    }

    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: $text-sm;
      line-height: 1.5;
    }
  }

  &__info-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
}
</style>
