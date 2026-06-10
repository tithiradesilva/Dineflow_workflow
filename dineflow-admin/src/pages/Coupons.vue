<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Block -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-heading !font-bold text-secondary tracking-tight" style="font-weight: 700 !important;">Coupon Manager</h1>
        <p class="text-[#494949] font-semibold">Create, edit, and manage promotional coupon codes.</p>
      </div>
      <a-button 
        type="primary" 
        size="large"
        class="bg-primary hover:bg-primary-dark border-none rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 h-12 px-5 transition-all text-white"
        @click="openModal()"
      >
        <PlusOutlined />
        <span>Add Coupon</span>
      </a-button>
    </div>

    <!-- Quick Statistics Grid -->
    <a-row :gutter="[24, 24]">
      <a-col :xs="24" :sm="12" :lg="8" v-for="stat in statistics" :key="stat.title">
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

    <!-- Main Table Container -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      
      <!-- Control Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="w-full sm:max-w-xs">
          <a-input 
            v-model:value="searchQuery" 
            placeholder="Search coupon codes..." 
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
            v-for="tab in ['All', 'Active', 'Inactive']" 
            :key="tab"
            @click="activeFilter = tab"
            class="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all focus:outline-none cursor-pointer border-none"
            :class="activeFilter === tab ? 'bg-white !text-orange-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <!-- Coupons Table -->
      <a-table 
        :columns="columns" 
        :data-source="filteredCoupons" 
        :loading="isLoading"
        :pagination="{ 
          pageSize: 10, 
          showSizeChanger: true, 
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total: number) => `Total ${total} coupons`
        }"
        class="font-sans"
      >
        <template #bodyCell="{ column, record }">
          
          <!-- Code Column -->
          <template v-if="column.dataIndex === 'code'">
            <span class="font-bold text-secondary font-mono text-sm bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
              {{ record.code }}
            </span>
          </template>

          <!-- Discount % Column -->
          <template v-else-if="column.dataIndex === 'discount_percent'">
            <span class="font-bold text-primary text-sm">{{ record.discount_percent }}% OFF</span>
          </template>

          <!-- Status Column -->
          <template v-else-if="column.dataIndex === 'is_active'">
            <a-switch 
              :checked="record.is_active" 
              @change="(checked: boolean) => handleToggleActive(record.id, checked)"
              checked-children="Active"
              un-checked-children="Off"
            />
          </template>

          <!-- Created At Column -->
          <template v-else-if="column.dataIndex === 'created_at'">
            <span class="text-slate-500 font-medium text-sm">{{ formatDate(record.created_at) }}</span>
          </template>

          <!-- Actions Column -->
          <template v-else-if="column.key === 'actions'">
            <div class="flex justify-end gap-2.5">
              <a-button 
                type="default" 
                class="bg-blue-50/80 border border-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 rounded-xl flex items-center justify-center h-10 w-10 p-0 transition-all shadow-sm flex-none animate-none" 
                @click="openModal(record)"
                title="Edit Coupon"
              >
                <template #icon><EditOutlined class="text-[15px]" /></template>
              </a-button>
              
              <a-popconfirm
                title="Are you sure you want to delete this coupon?"
                ok-text="Yes"
                cancel-text="No"
                placement="left"
                @confirm="handleDelete(record.id)"
              >
                <a-button 
                  type="default" 
                  class="bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:text-red-600 hover:border-red-500/30 rounded-xl flex items-center justify-center h-10 w-10 p-0 transition-all shadow-sm flex-none animate-none"
                  title="Delete Coupon"
                >
                  <template #icon><DeleteOutlined class="text-[15px]" /></template>
                </a-button>
              </a-popconfirm>
            </div>
          </template>

        </template>
      </a-table>
    </div>

    <!-- Add/Edit Coupon Modal -->
    <a-modal 
      v-model:open="isModalVisible" 
      :title="modalMode === 'add' ? 'Create New Coupon' : 'Edit Coupon'" 
      @ok="handleSave"
      :okText="modalMode === 'add' ? 'Create Coupon' : 'Save Changes'"
      cancelText="Cancel"
      centered
      :width="480"
      :confirmLoading="isSaving"
      :okButtonProps="{ class: 'bg-primary border-none rounded-xl font-bold h-11 px-6 shadow-sm hover:opacity-90 transition-opacity' }"
      :cancelButtonProps="{ class: 'rounded-xl font-medium h-11 px-5 border-slate-200 hover:border-slate-300' }"
    >
      <a-form layout="vertical" :model="formState" class="mt-5 space-y-4">
        <!-- Coupon Code -->
        <a-form-item label="Coupon Code" required class="mb-0">
          <a-input 
            v-model:value="formState.code" 
            placeholder="e.g., SUMMER20" 
            size="large"
            class="rounded-lg font-medium h-11 uppercase"
            @input="formState.code = formState.code.toUpperCase()"
          />
          <p class="text-[10px] text-slate-400 mt-1.5">Code will be auto-capitalized. Customers enter this at checkout.</p>
        </a-form-item>

        <!-- Discount Percentage -->
        <a-form-item label="Discount Percentage (%)" required class="mb-0">
          <div class="flex items-center gap-2 w-full">
            <a-button 
              type="default" 
              size="large"
              class="w-12 h-11 flex items-center justify-center border-slate-200 hover:border-primary hover:text-primary rounded-lg text-slate-500 font-bold text-lg transition-all flex-none animate-none"
              @click="decreaseDiscount"
            >
              <MinusOutlined />
            </a-button>
            <a-input-number 
              v-model:value="formState.discount_percent" 
              :min="1" 
              :max="100"
              :controls="false"
              size="large"
              class="flex-1 rounded-lg font-medium h-11 text-center" 
            />
            <a-button 
              type="default" 
              size="large"
              class="w-12 h-11 flex items-center justify-center border-slate-200 hover:border-primary hover:text-primary rounded-lg text-slate-500 font-bold text-lg transition-all flex-none animate-none"
              @click="increaseDiscount"
            >
              <PlusOutlined />
            </a-button>
          </div>
        </a-form-item>

        <!-- Active Status -->
        <a-form-item class="mb-0">
          <a-checkbox v-model:checked="formState.is_active" class="font-semibold text-slate-600">
            Coupon is currently active and can be used by customers
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
  TagOutlined,
  CheckCircleOutlined,
  PercentageOutlined
} from '@ant-design/icons-vue'
import { couponService } from '../services/couponService'
import type { Coupon } from '../services/couponService'

