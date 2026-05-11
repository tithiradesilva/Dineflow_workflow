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
            // You can add more children here later like:
            // { path: 'orders', component: () => import('../pages/Orders.vue') }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router