import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '../layouts/AdminLayout.vue'
import Dashboard from '../pages/Dashboard.vue'
import Login from '../pages/Login.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        component: AdminLayout, // The Layout is the parent
        children: [
            {
                path: '', // Empty string means it loads at the parent's path ('/')
                name: 'Dashboard',
                component: Dashboard
            },
            {
                path: 'menu-crud',
                name: 'MenuManager',
                component: () => import('../pages/MenuManager.vue')
            },
            {
                path: 'orders',
                name: 'Orders',
                component: () => import('../pages/Orders.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/authService'

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Auto-restore session from Supabase on page load/refresh
  if (!authStore.user) {
    try {
      const currentUser = await authService.getCurrentUser()
      if (currentUser) {
        authStore.user = currentUser
        authStore.isAuthenticated = true
      }
    } catch (e) {
      console.error('Session recovery failed:', e)
    }
  }

  const requireAuth = to.path !== '/login'

  if (requireAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router