// --- TABLE CONFIG ---
const columns = [
  { title: 'Code', dataIndex: 'code', key: 'code', width: '25%' },
  { title: 'Discount', dataIndex: 'discount_percent', key: 'discount_percent', width: '20%' },
  { title: 'Status', dataIndex: 'is_active', key: 'is_active', width: '20%' },
  { title: 'Created', dataIndex: 'created_at', key: 'created_at', width: '20%' },
  { title: 'Actions', key: 'actions', align: 'right' as const }
]

// --- STATE ---
const coupons = ref<Coupon[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const searchQuery = ref('')
const activeFilter = ref('All')

// --- LOAD DATA ---
const loadCoupons = async () => {
  isLoading.value = true
  try {
    coupons.value = await couponService.getCoupons()
  } catch (error: any) {
    message.error('Failed to load coupons: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadCoupons()
})

// --- STATS ---
const statistics = computed(() => {
  const total = coupons.value.length
  const active = coupons.value.filter(c => c.is_active).length
  const avgDiscount = total > 0
    ? (coupons.value.reduce((acc, c) => acc + c.discount_percent, 0) / total).toFixed(0)
    : '0'

  return [
    { title: 'Total Coupons', value: total.toString(), icon: TagOutlined, iconColor: 'text-blue-500' },
    { title: 'Active Coupons', value: active.toString(), icon: CheckCircleOutlined, iconColor: 'text-emerald-500' },
    { title: 'Avg. Discount', value: `${avgDiscount}%`, icon: PercentageOutlined, iconColor: 'text-primary' }
  ]
})

// --- FILTER + SEARCH ---
const filteredCoupons = computed(() => {
  return coupons.value.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesFilter = 
      activeFilter.value === 'All' ||
      (activeFilter.value === 'Active' && coupon.is_active) ||
      (activeFilter.value === 'Inactive' && !coupon.is_active)
    return matchesSearch && matchesFilter
  })
})

