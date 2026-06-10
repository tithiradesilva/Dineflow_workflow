<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="home">

    <!-- ===== HERO SECTION ===== -->
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__content anim-fade-in">
          <p class="hero__eyebrow">Explore your</p>
          <h1 class="hero__title">
            <span class="hero__title--accent">Favorite</span> Food.
          </h1>
          <div class="hero__search">
            <button class="hero__order-btn" @click="router.push('/products')">Order Now</button>
          </div>
        </div>

        <!-- ===== FEATURES STRIP ===== -->
        <div class="hero__features">
          <!-- Feature 1 -->
          <div class="hero__feature">
            <div class="hero__feature-icon-wrap">
              <svg class="hero__feature-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="13" r="8"></circle>
                <path d="M12 9v4l2 2"></path>
                <path d="M12 2v3M10 2h4"></path>
              </svg>
            </div>
            <div class="hero__feature-text">
              <p class="hero__feature-sub">Delivery in 30 Minutes</p>
              <p class="hero__feature-label">Fast Delivery</p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="hero__feature">
            <div class="hero__feature-icon-wrap">
              <svg class="hero__feature-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="hero__feature-text">
              <p class="hero__feature-sub">Your payments are Secured</p>
              <p class="hero__feature-label">Secure Payments</p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="hero__feature">
            <div class="hero__feature-icon-wrap">
              <svg class="hero__feature-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <div class="hero__feature-text">
              <p class="hero__feature-sub">Make an order easily</p>
              <p class="hero__feature-label">Easy Ordering</p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="hero__feature">
            <div class="hero__feature-icon-wrap">
              <svg class="hero__feature-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <div class="hero__feature-text">
              <p class="hero__feature-sub">Order with our best price</p>
              <p class="hero__feature-label">Amazing Deals</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== ABOUT US SECTION ===== -->
    <section class="about">
      <div class="container">
        <p class="about__eyebrow">About Us</p>
        <h2 class="about__heading">
          “<span class="about__heading--orange">Fresh and Delicious</span> Food to your <span class="about__heading--orange">Doorstep</span>”
        </h2>
        <div class="about__body">
          <div class="about__text">
            <p>
              <strong class="about__highlight">Founded in 2019</strong>, the House of Döner has quickly become a
              national phenomenon. With over 120 locations, primarily in
              Germany.
            </p>
            <p>
              Founded in 2019, the House of Döner has quickly become a national phenomenon.
              <strong class="about__highlight">With over 120 locations</strong>, primarily in
              Germany, as well as some in the Netherlands, London, Istanbul, and Saudi Arabia,
              we attract not only lovers of hearty street food but also curious foodies seeking
              a unique taste experience.
            </p>
          </div>
          <div class="about__images">
            <!-- Overlapping, tilted images matching polaroid style -->
            <div class="about__photo-card about__photo-card--back">
              <img
                class="about__img"
                src="@/assets/ShopImage.png"
                alt="House of Döner restaurant interior"
              />
            </div>
            <div class="about__photo-card about__photo-card--front">
              <img
                class="about__img"
                src="@/assets/ShopImage.png"
                alt="House of Döner restaurant interior"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MOBILE APP SECTION ===== -->
    <section class="mobile-app">
      <div class="container">
        <div class="mobile-app__card">
          <div class="mobile-app__content">
            <h2 class="mobile-app__title">
              Switch to our <span class="mobile-app__title--orange">Mobile App</span>
            </h2>
            <p class="mobile-app__desc">
              Hot & fast – order easily online for delivery, pickup, or visit us in-store.
            </p>
            <p class="mobile-app__notice">
              We look forward to seeing you !
            </p>
            <div class="mobile-app__badges">
              <!-- Google Play Badge -->
              <a href="#" class="mobile-app__badge-link" aria-label="Get it on Google Play">
                <img class="mobile-app__badge-img" src="@/assets/Play Store 1.png" alt="Get it on Google Play" />
              </a>
              <!-- App Store Badge -->
              <a href="#" class="mobile-app__badge-link" aria-label="Download on the App Store">
                <img class="mobile-app__badge-img" src="@/assets/App Store 1.png" alt="Download on the App Store" />
              </a>
            </div>
          </div>
          <div class="mobile-app__image-wrap">
            <img
              class="mobile-app__iphone"
              src="@/assets/IMG_8380-left 1.png"
              alt="Dineflow mobile app on iPhone"
            />
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style lang="scss" scoped>
// ============================================================
// HERO SECTION
// ============================================================
.hero {
  position: relative;
  min-height: 100vh;
  margin-top: -$navbar-height;
  padding-top: $navbar-height;
  // Deep overlay over a blurred background food image
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0.75) 100%),
    url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80') center / cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;

  &__inner {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $space-6;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    min-height: 90vh;
  }

  &__content {
    margin-top: auto;
    margin-bottom: auto;
    max-width: 650px;
    padding: $space-16 0;
  }

  &__eyebrow {
    font-size: clamp(1.5rem, 3.5vw, 2.5rem);
    font-weight: 700;
    color: #ffffff;
    margin-bottom: $space-1;
    letter-spacing: -0.5px;
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(3.5rem, 8vw, 5.5rem);
    font-weight: 800;
    color: #ffffff;
    line-height: 1.15;
    margin-bottom: $space-8;
    letter-spacing: -1.5px;

    &--accent {
      color: #ee5a13; // Deep orange brand color from screenshot
    }
  }

  // Hero CTA Search Row
  &__search {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 15px;
  }

  &__order-btn {
    width: 180px;
    height: 54px;
    background: #ee5a13;
    color: #ffffff;
    border: none;
    border-radius: 9999px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(238, 90, 19, 0.3);
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #d4490b;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(238, 90, 19, 0.45);
    }
    &:active {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(238, 90, 19, 0.25);
    }
  }

  // Bottom Features Bar
  &__features {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 24px;
    padding: $space-10 0;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    margin-bottom: $space-6;
    width: 100%;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1 1 230px;
    justify-content: center;
  }

  &__feature-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: $radius-full;
    color: #ee5a13;
    flex-shrink: 0;
  }

  &__feature-svg {
    width: 36px;
    height: 36px;
    stroke: #ee5a13;
    stroke-width: 2.2;
  }

  &__feature-text {
    display: flex;
    flex-direction: column;
  }

  &__feature-sub {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 3px;
    font-weight: 500;
  }

  &__feature-label {
    font-size: 17px;
    font-weight: 750;
    color: #ffffff;
  }
}

