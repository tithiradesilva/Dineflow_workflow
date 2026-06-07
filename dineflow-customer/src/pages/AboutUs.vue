<script setup lang="ts">
// AboutUs page — static content, no data fetching needed
</script>

<template>
  
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
