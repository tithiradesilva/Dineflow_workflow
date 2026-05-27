<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import { menuService } from '@/services/menuService'
import type { MenuItem, Category } from '@/services/menuService'

const isLoading  = ref(true)
const error      = ref('')
const allItems   = ref<MenuItem[]>([])
const categories = ref<Category[]>([])

// Currently selected category filter ('All' shows everything)
const activeCategory = ref('All')

// Search query for filtering by name
const searchQuery = ref('')

// Load menu data from Supabase on mount
async function loadMenu() {
  try {
    const [items, cats] = await Promise.all([
      menuService.getMenuItems(),
      menuService.getCategories()
    ])
    allItems.value   = items
    categories.value = cats
  } catch (e: any) {
    error.value = 'Could not load menu. Please check your connection.'
  } finally {
    isLoading.value = false
  }
}

// Filtered items based on selected category + search query
const filteredItems = computed(() => {
  return allItems.value.filter(item => {
    const matchesCategory = activeCategory.value === 'All' || item.category === activeCategory.value
    const matchesSearch   = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

onMounted(loadMenu)
</script>

<template>
  <div class="products-page">

    <!-- Page Header -->
    <div class="products-page__header">
      <div class="container">
        <h1 class="products-page__title">Our Menu</h1>
        <p class="products-page__sub">Fresh dishes made to order — find your favourites below.</p>
      </div>
    </div>

    <div class="container">

      <!-- Controls: Category Tabs + Search -->
      <div class="products-page__controls">

        <!-- Category Filter Tabs -->
        <div class="products-page__tabs">
          <button
            class="products-page__tab"
            :class="{ 'products-page__tab--active': activeCategory === 'All' }"
            @click="activeCategory = 'All'"
          >
            All
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="products-page__tab"
            :class="{ 'products-page__tab--active': activeCategory === cat.name }"
            @click="activeCategory = cat.name"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Search Input -->
        <div class="products-page__search-wrap">
          <span class="products-page__search-icon">🔍</span>
          <input
            v-model="searchQuery"
            class="products-page__search"
            type="text"
            placeholder="Search dishes..."
          />
        </div>
      </div>

      <!-- Loading skeletons -->
      <div v-if="isLoading" class="products-page__grid">
        <div v-for="n in 8" :key="n" class="skeleton-card"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="products-page__error">{{ error }}</div>

      <!-- Empty state -->
      <div v-else-if="filteredItems.length === 0" class="products-page__empty">
        <span>🍽️</span>
        <p>No items match your search.</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="products-page__grid">
        <ProductCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
        />
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.products-page {
  padding-bottom: $space-16;

  &__header {
    background: linear-gradient(135deg, $color-muted, #fff);
    padding: $space-10 0;
    margin-bottom: $space-8;
  }

  &__title { margin-bottom: $space-2; }
  &__sub   { color: $text-muted; }

  // Controls row
  &__controls {
    @include flex-row($space-4);
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: $space-8;
    gap: $space-4;
  }

  // Category tabs scrollable on mobile
  &__tabs {
    @include flex-row($space-2);
    flex-wrap: wrap;
    gap: $space-2;
  }

  &__tab {
    @include btn-reset;
    padding: $space-2 $space-4;
    border-radius: $radius-full;
    border: 1.5px solid $color-border;
    color: $text-muted;
    font-size: $text-sm;
    transition: $transition-base;

    &:hover {
      border-color: $color-primary;
      color: $color-primary;
    }

    &--active {
      background: $color-primary;
      border-color: $color-primary;
      color: #fff;
    }
  }

  // Search box
  &__search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__search-icon {
    position: absolute;
    left: $space-3;
    font-size: $text-base;
    pointer-events: none;
  }

  &__search {
    padding: $space-2 $space-4 $space-2 $space-10;
    border: 1.5px solid $color-border;
    border-radius: $radius-lg;
    font-size: $text-sm;
    width: 220px;
    outline: none;
    transition: $transition-base;
    background: $color-surface;
    color: $color-secondary;

    &:focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px rgba($color-primary, 0.1);
    }
  }

  // Products grid (responsive columns)
  &__grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: $space-6;

    @include sm { grid-template-columns: repeat(2, 1fr); }
    @include lg { grid-template-columns: repeat(3, 1fr); }
    @include xl { grid-template-columns: repeat(4, 1fr); }
  }

  &__error,
  &__empty {
    text-align: center;
    padding: $space-16;
    color: $text-muted;

    span { font-size: 3rem; display: block; margin-bottom: $space-4; }
  }

  &__error { color: $color-danger; }
}

// Skeleton loading card
.skeleton-card {
  height: 320px;
  border-radius: $radius-lg;
  background: linear-gradient(90deg, $color-border 25%, #edf0f3 50%, $color-border 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
