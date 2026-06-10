<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TagOutlined,
  LogoutOutlined,
  MenuOutlined,
  BellOutlined,
  DownOutlined,
  RightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const collapsed = ref(false)
const mobileMenuVisible = ref(false)

// Select key mapping to active path
const selectedKeys = ref([route.path])

// Retrieve current logged in user details cleanly
const userEmail = computed(() => authStore.user?.email || 'admin@dineflow.com')
const userInitials = computed(() => {
  const email = userEmail.value
  return email.charAt(0).toUpperCase()
})

const navigateTo = (path: string) => {
  router.push(path)
  mobileMenuVisible.value = false // close mobile drawer if navigating
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Map the path to a readable page title
const pageTitle = computed(() => {
  switch (route.path) {
    case '/': return 'Dashboard'
    case '/orders': return 'Orders Manager'
    case '/menu-crud': return 'Menu Management'
    case '/coupons': return 'Coupon Manager'
    default: return 'Overview'
  }
})
</script>

<template>
  <a-layout class="min-h-screen bg-slate-50 font-sans">
    
    <!-- 1. DESKTOP SIDEBAR (Premium Dark Theme Sidebar) -->
    <a-layout-sider 
      v-model:collapsed="collapsed" 
      :trigger="null"
      collapsible 
      theme="dark" 
      class="hidden md:block z-20 bg-[#1a1a1a] shadow-2xl relative"
      width="260"
      collapsed-width="80"
    >
      <div class="flex flex-col h-screen sticky top-0 justify-between">
        <div>
          <!-- Brand Logo & Header (No bottom divider lines!) -->
          <div class="h-16 flex items-center px-6 bg-transparent select-none">
            <div class="flex items-center space-x-2.5 overflow-hidden">
              <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shrink-0 text-base shadow-lg shadow-orange-500/20">
                🍳
              </div>
              <span v-if="!collapsed" class="text-lg font-heading font-extrabold text-white truncate tracking-tight">
                DineFlow
              </span>
            </div>
          </div>
          
          <!-- Dark Side Menu Navigation (No line dividers near tabs!) -->
          <a-menu 
            v-model:selectedKeys="selectedKeys" 
            mode="inline" 
            theme="dark"
            class="border-none mt-4 px-2 bg-transparent"
          >
            <a-menu-item key="/" @click="navigateTo('/')" class="rounded-xl my-1 group">
              <template #icon><DashboardOutlined /></template>
              <div class="flex items-center justify-between w-full pr-1">
                <span class="font-semibold text-sm">Dashboard</span>
                <RightOutlined v-if="selectedKeys.includes('/') && !collapsed" class="text-[10px] text-orange-500 shrink-0 font-bold animate-fade-in" />
              </div>
            </a-menu-item>
            <a-menu-item key="/orders" @click="navigateTo('/orders')" class="rounded-xl my-1 group">
              <template #icon><ShoppingOutlined /></template>
              <div class="flex items-center justify-between w-full pr-1">
                <span class="font-semibold text-sm">Orders</span>
                <RightOutlined v-if="selectedKeys.includes('/orders') && !collapsed" class="text-[10px] text-orange-500 shrink-0 font-bold animate-fade-in" />
              </div>
            </a-menu-item>
            <a-menu-item key="/menu-crud" @click="navigateTo('/menu-crud')" class="rounded-xl my-1 group">
              <template #icon><AppstoreOutlined /></template>
              <div class="flex items-center justify-between w-full pr-1">
                <span class="font-semibold text-sm">Menu Manager</span>
                <RightOutlined v-if="selectedKeys.includes('/menu-crud') && !collapsed" class="text-[10px] text-orange-500 shrink-0 font-bold animate-fade-in" />
              </div>
            </a-menu-item>
            <a-menu-item key="/coupons" @click="navigateTo('/coupons')" class="rounded-xl my-1 group">
              <template #icon><TagOutlined /></template>
              <div class="flex items-center justify-between w-full pr-1">
                <span class="font-semibold text-sm">Coupons</span>
                <RightOutlined v-if="selectedKeys.includes('/coupons') && !collapsed" class="text-[10px] text-orange-500 shrink-0 font-bold animate-fade-in" />
              </div>
            </a-menu-item>
          </a-menu>
        </div>

        <!-- Custom Sidebar Bottom Expander (Merged with sidebar, transparent bg, white text, hover light bg) -->
        <div class="px-4 py-4 select-none">
          <button 
            @click="collapsed = !collapsed"
            class="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-transparent hover:bg-white/10 !text-white transition-all text-xs font-bold cursor-pointer border-none"
          >
            <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" class="text-sm shrink-0 !text-white" />
            <span v-if="!collapsed" class="truncate !text-white">Collapse Menu</span>
            <span v-else class="truncate text-[10px] tracking-wider uppercase !text-white">Expand</span>
          </button>
        </div>
      </div>
    </a-layout-sider>

    <!-- 2. MOBILE SIDEBAR DRAWER (Visible on mobile/tablet) -->
    <a-drawer
      v-model:open="mobileMenuVisible"
      placement="left"
      :closable="true"
      :headerStyle="{ borderBottom: 'none', background: '#1a1a1a' }"
      :bodyStyle="{ padding: '16px 8px', background: '#1a1a1a' }"
      width="280"
    >
      <template #title>
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-base shadow-md">
            🍳
          </div>
          <span class="text-lg font-heading font-extrabold text-white">
            DineFlow
          </span>
        </div>
      </template>

      <!-- Side Navigation inside mobile drawer (Matching dark style) -->
      <a-menu 
        v-model:selectedKeys="selectedKeys" 
        mode="inline" 
        theme="dark"
        class="border-none bg-transparent"
      >
        <a-menu-item key="/" @click="navigateTo('/')" class="rounded-xl my-1">
          <template #icon><DashboardOutlined /></template>
          <div class="flex items-center justify-between w-full">
            <span class="font-semibold text-sm">Dashboard</span>
            <RightOutlined v-if="selectedKeys.includes('/')" class="text-[10px] text-orange-500" />
          </div>
        </a-menu-item>
        <a-menu-item key="/orders" @click="navigateTo('/orders')" class="rounded-xl my-1">
          <template #icon><ShoppingOutlined /></template>
          <div class="flex items-center justify-between w-full">
            <span class="font-semibold text-sm">Orders</span>
            <RightOutlined v-if="selectedKeys.includes('/orders')" class="text-[10px] text-orange-500" />
          </div>
        </a-menu-item>
        <a-menu-item key="/menu-crud" @click="navigateTo('/menu-crud')" class="rounded-xl my-1">
          <template #icon><AppstoreOutlined /></template>
          <div class="flex items-center justify-between w-full">
            <span class="font-semibold text-sm">Menu Manager</span>
            <RightOutlined v-if="selectedKeys.includes('/menu-crud')" class="text-[10px] text-orange-500" />
          </div>
        </a-menu-item>
        <a-menu-item key="/coupons" @click="navigateTo('/coupons')" class="rounded-xl my-1">
          <template #icon><TagOutlined /></template>
          <div class="flex items-center justify-between w-full">
            <span class="font-semibold text-sm">Coupons</span>
            <RightOutlined v-if="selectedKeys.includes('/coupons')" class="text-[10px] text-orange-500" />
          </div>
        </a-menu-item>
      </a-menu>
    </a-drawer>

    <!-- MAIN RIGHT SECTION -->
    <a-layout class="flex flex-col min-h-screen">
      
      <!-- TOP HEADER (Fully Responsive) -->
      <a-layout-header class="bg-white px-4 md:px-6 flex items-center justify-between border-b border-slate-100 h-16 shrink-0 z-10 shadow-sm">
        
        <!-- Mobile Left Area (Hamburger) & Desktop Left Area (Title) -->
        <div class="flex items-center space-x-4">
          <!-- Mobile Menu Trigger -->
          <button 
            @click="mobileMenuVisible = true" 
            class="block md:hidden p-1.5 hover:bg-slate-100 rounded-lg text-secondary transition-colors cursor-pointer"
          >
            <MenuOutlined class="text-xl" />
          </button>
          
          <!-- Route Title Display -->
          <div class="hidden sm:block">
            <h1 class="text-lg font-heading !font-bold text-secondary tracking-tight m-0" style="font-weight: 700 !important;">
              {{ pageTitle }}
            </h1>
          </div>
          
          <!-- Mobile Brand Title Logo (Centered in header on small mobile layout) -->
          <div class="block sm:hidden flex items-center space-x-1.5 select-none">
            <span class="text-lg">🍳</span>
            <span class="text-base font-heading font-black text-secondary tracking-tight">DineFlow</span>
          </div>
        </div>

        <!-- Right Header Area (Utilities & Profile) -->
        <div class="flex items-center space-x-4 select-none">
          <!-- Live Engine / DB Status Badge -->
          <div class="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">Engine Live</span>
          </div>

          <!-- Notification Bell Trigger (Visual decoration) -->
          <button class="relative p-2 text-slate-400 hover:text-secondary hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
            <BellOutlined class="text-lg" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
          </button>

          <div class="h-6 w-[1px] bg-slate-100 hidden sm:block"></div>

          <!-- User Profile Dropdown Widget -->
          <a-dropdown :trigger="['click']" placement="bottomRight">
            <div class="flex items-center space-x-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-xl transition-all">
              <!-- Avatar Circle -->
              <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-secondary to-[#2c476f] text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase">
                {{ userInitials }}
              </div>
              <div class="hidden sm:flex flex-col text-left leading-tight">
                <span class="text-xs font-semibold text-secondary truncate max-w-[120px] leading-tight m-0">{{ userEmail.split('@')[0] }}</span>
                <span class="text-[10px] text-slate-400 font-medium leading-none m-0 mt-0.5">Store Operator</span>
              </div>
              <DownOutlined class="text-[10px] text-slate-400 hidden sm:block shrink-0" />
            </div>
            
            <template #overlay>
              <a-menu class="shadow-xl rounded-xl border border-slate-50 min-w-[200px] p-2 mt-1">
                <!-- Dropdown Header Info -->
                <div class="px-3.5 py-2">
                  <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Signed In As</p>
                  <p class="text-xs font-bold text-secondary truncate mt-0.5">{{ userEmail }}</p>
                </div>
                <a-menu-divider class="my-1.5 border-slate-100" />
                
                <a-menu-item key="logout" @click="handleLogout" class="rounded-lg text-danger hover:bg-red-50 hover:text-danger my-1">
                  <div class="flex items-center space-x-2">
                    <LogoutOutlined class="text-sm" />
                    <span class="font-semibold text-xs">Logout Session</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- MAIN COMPONENT CONTAINER (Fully Responsive Spacing) -->
      <a-layout-content class="flex-1 p-4 md:p-6 overflow-y-auto">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
/* Force white background, proper heights and clean border lines on the layout header */
:deep(.ant-layout-header) {
  background: white !important;
  padding: 0 16px !important;
  height: 64px !important;
  line-height: normal !important;
  border-bottom: 1px solid #f1f5f9 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

/* Reset heading margins and normalize line-height for pixel-perfect vertical centering */
:deep(.ant-layout-header) h1 {
  margin: 0 !important;
  line-height: 1.5 !important;
}

@media (min-width: 768px) {
  :deep(.ant-layout-header) {
    padding: 0 24px !important;
  }
}

/* Ant Design Dark Sider & Menu overrides for premium contrast */
:deep(.ant-layout-sider) {
  background: #1a1a1a !important; /* Dark grey */
  border-right: none !important;
}

:deep(.ant-menu-dark) {
  background: transparent !important;
}

/* Menu item default unselected state */
:deep(.ant-menu-dark .ant-menu-item) {
  margin: 6px 12px !important;
  width: calc(100% - 24px) !important;
  height: 44px !important;
  line-height: 44px !important;
  color: #94a3b8 !important; /* Slate 400 */
  background-color: transparent !important;
  transition: all 0.2s ease-in-out;
}

/* Force correct width and margin when the sidebar is collapsed to prevent right-overflow */
:deep(.ant-layout-sider-collapsed .ant-menu-item) {
  margin: 6px 8px !important;
  width: calc(100% - 16px) !important;
}

/* Menu item hover state */
:deep(.ant-menu-dark .ant-menu-item:hover) {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Menu item selected state (Vibrant Orange with Glowing Accent & Right Chevron) */
:deep(.ant-menu-dark .ant-menu-item-selected) {
  background-color: rgba(249, 115, 22, 0.15) !important; /* Translucent orange backdrop */
  color: #f97316 !important; /* Vibrant Orange text */
  box-shadow: inset 2px 0px 12px rgba(249, 115, 22, 0.05);
}

/* Selected item icon color matching text */
:deep(.ant-menu-dark .ant-menu-item-selected .ant-menu-item-icon) {
  color: #f97316 !important;
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>