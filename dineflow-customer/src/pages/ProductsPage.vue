<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import { menuService } from '@/services/menuService'
import type { MenuItem, Category } from '@/services/menuService'

const isLoading   = ref(true)
const error       = ref('')
const allItems    = ref<MenuItem[]>([])
const categories  = ref<Category[]>([])
const searchQuery = ref('')
const activeCategory = ref('All')

// Carousel slider element reference
const sliderRef = ref<HTMLElement | null>(null)

// Load data on mount
async function loadMenu() {
  try {
    const [items, cats] = await Promise.all([
      menuService.getMenuItems(),
      menuService.getCategories()
    ])
    allItems.value   = items
    categories.value = cats

    // Set default active category to first category if available
    if (cats.length > 0) {
      activeCategory.value = cats[0].name
    }
  } catch (e: any) {
    error.value = 'Could not load menu. Please check your connection.'
  } finally {
    isLoading.value = false
  }
}

// Map category names to high-quality Unsplash food images
const categoryImageMap: Record<string, string> = {
  'Starters': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80',
  'Mains': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=150&q=80',
  'Desserts': 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=150&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=150&q=80',
  'Burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80',
  'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80'
}

const getCategoryImage = (name: string) => {
  return categoryImageMap[name] || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=150&q=80'
}

// Category descriptions map
const categoryDescMap: Record<string, string> = {
  'Starters': 'Includes chicken wings, cheese bites, fresh salads, and delicious soup starters.',
  'Mains': 'Includes rice plates, pasta bowls, noodles, and main meat selections.',
  'Desserts': 'Includes premium ice creams, lava cakes, pudding jars, and sweet treats.',
  'Beverages': 'Includes fresh juices, soft carbonated drinks, iced coffees, and hot teas.'
}

const getCategoryDescription = (name: string) => {
  return categoryDescMap[name] || 'Explore our variety of custom-made food items.'
}

// Count items in each category
const getCategoryItemCount = (catName: string) => {
  const count = allItems.value.filter(item => item.category === catName).length
  return `${count} Items`
}

// Carousel slider left/right buttons
function scrollSlider(direction: 'left' | 'right') {
  if (sliderRef.value) {
    const scrollAmount = direction === 'left' ? -260 : 260
    sliderRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

// Scroll to the selected category section and set active
function selectCategory(catName: string) {
  if (searchQuery.value) {
    searchQuery.value = ''
  }
  activeCategory.value = catName
  
  setTimeout(() => {
    const el = document.getElementById(`category-${catName}`)
    if (el) {
      const navbarOffset = 90
      const elementPosition = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - navbarOffset,
        behavior: 'smooth'
      })
    }
  }, 50)
}

// Items grouped by category (for stacked view)
const groupedItems = computed(() => {
  const groups: Record<string, MenuItem[]> = {}
  categories.value.forEach(cat => {
    groups[cat.name] = allItems.value.filter(item => item.category === cat.name)
  })
  return groups
})

// Search results (used only when search query is entered)
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  return allItems.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
  )
})

onMounted(loadMenu)
</script>

