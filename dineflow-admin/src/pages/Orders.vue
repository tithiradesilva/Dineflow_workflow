<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Block -->
    <div>
      <h1 class="text-2xl font-heading !font-bold text-secondary tracking-tight" style="font-weight: 700 !important;">Orders History</h1>
      <p class="text-[#494949] font-semibold">View and track historical and active customer orders.</p>
    </div>

    <!-- Quick statistics grid -->
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
        </a-card>
      </a-col>
    </a-row>

    <!-- Main Container -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      
      <!-- Control Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <!-- Search Input -->
        <div class="w-full sm:max-w-xs">
          <a-input 
            v-model:value="searchQuery" 
            placeholder="Search by Table or ID..." 
            size="large"
            class="rounded-xl border-slate-200"
          >
            <template #prefix>
              <SearchOutlined class="text-slate-400 mr-1" />
            </template>
          </a-input>
        </div>

        <!-- Status Filter Tabs -->
        <div class="bg-slate-50 p-1 rounded-xl border border-slate-100 flex self-start sm:self-center">
          <button 
            v-for="tab in ['All', 'Preparing', 'Ready', 'Delivered']" 
            :key="tab"
            @click="activeStatusFilter = tab"
            class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all focus:outline-none cursor-pointer border-none"
            :class="activeStatusFilter === tab ? 'bg-white !text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Orders Table -->
      <a-table 
        :columns="columns" 
        :data-source="filteredOrders" 
        :loading="isLoading"
        :pagination="{ 
          pageSize: 10, 
          showSizeChanger: true, 
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total: number) => `Total ${total} orders`
        }"
        class="font-sans"
      >
        <template #bodyCell="{ column, record }">
          
          <!-- ID Column -->
          <template v-if="column.dataIndex === 'id'">
            <span class="font-bold text-secondary font-mono">{{ record.id }}</span>
          </template>

          <!-- Table -->
          <template v-else-if="column.dataIndex === 'table'">
            <span class="font-semibold text-slate-600">
              <span class="mr-1 text-slate-400">🪑</span> {{ record.table }}
            </span>
          </template>

          <!-- Created At / Date -->
          <template v-else-if="column.dataIndex === 'created_at'">
            <span class="text-slate-500 font-medium">{{ formatDate(record.created_at) }}</span>
          </template>

          <!-- Status badge -->
          <template v-else-if="column.dataIndex === 'status'">
            <span 
              class="px-3 py-1 rounded-full text-xs font-bold border"
              :class="{
                'bg-yellow-50 text-yellow-700 border-yellow-100': record.status === 'Preparing',
                'bg-blue-50 text-blue-700 border-blue-100': record.status === 'Ready',
                'bg-green-50 text-green-700 border-green-100': record.status === 'Delivered'
              }"
            >
              {{ record.status }}
            </span>
          </template>
          
          <!-- Total -->
          <template v-else-if="column.dataIndex === 'total'">
            <span class="font-bold text-slate-700">${{ record.total.toFixed(2) }}</span>
          </template>

          <!-- Actions Column -->
          <template v-else-if="column.key === 'actions'">
            <div class="flex items-center space-x-3">
              <!-- View details -->
              <a-button 
                size="small"
                type="default"
                class="border-slate-200 hover:border-primary hover:text-primary rounded-lg text-xs font-bold h-8 px-3"
                @click="viewOrderDetails(record)"
              >
                🔍 Details
              </a-button>

              <!-- Quick Advance Status Actions -->
              <a-button 
                v-if="record.status === 'Preparing'"
                size="small"
                type="primary"
                class="bg-primary hover:bg-primary-dark border-none rounded-lg text-xs font-bold h-8 px-3 text-white"
                @click="advanceStatus(record.key, 'Ready')"
              >
                🍳 Mark Ready
              </a-button>
              <a-button 
                v-else-if="record.status === 'Ready'"
                size="small"
                type="primary"
                class="bg-emerald-500 hover:bg-emerald-600 border-none rounded-lg text-xs font-bold h-8 px-3 text-white"
                @click="advanceStatus(record.key, 'Delivered')"
              >
                🚀 Deliver
              </a-button>
            </div>
          </template>

        </template>
      </a-table>

    </div>

    <!-- --- POPUP: ORDER DETAILS DRAWER / MODAL --- -->
    <a-modal 
      v-model:open="isDetailsModalVisible" 
      title="Order Detail Summary" 
      centered
      :width="600"
      :footer="null"
    >
      <div v-if="selectedOrder" class="mt-5 space-y-6">
        <!-- Order Header info -->
        <div class="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div>
            <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Order ID</span>
            <span class="text-lg font-bold text-secondary font-mono block">{{ selectedOrder.id }}</span>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Table</span>
            <span class="text-base font-bold text-secondary block">🪑 {{ selectedOrder.table }}</span>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Status</span>
            <span 
              class="px-2.5 py-0.5 rounded-full text-xs font-bold inline-block border mt-1"
              :class="{
                'bg-yellow-50 text-yellow-700 border-yellow-100': selectedOrder.status === 'Preparing',
                'bg-blue-50 text-blue-700 border-blue-100': selectedOrder.status === 'Ready',
                'bg-green-50 text-green-700 border-green-100': selectedOrder.status === 'Delivered'
              }"
            >
              {{ selectedOrder.status }}
            </span>
          </div>
        </div>

        <!-- Ordered Items list -->
        <div class="space-y-3">
          <span class="text-sm font-bold text-slate-700 block">Ordered Items</span>
          
          <div v-if="isDetailsLoading" class="py-8 flex justify-center">
            <a-spin size="large" />
          </div>

          <div v-else class="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto bg-white">
            <div v-for="item in selectedOrderItems" :key="item.id" class="flex items-center justify-between p-3.5 hover:bg-slate-50/50 transition-colors">
              <div class="flex items-center gap-3">
                <img :src="item.image" alt="Food Image" class="w-12 h-12 rounded-lg object-cover border border-slate-100" />
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 text-sm leading-snug">{{ item.name }}</span>
                  <span class="text-xs text-slate-400 mt-0.5">${{ item.price.toFixed(2) }} each</span>
                </div>
              </div>
              <div class="text-right">
                <span class="font-bold text-slate-700 text-sm block">x{{ item.quantity }}</span>
                <span class="text-xs font-semibold text-slate-400">${{ item.subtotal.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Grand Total block -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <span class="text-base font-bold text-slate-600">Grand Total</span>
          <span class="text-2xl font-extrabold text-primary">${{ selectedOrder.total.toFixed(2) }}</span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { 
  SearchOutlined,
  ShoppingOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  HourglassOutlined
} from '@ant-design/icons-vue'
import { orderService } from '../services/orderService'

const orders = ref<any[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const activeStatusFilter = ref('All')

// Modal/Drawer details
const isDetailsModalVisible = ref(false)
const selectedOrder = ref<any>(null)
const selectedOrderItems = ref<any[]>([])
const isDetailsLoading = ref(false)

const columns = [
  { title: 'Order ID', dataIndex: 'id', key: 'id', width: '12%' },
  { title: 'Table', dataIndex: 'table', key: 'table', width: '15%' },
  { title: 'Date & Time', dataIndex: 'created_at', key: 'created_at', width: '20%' },
  { title: 'Items Summary', dataIndex: 'items', key: 'items', width: '28%' },
  { title: 'Total', dataIndex: 'total', key: 'total', width: '12%' },
  { title: 'Status', dataIndex: 'status', key: 'status', width: '10%' },
  { title: 'Actions', key: 'actions', align: 'right' as const }
]

// Fetch orders history
const fetchOrders = async () => {
  isLoading.value = true
  try {
    orders.value = await orderService.getLiveOrders()
  } catch (error: any) {
    message.error('Failed to load orders: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

// Stats computations
const statistics = computed(() => {
  const total = orders.value.length
  const delivered = orders.value.filter(o => o.status === 'Delivered').length
  const pending = orders.value.filter(o => o.status === 'Preparing' || o.status === 'Ready').length
  const sales = orders.value.reduce((acc, o) => acc + o.total, 0)

  return [
    { title: 'Total Sales', value: `$${sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarOutlined, iconColor: 'text-green-500' },
    { title: 'Total Orders', value: total.toString(), icon: ShoppingOutlined, iconColor: 'text-blue-500' },
    { title: 'Active Queue', value: pending.toString(), icon: HourglassOutlined, iconColor: 'text-amber-500' },
    { title: 'Delivered', value: delivered.toString(), icon: CheckCircleOutlined, iconColor: 'text-emerald-500' }
  ]
})

// Filter and search
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const matchesSearch = 
      order.table.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = 
      activeStatusFilter.value === 'All' || 
      order.status === activeStatusFilter.value

    return matchesSearch && matchesStatus
  })
})

const formatDate = (isoString: string) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewOrderDetails = async (order: any) => {
  selectedOrder.value = order
  isDetailsModalVisible.value = true
  isDetailsLoading.value = true
  
  try {
    selectedOrderItems.value = await orderService.getOrderDetails(Number(order.key))
  } catch (error: any) {
    message.error('Failed to load order details: ' + error.message)
  } finally {
    isDetailsLoading.value = false
  }
}

const advanceStatus = async (key: string, nextStatus: 'Ready' | 'Delivered') => {
  const orderId = Number(key)
  const targetOrder = orders.value.find(order => order.key === key)
  if (!targetOrder) return

  try {
    await orderService.updateOrderStatus(orderId, nextStatus)
    targetOrder.status = nextStatus
    
    if (nextStatus === 'Ready') {
      message.success(`Order ${targetOrder.id} marked as Ready!`)
    } else if (nextStatus === 'Delivered') {
      message.success(`Order ${targetOrder.id} marked as Delivered!`)
    }
  } catch (error: any) {
    message.error('Failed to advance status: ' + error.message)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
  border-bottom: 1px solid #f1f5f9;
}

.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