// --- MODAL & FORM ---
const isModalVisible = ref(false)
const modalMode = ref<'add' | 'edit'>('add')

const formState = reactive({
  id: null as number | null,
  code: '',
  discount_percent: 10,
  is_active: true
})

const resetForm = () => {
  formState.id = null
  formState.code = ''
  formState.discount_percent = 10
  formState.is_active = true
}

const openModal = (record?: Coupon) => {
  resetForm()
  if (record) {
    modalMode.value = 'edit'
    formState.id = record.id
    formState.code = record.code
    formState.discount_percent = record.discount_percent
    formState.is_active = record.is_active
  } else {
    modalMode.value = 'add'
  }
  isModalVisible.value = true
}

const increaseDiscount = () => {
  if (formState.discount_percent < 100) formState.discount_percent += 5
}

const decreaseDiscount = () => {
  if (formState.discount_percent > 1) formState.discount_percent = Math.max(1, formState.discount_percent - 5)
}

const handleSave = async () => {
  if (!formState.code.trim()) {
    message.error('Please enter a coupon code.')
    return
  }
  if (formState.discount_percent <= 0 || formState.discount_percent > 100) {
    message.error('Discount must be between 1% and 100%.')
    return
  }

  isSaving.value = true
  try {
    if (modalMode.value === 'add') {
      const newCoupon = await couponService.createCoupon(formState.code, formState.discount_percent)
      coupons.value.unshift(newCoupon)
      message.success(`Coupon "${newCoupon.code}" created!`)
    } else if (formState.id !== null) {
      const updated = await couponService.updateCoupon(formState.id, {
        code: formState.code,
        discount_percent: formState.discount_percent,
        is_active: formState.is_active
      })
      const index = coupons.value.findIndex(c => c.id === formState.id)
      if (index !== -1) coupons.value[index] = updated
      message.success('Coupon updated!')
    }
    isModalVisible.value = false
  } catch (error: any) {
    message.error('Failed to save coupon: ' + error.message)
  } finally {
    isSaving.value = false
  }
}

// --- TOGGLE ACTIVE ---
const handleToggleActive = async (id: number, checked: boolean) => {
  try {
    await couponService.toggleActive(id, checked)
    const coupon = coupons.value.find(c => c.id === id)
    if (coupon) coupon.is_active = checked
    message.success(`Coupon ${checked ? 'activated' : 'deactivated'}.`)
  } catch (error: any) {
    message.error('Failed to update status: ' + error.message)
  }
}

// --- DELETE ---
const handleDelete = async (id: number) => {
  try {
    await couponService.deleteCoupon(id)
    coupons.value = coupons.value.filter(c => c.id !== id)
    message.success('Coupon deleted.')
  } catch (error: any) {
    message.error('Failed to delete coupon: ' + error.message)
  }
}

// --- HELPERS ---
const formatDate = (isoString: string) => {
  if (!isoString) return ''
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
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

:deep(.ant-input-number-input) {
  text-align: center !important;
  font-weight: 600 !important;
}

:deep(.ant-form-item-label > label) {
  font-weight: 600 !important;
  color: #334155 !important;
}

:deep(.ant-btn) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
