import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'

// All public customer-facing routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DefaultLayout,   // layout wraps all pages (navbar + footer)
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/HomePage.vue')
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/pages/ProductsPage.vue')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/pages/CartPage.vue')
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/pages/CheckoutPage.vue')
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/pages/ContactUs.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll to top on every route change
  scrollBehavior: () => ({ top: 0 })
})

export default router
