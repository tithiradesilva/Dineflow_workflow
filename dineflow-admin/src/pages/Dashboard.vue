<template>
  <div class="space-y-6">
    <!-- Top Header -->
    <div>
      <h1 class="!text-2xl font-heading !font-bold text-secondary tracking-tight" style="font-weight: 700 !important;">Good Morning</h1>
      <p class="text-[#494949] font-semibold">Welcome back, Admin. Here is what is happening at DineFlow.</p>
    </div>

    <!-- statistics cards grid -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :sm="12" :lg="6" v-for="stat in statistics" :key="stat.title">
        <a-card class="shadow-sm rounded-xl border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-500 text-sm font-medium mb-1">{{ stat.title }}</p>
              <h2 class="text-3xl font-bold text-secondary">{{ stat.value }}</h2>
            </div>
            <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-xl" :class="stat.iconColor">
              <component :is="stat.icon" />
            </div>
          </div>
          <div class="mt-4 text-xs font-medium" :class="stat.trendUp ? 'text-success' : 'text-slate-400'">
            <span v-if="stat.trendUp">↑ {{ stat.trend }}</span>
            <span v-else>{{ stat.trend }}</span>
            <span class="text-slate-400 ml-1">{{ stat.trendLabel }}</span>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- MAIN TWO COLUMN GRID FOR CONTENT -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- LEFT CONTAINER: Live Orders Controller -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 class="text-lg font-bold text-secondary">Live Orders</h2>
              <p class="text-xs text-slate-400 font-medium">Click on actions to advance dish status in real-time</p>
            </div>
            
            <!-- Category Filter Tabs -->
            <div class="bg-slate-50 p-1 rounded-xl border border-slate-100 flex self-start sm:self-center">
              <button 
                v-for="tab in ['All', 'Preparing', 'Ready', 'Delivered']" 
                :key="tab"
                @click="activeTab = tab"
                class="px-3 py-1.5 text-xs font-bold rounded-lg transition-all focus:outline-none cursor-pointer border-none"
                :class="activeTab === tab ? 'bg-white !text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
              >
                {{ tab }}
              </button>
            </div>
          </div>

          <a-table 
            :columns="columns" 
            :data-source="filteredOrders" 
            :pagination="false"
            :loading="isLoading"
            size="middle"
            class="font-sans"
          >
            <template #bodyCell="{ column, record }">
              <!-- ID Column -->
              <template v-if="column.dataIndex === 'id'">
                <span class="font-bold text-secondary font-mono">{{ record.id }}</span>
              </template>

              <!-- Table Column -->
              <template v-else-if="column.dataIndex === 'table'">
                <span class="font-semibold text-slate-600">
                  <span class="mr-1 text-slate-400">🪑</span> {{ record.table }}
                </span>
              </template>

              <!-- Items Column -->
              <template v-else-if="column.dataIndex === 'items'">
                <div class="flex flex-wrap gap-1 py-1 max-w-xs">
                  <template v-if="record.items && record.items !== 'No items'">
                    <span 
                      v-for="(item, idx) in record.items.split(', ').slice(0, 2)" 
                      :key="idx"
                      class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/60"
                    >
                      {{ item }}
                    </span>
                    <span 
                      v-if="record.items.split(', ').length > 2"
                      class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/50"
                    >
                      +{{ record.items.split(', ').length - 2 }} items
                    </span>
                  </template>
                  <span v-else class="text-slate-400 text-xs italic">No items</span>
                </div>
              </template>

              <!-- Status badge -->
              <template v-else-if="column.dataIndex === 'status'">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-bold"
                  :class="{
                    'bg-yellow-100 text-yellow-700': record.status === 'Preparing',
                    'bg-blue-100 text-blue-700': record.status === 'Ready',
                    'bg-green-100 text-green-700': record.status === 'Delivered'
                  }"
                >
                  {{ record.status }}
                </span>
              </template>
              
              <!-- Total -->
              <template v-else-if="column.dataIndex === 'total'">
                <span class="font-semibold">${{ record.total.toFixed(2) }}</span>
              </template>

              <!-- Actions Column -->
              <template v-else-if="column.key === 'action'">
                <div class="flex items-center gap-3">
                  <a-button 
                    v-if="record.status === 'Preparing'"
                    size="small"
                    type="primary"
                    class="bg-primary hover:bg-primary-dark border-none rounded-lg text-xs font-bold h-7 flex items-center justify-center gap-1"
                    @click="advanceStatus(record.key, 'Ready')"
                  >
                    <CheckOutlined />
                    <span>Ready</span>
                  </a-button>
                  <a-button 
                    v-else-if="record.status === 'Ready'"
                    size="small"
                    type="primary"
                    class="bg-emerald-500 hover:bg-emerald-600 border-none rounded-lg text-xs font-bold h-7 flex items-center justify-center gap-1"
                    @click="advanceStatus(record.key, 'Delivered')"
                  >
                    🚀 Deliver
                  </a-button>
                  <span v-else class="text-xs text-slate-400 font-semibold flex items-center">
                    <span class="text-emerald-500 mr-1">✓</span> Serviced
                  </span>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </div>

      <!-- RIGHT CONTAINER: Kitchen Load & Service Log activity -->
      <div class="space-y-6">
        
        <!-- Kitchen Health Metrics Card -->
        <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h2 class="text-base font-bold text-secondary mb-4 tracking-tight">Kitchen Capacity</h2>
          <div class="space-y-5">
            <!-- Loading Indicator -->
            <div>
              <div class="flex justify-between text-xs font-bold mb-1.5 text-slate-500">
                <span>Cooking Throughput</span>
                <span class="text-primary">{{ kitchenCapacity }}% load</span>
              </div>
              <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-primary to-[#f87171] transition-all duration-500" 
                  :style="{ width: kitchenCapacity + '%' }"
                ></div>
              </div>
            </div>

            <!-- Health Quick Grid Stats -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Prep Time</p>
                <p class="text-base font-bold text-secondary mt-0.5">{{ dbStats.avgPrepTime }}</p>
              </div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Efficiency</p>
                <p class="text-base font-bold text-secondary mt-0.5">{{ dbStats.efficiency }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Real-Time Activity Logs Terminal -->
        <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h2 class="text-base font-bold text-secondary tracking-tight">Service Log</h2>
            <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">Realtime</span>
          </div>
          
          <div class="space-y-4 max-h-[220px] overflow-y-auto pr-1">
            <div v-for="log in activityLogs" :key="log.time" class="flex items-start space-x-3 text-xs">
              <span class="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 p-1 rounded-md shrink-0 font-mono">
                {{ log.time }}
              </span>
              <div>
                <p class="text-slate-600 font-semibold leading-relaxed">{{ log.message }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { 
  DollarOutlined, 
  ShoppingOutlined, 
  UserOutlined, 
  FireOutlined,
  CheckOutlined
} from '@ant-design/icons-vue'
import { orderService } from '../services/orderService'

const mockOrders = ref<any[]>([])
const activeTab = ref('All')
const isLoading = ref(false)

const dbStats = ref({
  activeOrders: 0,
  revenue: 0,
  customersCount: 0,
  availableItemsCount: 0,
  avgPrepTime: '0.0 min',
  efficiency: '100.0%'
})

// Filtered array computed from the selected category tabs
const filteredOrders = computed(() => {
  if (activeTab.value === 'All') return mockOrders.value
  return mockOrders.value.filter(order => order.status === activeTab.value)
})

const activityLogs = ref<any[]>([])

const columns = [
  { title: 'Order ID', dataIndex: 'id', key: 'id', width: '15%' },
  { title: 'Table', dataIndex: 'table', key: 'table', width: '15%' },
  { title: 'Items', dataIndex: 'items', key: 'items', width: '35%' },
  { title: 'Total', dataIndex: 'total', key: 'total', width: '15%' },
  { title: 'Status', dataIndex: 'status', key: 'status', width: '10%' },
  { title: 'Quick Action', key: 'action', align: 'right' as const },
]

// Kitchen load capacity computed from orders list
const kitchenCapacity = computed(() => {
  const prepCount = mockOrders.value.filter(o => o.status === 'Preparing').length
  const totalCount = mockOrders.value.length
  if (totalCount === 0) return 0
  return Math.round((prepCount / totalCount) * 100)
})

// Dynamic stats computed reactively
const activeOrdersCount = computed(() => mockOrders.value.filter(o => o.status !== 'Delivered').length)
const dynamicRevenue = computed(() => dbStats.value.revenue)

const statistics = computed(() => [
  { title: 'Total Revenue', value: `$${dynamicRevenue.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarOutlined, iconColor: 'text-green-500', trend: 'Live', trendUp: true, trendLabel: 'revenue track' },
  { title: 'Active Orders', value: activeOrdersCount.value.toString(), icon: ShoppingOutlined, iconColor: 'text-blue-500', trend: activeOrdersCount.value.toString(), trendUp: true, trendLabel: 'in kitchen queue' },
  { title: 'Customers', value: dbStats.value.customersCount.toString(), icon: UserOutlined, iconColor: 'text-purple-500', trend: dbStats.value.customersCount.toString(), trendUp: false, trendLabel: 'active tables' },
  { title: 'Hot Items', value: dbStats.value.availableItemsCount.toString(), icon: FireOutlined, iconColor: 'text-primary', trend: dbStats.value.availableItemsCount.toString(), trendUp: true, trendLabel: 'active menu items' },
])

let realTimeSubscription: any = null

const fetchDashboardData = async (silent = false) => {
  if (!silent) isLoading.value = true
  try {
    const orders = await orderService.getLiveOrders()
    mockOrders.value = orders

    const stats = await orderService.getDashboardStats()
    dbStats.value = {
      activeOrders: stats.activeOrders,
      revenue: stats.revenue,
      customersCount: stats.customersCount,
      availableItemsCount: stats.availableItemsCount,
      avgPrepTime: stats.avgPrepTime,
      efficiency: stats.efficiency
    }
  } catch (error: any) {
    message.error('Failed to load dashboard data: ' + error.message)
  } finally {
    if (!silent) isLoading.value = false
  }
}

const advanceStatus = async (key: string, nextStatus: 'Ready' | 'Delivered') => {
  const orderId = Number(key)
  const targetOrder = mockOrders.value.find(order => order.key === key)
  if (!targetOrder) return

  try {
    await orderService.updateOrderStatus(orderId, nextStatus)
    targetOrder.status = nextStatus

    // Push new activity logs cleanly
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    let logMsg = ''
    if (nextStatus === 'Ready') {
      logMsg = `${targetOrder.id} (${targetOrder.table}) is ready for delivery.`
      message.success({ content: `Dish Completed: ${targetOrder.id} marked as Ready!`, duration: 2 })
    } else if (nextStatus === 'Delivered') {
      logMsg = `${targetOrder.id} has been delivered successfully.`
      message.success({ content: `Dispatched: ${targetOrder.id} has been delivered!`, duration: 2 })
    }
    
    activityLogs.value.unshift({ time: timeNow, message: logMsg })

    // Refresh stats silently
    const stats = await orderService.getDashboardStats()
    dbStats.value = {
      activeOrders: stats.activeOrders,
      revenue: stats.revenue,
      customersCount: stats.customersCount,
      availableItemsCount: stats.availableItemsCount,
      avgPrepTime: stats.avgPrepTime,
      efficiency: stats.efficiency
    }
  } catch (error: any) {
    message.error('Failed to update status: ' + error.message)
  }
}

onMounted(() => {
  fetchDashboardData()

  // Subscribe to real-time updates from database
  realTimeSubscription = orderService.subscribeToLiveOrders(() => {
    fetchDashboardData(true)
  })
})

onUnmounted(() => {
  if (realTimeSubscription) {
    realTimeSubscription.unsubscribe()
  }
})
</script>

<style scoped>
/* Ensure Ant Design table headers match our clean aesthetic */
:deep(.ant-table-thead .ant-table-cell) {
  background-color: #f8fafc; /* slate-50 */
  color: #64748b; /* slate-500 */
  font-weight: 600;
  border-bottom: 1px solid #f1f5f9;
  padding: 10px 12px !important;
}

:deep(.ant-table-tbody .ant-table-cell) {
  padding: 6px 12px !important;
}
</style>