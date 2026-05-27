import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuItem } from '@/services/menuService'

// --- Cart Item Type ---
export interface CartItem extends MenuItem {
  cartQty: number   // quantity in cart (separate from stock quantity)
}

// --- Cart Store ---
// Manages all cart state: what's in it, totals, add/remove logic

export const useCartStore = defineStore('cart', () => {

  // The list of items currently in the cart
  const items = ref<CartItem[]>([])

  // --- Computed ---

  // Total number of individual items (sum of all quantities)
  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.cartQty, 0)
  )

  // Grand total price
  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.cartQty, 0)
  )

  // --- Actions ---

  // Add item to cart. If already present, increase qty.
  function addItem(product: MenuItem) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.cartQty += 1
    } else {
      items.value.push({ ...product, cartQty: 1 })
    }
  }

  // Decrease qty by 1. If qty reaches 0, remove the item.
  function decreaseItem(productId: number) {
    const item = items.value.find(i => i.id === productId)
    if (!item) return

    if (item.cartQty > 1) {
      item.cartQty -= 1
    } else {
      removeItem(productId)
    }
  }

  // Remove item completely from cart
  function removeItem(productId: number) {
    items.value = items.value.filter(i => i.id !== productId)
  }

  // Clear all items (called after successful order placement)
  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    decreaseItem,
    removeItem,
    clearCart
  }
})
