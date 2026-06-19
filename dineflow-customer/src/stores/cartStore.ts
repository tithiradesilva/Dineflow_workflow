import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuItem } from '@/services/menuService'

export interface CartItem extends MenuItem {
  cartQty: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.cartQty, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.cartQty, 0)
  )

  function addItem(product: MenuItem) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.cartQty += 1
    } else {
      items.value.push({ ...product, cartQty: 1 })
    }
  }

  function decreaseItem(productId: number) {
    const item = items.value.find(i => i.id === productId)
    if (!item) return

    if (item.cartQty > 1) {
      item.cartQty -= 1
    } else {
      removeItem(productId)
    }
  }

  function removeItem(productId: number) {
    items.value = items.value.filter(i => i.id !== productId)
  }

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