<template>
  <div class="products-page">

    <!-- Page Header (Centered) -->
    <div class="products-page__header">
      <div class="container">
        <span class="products-page__category-count">{{ categories.length }} Categories</span>
        <h1 class="products-page__title">Our Food Items</h1>
        
        <!-- Premium Centered Search Bar -->
        <div class="products-page__search-wrap">
          <span class="products-page__search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            v-model="searchQuery"
            class="products-page__search"
            type="text"
            placeholder="Search items"
          />
        </div>
      </div>
    </div>

    <!-- Category Slider Plane — full-width white band -->
    <div v-if="!isLoading && !searchQuery && categories.length > 0" class="products-page__carousel-plane">
      <div class="products-page__carousel-inner">
        <button class="slider-arrow" @click="scrollSlider('left')" aria-label="Scroll left">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="arrow-svg">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="products-page__slider" ref="sliderRef">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="products-page__category-item"
            :class="{ 'products-page__category-item--active': activeCategory === cat.name }"
            @click="selectCategory(cat.name)"
          >
            <div class="products-page__category-circle">
              <img :src="getCategoryImage(cat.name)" :alt="cat.name" class="category-img" />
            </div>
            <span class="products-page__category-name">{{ cat.name }}</span>
            <span class="products-page__category-count-sub">{{ getCategoryItemCount(cat.name) }}</span>
            <div class="products-page__category-underline"></div>
          </div>
        </div>

        <button class="slider-arrow" @click="scrollSlider('right')" aria-label="Scroll right">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="arrow-svg">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="container">

      <!-- Loading skeletons -->
      <div v-if="isLoading" class="products-page__loading-sections">
        <div v-for="s in 2" :key="s" class="skeleton-section">
          <div class="skeleton-title"></div>
          <div class="skeleton-subtitle"></div>
          <div class="products-page__grid">
            <div v-for="n in 4" :key="n" class="skeleton-card"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="products-page__error">{{ error }}</div>

      <!-- Search Results Mode -->
      <div v-else-if="searchQuery" class="products-page__results-section">
        <h2 class="products-page__section-title">Search Results for "{{ searchQuery }}"</h2>
        <p class="products-page__section-desc">Found {{ searchResults.length }} items matching your criteria.</p>
        
        <div v-if="searchResults.length === 0" class="products-page__empty">
          <span>🍽️</span>
          <p>No food items match your search. Try another word.</p>
        </div>
        
        <div v-else class="products-page__grid">
          <ProductCard
            v-for="item in searchResults"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>

      <!-- Standard Menu Mode (Grouped Categories Stacked) -->
      <div v-else class="products-page__menu-sections">
        <div
          v-for="cat in categories"
          :key="cat.id"
          :id="`category-${cat.name}`"
          class="products-page__section"
        >
          <div class="products-page__section-header">
            <h2 class="products-page__section-title">{{ cat.name }}</h2>
            <p class="products-page__section-desc">{{ getCategoryDescription(cat.name) }}</p>
          </div>

          <div v-if="groupedItems[cat.name]?.length === 0" class="products-page__empty-cat">
            <img src="@/assets/EmptyItemsIcon.png" alt="No items" class="products-page__empty-icon" />
            <span class="products-page__empty-text">No items available in this category.</span>
          </div>

          <div v-else class="products-page__grid">
            <ProductCard
              v-for="item in groupedItems[cat.name]"
              :key="item.id"
              :item="item"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.products-page {
  padding-bottom: $space-16;
  background: #ffffff;

  &__header {
    background: #ffffff;
    padding: $space-10 0 $space-6;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  &__category-count {
    font-family: $font-heading;
    font-size: $text-sm;
    font-weight: 700;
    color: #f97316;
    letter-spacing: 0.5px;
    display: inline-block;
    margin-bottom: $space-2;
  }

  &__title {
    font-family: $font-heading;
    font-size: 2.25rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0 0 $space-6;
  }

  // Search box styling
  &__search-wrap {
    position: relative;
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  &__search-icon {
    position: absolute;
    left: $space-4;
    color: #9ca3af;
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  &__search {
    color: #313131;
    width: 100%;
    padding: 0.95rem $space-5 0.95rem 2.75rem;
    border: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: $radius-full;
    font-family: $font-body;
    font-size: 1.0rem;
    outline: none;
    transition: $transition-base;
    background: #fafafa;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
    font-weight: 600;

    &:focus {
      border-color: #f97316;
      background: #ffffff;
      box-shadow: 0 4px 15px rgba(#f97316, 0.08);
    }
  }

  // =============================================
  // CATEGORY CAROUSEL PLANE
  // Full-width white band, arrows at edges
  // =============================================

  &__carousel-plane {
    width: 100%;
    background: #ffffff;
    border-top: 1px solid #f3f4f6;
    border-bottom: 1px solid #f3f4f6;
  }

  &__carousel-inner {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: $space-6 $space-4;
    gap: $space-3;
  }

  &__slider {
    display: flex;
    gap: $space-8;
    overflow-x: auto;
    scroll-behavior: smooth;
    flex: 1;
    padding: $space-2 $space-1;

    // Hide scrollbar
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  // Arrow buttons — minimal circle style
  .slider-arrow {
    @include btn-reset;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    min-width: 34px;
    border-radius: 50%;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    color: #6b7280;
    cursor: pointer;
    transition: $transition-fast;

    &:hover {
      background: #f97316;
      border-color: #f97316;
      color: #ffffff;
    }

    .arrow-svg {
      width: 14px;
      height: 14px;
    }
  }

  // Individual category circle items
  &__category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    text-align: center;
    flex-shrink: 0;
    width: 100px;
    gap: 4px;
    transition: $transition-fast;
  }

  &__category-circle {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 2.5px solid #e5e7eb;        // gray ring — inactive
    background: #f3f4f6;                // light gray fill — inactive
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    margin-bottom: 8px;
  }

  .category-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__category-name {
    font-family: $font-heading;
    font-size: 1.05rem;
    font-weight: 700;
    color: #111827; // black for inactive
    transition: color 0.2s ease;
    line-height: 1.2;
    margin-top: 8px;
  }

  &__category-count-sub {
    font-family: $font-body;
    font-size: 0.9rem;
    color: #9ca3af; // gray for inactive
    transition: color 0.2s ease;
    margin-top: 5px;
    font-weight: 700;
  }

  // Orange underline bar below inactive (hidden)
  &__category-underline {
    height: 2.5px;
    width: 40px;
    background: transparent;
    border-radius: $radius-full;
    margin-top: 4px;
    transition: background 0.2s ease;
  }

  // ---- Active State ----
  &__category-item--active {
    .products-page__category-circle {
      border-color: #f97316;                      // orange ring
      box-shadow: 0 0 0 3px rgba(#f97316, 0.15); // soft glow
    }

    .products-page__category-name {
      color: #f97316; // orange text
    }

    .products-page__category-count-sub {
      color: #f97316; // orange count
    }

    .products-page__category-underline {
      background: #f97316; // orange bar
    }
  }

  // Section styling for category groupings
  &__section {
    padding-top: $space-8;
    margin-bottom: $space-10;
  }

  &__section-header {
    margin-bottom: $space-5;
  }

  &__section-title {
    font-family: $font-heading;
    font-size: 1.9rem;
    font-weight: 800;
    color: #111827;
    margin: 0 0 10px;
  }

  &__section-desc {
    font-family: $font-body;
    font-size: 1.2rem;
    font-weight: 700;
    color: #6d6d6d;
    margin: 0;
    margin-top: 16px;
  }

  // Products grid (4 columns layout matching reference)
  &__grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    column-gap: $space-6;
    row-gap: $space-8;

    @include sm { grid-template-columns: repeat(2, 1fr); }
    @include lg { grid-template-columns: repeat(3, 1fr); }
    @include xl { grid-template-columns: repeat(4, 1fr); }
  }

  &__empty,
  &__empty-cat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: $space-12;
    color: #6b7280;
    background: #ffffff;
    border-radius: $radius-lg;
    // border: 1px solid rgba(0, 0, 0, 0.03);
  }

  &__empty-icon {
    width: 180px;
    height: auto;
    opacity: 0.35;
  }

  &__empty span {
    font-size: 2.5rem;
    display: block;
    margin-bottom: $space-3;
  }

  &__empty-text {
    font-family: $font-heading;
    font-size: 1.0rem;
    font-weight: 600;
    color: #5f5f5f;
    opacity: 0.5;
  }

  &__error {
    text-align: center;
    padding: $space-16;
    color: $color-danger;
    font-weight: 600;
  }

  // Skeleton shimmer loaders
  &__loading-sections {
    display: flex;
    flex-direction: column;
    gap: $space-12;
    padding-top: $space-8;
  }

  .skeleton-section {
    display: flex;
    flex-direction: column;
  }

  .skeleton-title {
    width: 150px;
    height: 30px;
    background: #edf0f3;
    border-radius: $radius-sm;
    margin-bottom: $space-2;
  }

  .skeleton-subtitle {
    width: 320px;
    height: 16px;
    background: #edf0f3;
    border-radius: $radius-sm;
    margin-bottom: $space-6;
  }

  .skeleton-card {
    height: 350px;
    border-radius: $radius-lg;
    background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