// ============================================================
// ABOUT US SECTION
// ============================================================
.about {
  background: #ffffff;
  padding: $space-16 0 90px;

  &__eyebrow {
    text-align: center;
    font-family: $font-heading;
    font-size: $text-lg;
    font-weight: 700;
    color: #6b7280;
    margin-bottom: $space-2;
    letter-spacing: 0.05em;
  }

  &__heading {
    font-family: $font-heading;
    font-size: clamp(1.8rem, 4.5vw, 2.75rem);
    font-weight: 800;
    color: #111827;
    text-align: center;
    margin-bottom: $space-16;
    line-height: 1.25;

    &--orange {
      color: #ee5a13;
    }
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-12;
    align-items: center;

    @include lg {
      grid-template-columns: 1.1fr 0.9fr;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: $space-6;

    p {
      font-size: $text-lg;
      color: #111827;
      line-height: 1.75;
      font-weight: 700;
      line-height: 45px;
    }
  }

  &__highlight {
    color: #ee5a13;
    font-weight: 750;
  }

  &__images {
    position: relative;
    height: 380px;
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
  }

  &__photo-card {
    position: absolute;
    border-radius: $radius-lg;
    overflow: hidden;
    box-shadow: $shadow-lg;
    transition: transform 0.3s ease;
  }

  &__photo-card--back {
    width: 290px;
    height: 250px;
    top: 0;
    left: 0;
    transform: rotate(-6deg);
    z-index: 1;
  }

  &__photo-card--front {
    width: 290px;
    height: 250px;
    right: 0;
    bottom: 0;
    transform: rotate(4deg);
    z-index: 2;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// ============================================================
// MOBILE APP SECTION
// ============================================================
.mobile-app {
  background: #ffffff;
  padding: 100px 0 80px;

  &__card {
    background: #f7f7f7; // Light premium grey background card
    border-radius: $radius-xl;
    padding: $space-12 clamp($space-6, 6vw, $space-16) $space-10;
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-8;
    align-items: center;
    position: relative;
    overflow: visible;

    @include lg {
      grid-template-columns: 1.2fr 0.8fr;
      min-height: 320px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    color: #111827;
    margin-bottom: $space-4;
    line-height: 1.15;

    &--orange {
      color: #ee5a13;
    }
  }

  &__desc {
    font-size: $text-lg;
    color: #474747;
    line-height: 1.6;
    margin-bottom: $space-4;
    font-weight: 650;
  }

  &__notice {
    font-size: $text-lg;
    font-weight: 700;
    color: #ee5a13;
    margin-bottom: $space-8;
  }

  &__badges {
    display: flex;
    align-items: center;
    gap: $space-4;
    flex-wrap: wrap;
  }

  &__badge-link {
    display: inline-block;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__badge-img {
    height: 120px;
    width: auto;
    display: block;
    object-fit: contain;
    mix-blend-mode: multiply;
    margin: -15px -10px -40px -10px; /* Offset the large transparent margins of the PNG assets */
  }

  &__image-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    @include lg {
      position: absolute;
      right: $space-8;
      bottom: 0;
      width: 350px;
      height: 125%; // Overflow card container upwards
    }
  }

  &__iphone {
    max-width: 320px;
    width: 100%;
    height: auto;
    object-fit: contain;
    animation: float-phone 2s ease-in-out infinite;

    @include lg {
      max-width: none;
      height: 100%;
      position: absolute;
      bottom: 0;
    }
  }
}

@keyframes float-phone {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
</style>
