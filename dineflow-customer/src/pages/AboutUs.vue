<script setup lang="ts">
// AboutUs page — static content, no data fetching needed
</script>

<template>
  <div class="about-page">

    <!-- Hero Banner -->
    <section class="about-page__hero">
      <div class="container">
        <span class="about-page__label">Our Story</span>
        <h1 class="about-page__title">Dining reimagined,<br />one table at a time.</h1>
        <p class="about-page__desc">
          DineFlow was built to remove friction from the restaurant experience.
          No flagging down waiters, no printing menus — just seamless digital ordering from your seat.
        </p>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="section about-page__stats-section">
      <div class="container">
        <div class="about-page__stats">
          <div class="about-page__stat">
            <span class="about-page__stat-num">500+</span>
            <span class="about-page__stat-label">Orders Served</span>
          </div>
          <div class="about-page__stat">
            <span class="about-page__stat-num">98%</span>
            <span class="about-page__stat-label">Customer Satisfaction</span>
          </div>
          <div class="about-page__stat">
            <span class="about-page__stat-num">3 min</span>
            <span class="about-page__stat-label">Avg Order to Kitchen</span>
          </div>
          <div class="about-page__stat">
            <span class="about-page__stat-num">1</span>
            <span class="about-page__stat-label">Restaurant (growing!)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="section about-page__values-section">
      <div class="container">
        <h2 class="about-page__section-title">What we stand for</h2>
        <div class="about-page__values">
          <div class="about-page__value">
            <span class="about-page__value-icon">⚡</span>
            <h3 class="about-page__value-name">Speed</h3>
            <p class="about-page__value-desc">Your order goes to the kitchen the moment you tap confirm. No delays.</p>
          </div>
          <div class="about-page__value">
            <span class="about-page__value-icon">🌿</span>
            <h3 class="about-page__value-name">Freshness</h3>
            <p class="about-page__value-desc">Every item on our menu is freshly prepared from quality ingredients.</p>
          </div>
          <div class="about-page__value">
            <span class="about-page__value-icon">💡</span>
            <h3 class="about-page__value-name">Simplicity</h3>
            <p class="about-page__value-desc">Ordering should be as easy as browsing your phone.</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style lang="scss" scoped>
.about-page {
  padding-bottom: $space-16;

  // Hero
  &__hero {
    background: linear-gradient(135deg, $color-secondary 0%, #2c476f 100%);
    padding: $space-16 0;
    margin-bottom: $space-12;

    .container { @include flex-col($space-5); max-width: 680px; }
  }

  &__label {
    display: inline-block;
    padding: $space-1 $space-3;
    border-radius: $radius-full;
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.85);
    font-size: $text-sm;
    font-weight: 700;
    width: fit-content;
  }

  &__title {
    font-size: clamp(2rem, 4vw, 2.75rem);
    color: #fff;
    line-height: 1.2;
  }

  &__desc {
    font-size: $text-lg;
    color: rgba(255, 255, 255, 0.7);
    max-width: 520px;
    line-height: 1.7;
  }

  // Stats row
  &__stats-section { background: $color-background; }

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $space-6;

    @include md { grid-template-columns: repeat(4, 1fr); }
  }

  &__stat {
    @include card($radius-lg, $shadow-sm);
    padding: $space-6;
    text-align: center;
    @include flex-col($space-2);
    align-items: center;
  }

  &__stat-num {
    font-family: $font-heading;
    font-size: $text-3xl;
    font-weight: 800;
    color: $color-primary;
  }

  &__stat-label {
    font-size: $text-sm;
    color: $text-muted;
  }

  // Values section
  &__values-section { background: $color-muted; }

  &__section-title {
    text-align: center;
    margin-bottom: $space-10;
  }

  &__values {
    display: grid;
    grid-template-columns: 1fr;
    gap: $space-6;

    @include md { grid-template-columns: repeat(3, 1fr); }
  }

  &__value {
    @include card($radius-lg, $shadow-sm);
    padding: $space-8 $space-6;
    text-align: center;
    @include flex-col($space-4);
    align-items: center;
  }

  &__value-icon { font-size: 2.5rem; }

  &__value-name {
    font-size: $text-lg;
    color: $color-secondary;
  }

  &__value-desc {
    font-size: $text-sm;
    color: $text-muted;
    line-height: 1.6;
  }
}
</style>
