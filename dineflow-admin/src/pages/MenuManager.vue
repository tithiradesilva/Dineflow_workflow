<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-heading !font-bold text-secondary tracking-tight" style="font-weight: 700 !important;">Menu Manager</h1>
        <p class="text-[#494949] font-semibold">Create, edit, and manage your restaurant's digital offerings.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <a-button 
          type="default" 
          size="large"
          class="border-slate-200 hover:border-primary hover:text-primary rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 h-12 px-5 transition-all text-slate-600"
          @click="openCategoryModal"
        >
          <PlusOutlined />
          <span>Add Category</span>
        </a-button>

        <a-button 
          type="primary" 
          size="large"
          class="bg-primary hover:bg-primary-dark border-none rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 h-12 px-5 transition-all text-white"
          @click="openModal()"
        >
          <PlusOutlined />
          <span>Add New Dish</span>
        </a-button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div class="mb-6 border-b border-slate-100">
        <a-tabs v-model:activeKey="selectedCategory">
          <a-tab-pane key="All" tab="All Dishes" />
          <a-tab-pane v-for="cat in categories" :key="cat" :tab="cat" />
        </a-tabs>
      </div>

      <a-table 
        :columns="columns" 
        :data-source="filteredMenuItems" 
        :loading="isLoading" 
        :pagination="{ 
          pageSize: 5, 
          showSizeChanger: true, 
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total: number) => `Total ${total} dishes`
        }"
        class="font-sans"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <div class="flex items-center gap-4 py-1">
              <img 
                :src="record.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=300&q=80'" 
                alt="Food Image" 
                class="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm"
              />
              <div class="flex flex-col">
                <span class="font-bold text-slate-800 text-base leading-snug">{{ record.name }}</span>
                <span class="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[220px]" :title="record.description">
                  {{ record.description || 'No description provided.' }}
                </span>
              </div>
            </div>
          </template>

          <template v-else-if="column.dataIndex === 'category'">
            <span class="font-semibold text-slate-600 text-sm">
              {{ record.category }}
            </span>
          </template>

          <template v-else-if="column.dataIndex === 'price'">
            <span class="font-bold text-slate-700 text-sm">${{ record.price.toFixed(2) }}</span>
          </template>

          <template v-else-if="column.dataIndex === 'quantity'">
            <span v-if="!record.track_stock || record.quantity === -1" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/60">
              Unlimited ♾️
            </span>
            <span v-else-if="record.quantity > 0" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100/60">
              {{ record.quantity }} left
            </span>
            <span v-else class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100/60">
              Out of stock
            </span>
          </template>

          <template v-else-if="column.dataIndex === 'is_available'">
            <span 
              class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border"
              :class="record.is_available ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'"
            >
              {{ record.is_available ? 'Available' : 'Sold Out' }}
            </span>
          </template>

          <template v-else-if="column.key === 'actions'">
            <div class="flex justify-end gap-2.5">
              <a-button 
                type="default" 
                class="bg-blue-50/80 border border-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 rounded-xl flex items-center justify-center h-10 w-10 p-0 transition-all shadow-sm flex-none animate-none" 
                @click="openModal(record)"
                title="Edit Dish"
              >
                <template #icon><EditOutlined class="text-[15px]" /></template>
              </a-button>
              
              <a-popconfirm
                title="Are you sure you want to delete this dish?"
                ok-text="Yes"
                cancel-text="No"
                placement="left"
                @confirm="handleDelete(record.id)"
              >
                <a-button 
                  type="default" 
                  class="bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 hover:text-red-600 hover:border-red-500/30 rounded-xl flex items-center justify-center h-10 w-10 p-0 transition-all shadow-sm flex-none animate-none"
                  title="Delete Dish"
                >
                  <template #icon><DeleteOutlined class="text-[15px]" /></template>
                </a-button>
              </a-popconfirm>
            </div>
          </template>

        </template>
      </a-table>
    </div>

    <a-modal 
      v-model:open="isModalVisible" 
      :title="modalMode === 'add' ? 'Create New Dish' : 'Edit Dish'" 
      :zIndex="1000"
      @ok="handleSave"
      okText="Save Dish"
      cancelText="Cancel"
      centered
      :width="680"
      :confirmLoading="isSaving"
      :okButtonProps="{ class: 'bg-primary border-none rounded-xl font-bold h-11 px-6 shadow-sm hover:opacity-90 transition-opacity' }"
      :cancelButtonProps="{ class: 'rounded-xl font-medium h-11 px-5 border-slate-200 hover:border-slate-300' }"
    >
      <a-form layout="vertical" :model="formState" class="mt-5 space-y-4 custom-form">
        <div class="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50/80 border border-slate-100 rounded-2xl">
          <img 
            :src="formState.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=300&q=80'" 
            alt="Food Preview" 
            class="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-md bg-white animate-none"
          />
          <div class="flex flex-col gap-1.5 items-center sm:items-start text-center sm:text-left">
            <span class="text-sm font-bold text-slate-700">Food Illustration / Photo</span>
            <span class="text-xs text-slate-400 max-w-[280px]">Add a bright, attractive image to showcase your dish in style.</span>
            <a-button 
              type="default" 
              class="mt-1 border-primary/20 text-primary hover:border-primary hover:bg-primary/5 rounded-lg flex items-center gap-1.5 font-bold text-xs h-8 px-3"
              @click="openImageModal"
            >
              <template #icon><PictureOutlined /></template>
              <span>Choose or Upload Image</span>
            </a-button>
          </div>
        </div>

        <a-form-item label="Dish Name" required class="mb-0">
          <a-input 
            v-model:value="formState.name" 
            placeholder="e.g., Truffle Fries" 
            size="large"
            class="rounded-lg font-medium custom-height-input" 
          />
        </a-form-item>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a-form-item label="Category" required class="mb-0">
            <div class="flex items-center gap-2 w-full">
              <a-select 
                v-model:value="formState.category" 
                placeholder="Select category" 
                size="large"
                class="flex-1 font-medium custom-height-select"
              >
                <a-select-option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</a-select-option>
              </a-select>
              <a-button 
                type="default" 
                size="large"
                class="custom-height-btn px-4 border-slate-200 hover:border-primary text-slate-600 hover:text-primary rounded-lg font-bold flex items-center justify-center gap-1 transition-all text-xs whitespace-nowrap flex-none" 
                @click="openCategoryModal"
              >
                <PlusOutlined class="text-[10px]" />
                <span>Add</span>
              </a-button>
            </div>
          </a-form-item>
          
          <a-form-item label="Price ($)" required class="mb-0">
            <div class="flex items-center gap-2 w-full">
              <a-button 
                type="default" 
                size="large"
                class="custom-height-btn w-12 flex items-center justify-center border-slate-200 hover:border-primary hover:text-primary rounded-lg text-slate-500 font-bold text-lg transition-all flex-none animate-none"
                @click="decreasePrice"
              >
                <MinusOutlined />
              </a-button>
              <a-input-number 
                v-model:value="formState.price" 
                :min="0" 
                :step="0.50" 
                :controls="false"
                size="large"
                class="flex-1 rounded-lg font-normal price-input-number custom-height-input animate-none" 
              />
              <a-button 
                type="default" 
                size="large"
                class="custom-height-btn w-12 flex items-center justify-center border-slate-200 hover:border-primary hover:text-primary rounded-lg text-slate-500 font-bold text-lg transition-all flex-none animate-none"
                @click="increasePrice"
              >
                <PlusOutlined />
              </a-button>
            </div>
          </a-form-item>
        </div>

        <div class="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl space-y-4 mb-4">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-700 mb-2">Track Inventory Quantity</span>
              <span class="text-xs text-slate-400">Specify precise stock limitations or enable infinite availability.</span>
            </div>
            <a-checkbox v-model:checked="formState.track_stock" class="scale-110" />
          </div>

          <div v-if="formState.track_stock" class="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl animate-fade-in">
            <span class="text-xs font-semibold text-slate-500">Available Quantity:</span>
            <a-input-number 
              v-model:value="formState.quantity" 
              :min="0" 
              class="w-32 rounded-lg h-9 font-semibold text-slate-700" 
            />
          </div>
        </div>

        <a-form-item label="Description" class="mb-0">
          <a-textarea v-model:value="formState.description" :rows="3" placeholder="Describe ingredients, tastes, or notes..." class="rounded-lg font-medium" />
        </a-form-item>

        <a-form-item class="mb-0">
          <a-checkbox v-model:checked="formState.is_available" class="font-semibold text-slate-600">
            Item is currently active and available for orders
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal 
      v-model:open="isCategoryModalVisible" 
      title="Create New Category" 
      :zIndex="1100"
      @ok="handleSaveCategory"
      okText="Add Category"
      cancelText="Cancel"
      centered
      :width="460"
      :confirmLoading="isSaving"
      :okButtonProps="{ class: 'bg-primary border-none rounded-xl font-bold h-11 px-6 shadow-sm hover:opacity-90 transition-opacity' }"
      :cancelButtonProps="{ class: 'rounded-xl font-medium h-11 px-5 border-slate-200 hover:border-slate-300' }"
    >
      <div class="mt-4 space-y-4">
        <p class="text-xs text-slate-400 leading-relaxed">
          Add a new dish category to organize your menu (e.g. Starters, Chef Specials, Seafood, Drinks). This category will automatically appear as a tab on the main page and in the drop-down selectors.
        </p>
        <a-form layout="vertical">
          <a-form-item label="Category Name" required class="mb-0">
            <a-input 
              v-model:value="newCategoryName" 
              placeholder="e.g., Seafood Specials" 
              class="rounded-lg h-11 font-medium" 
              @pressEnter="handleSaveCategory"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <a-modal 
      v-model:open="isImageModalVisible" 
      title="Food Illustration & Image Selector" 
      :zIndex="1100"
      @ok="handleSaveImage"
      okText="Apply Image"
      cancelText="Cancel"
      centered
      :width="650"
      :okButtonProps="{ class: 'bg-primary border-none rounded-xl font-bold h-11 px-6 shadow-sm hover:opacity-90 transition-opacity' }"
      :cancelButtonProps="{ class: 'rounded-xl font-medium h-11 px-5 border-slate-200 hover:border-slate-300' }"
    >
      <div class="mt-5 space-y-6">
        <div class="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <img 
            :src="imageFormUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=300&q=80'" 
            alt="Current Selection Preview" 
            class="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm bg-white"
          />
          <div>
            <span class="text-xs font-bold text-slate-400 block uppercase tracking-wider">Live Preview</span>
            <span class="text-sm font-bold text-slate-700 block mt-0.5">{{ formState.name || 'Your Dish Name' }}</span>
            <span class="text-xs text-slate-400 block mt-0.5 truncate max-w-[320px]">{{ imageFormUrl || 'No image source defined' }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <span class="text-sm font-bold text-slate-700 block">Premium Food Presets</span>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <div 
              v-for="(preset, index) in imagePresets" 
              :key="index"
              class="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all"
              :class="selectedPresetIndex === index ? 'border-primary shadow-md scale-102 ring-4 ring-primary/10' : 'border-slate-100 hover:border-slate-300'"
              @click="handleSelectPreset(preset.url, index)"
            >
              <img :src="preset.url" :alt="preset.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-1.5 text-center">
                <span class="text-[10px] text-white font-bold leading-none">{{ preset.name }}</span>
              </div>
              <div v-if="selectedPresetIndex === index" class="absolute top-1.5 right-1.5 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] border border-white">
                <CheckOutlined />
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
          <div class="space-y-2">
            <span class="text-xs font-bold text-slate-600 block">Upload Local Image File</span>
            <div class="relative border-2 border-dashed border-slate-200 hover:border-primary rounded-xl p-4 transition-colors text-center cursor-pointer flex flex-col items-center justify-center gap-1.5 min-h-[96px] bg-slate-50/40">
              <PictureOutlined class="text-slate-400 text-lg group-hover:text-primary" />
              <span class="text-[11px] font-bold text-slate-500">Choose file or drag here</span>
              <input 
                type="file" 
                accept="image/*" 
                class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                @change="handleFileUpload" 
              />
            </div>
          </div>

          <div class="space-y-2">
            <span class="text-xs font-bold text-slate-600 block">Or Paste Custom Image URL</span>
            <div class="space-y-2">
              <a-input 
                v-model:value="imageFormUrl" 
                placeholder="https://example.com/food.jpg" 
                class="rounded-lg h-10 text-xs font-medium"
                @input="selectedPresetIndex = null"
              />
              <p class="text-[10px] text-slate-400 leading-relaxed">
                Paste direct links from Unsplash, Imgur, or other hosts to render custom menu illustrations.
              </p>
            </div>
          </div>
        </div>
      </div>
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
  PictureOutlined, 
  CheckOutlined 
} from '@ant-design/icons-vue'
import { menuService } from '../services/menuService'

const columns = [
  { title: 'Item', dataIndex: 'name', key: 'name', width: '35%' },
  { title: 'Category', dataIndex: 'category', key: 'category', width: '15%' },
  { title: 'Price', dataIndex: 'price', key: 'price', width: '12%' },
  { title: 'Inventory / Qty', dataIndex: 'quantity', key: 'quantity', width: '18%' },
  { title: 'Status', dataIndex: 'is_available', key: 'is_available', width: '10%' },
  { title: 'Actions', key: 'actions', align: 'right' as const }
]

const categories = ref<string[]>([])
const selectedCategory = ref('All')
const mockMenuItems = ref<any[]>([])
const isLoading = ref(false)
const isSaving = ref(false)

const loadData = async () => {
  isLoading.value = true
  try {
    const fetchedCategories = await menuService.getCategories()
    categories.value = fetchedCategories.map(c => c.name)

    const fetchedItems = await menuService.getMenuItems()
    mockMenuItems.value = fetchedItems
  } catch (error: any) {
    message.error('Failed to load menu data: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})

const filteredMenuItems = computed(() => {
  if (selectedCategory.value === 'All') {
    return mockMenuItems.value
  }
  return mockMenuItems.value.filter(item => item.category === selectedCategory.value)
})

const isModalVisible = ref(false)
const modalMode = ref<'add' | 'edit'>('add')

const formState = reactive({
  id: null as number | null,
  name: '',
  category: undefined as string | undefined,
  price: 0,
  description: '',
  image: '',
  is_available: true,
  track_stock: false,
  quantity: 10
})

const resetForm = () => {
  formState.id = null
  formState.name = ''
  formState.category = undefined
  formState.price = 0
  formState.description = ''
  formState.image = ''
  formState.is_available = true
  formState.track_stock = false
  formState.quantity = 10
}

const increasePrice = () => {
  formState.price = Number((formState.price + 0.50).toFixed(2))
}

const decreasePrice = () => {
  if (formState.price >= 0.50) {
    formState.price = Number((formState.price - 0.50).toFixed(2))
  } else {
    formState.price = 0
  }
}

const openModal = (record?: any) => {
  resetForm()
  if (record) {
    modalMode.value = 'edit'

    Object.assign(formState, {
      ...record,
      track_stock: record.track_stock ?? (record.quantity !== -1 && record.quantity !== undefined),
      quantity: record.quantity === -1 ? 10 : (record.quantity || 10)
    })
  } else {
    modalMode.value = 'add'
  }
  isModalVisible.value = true
}

const handleSave = async () => {
  if (!formState.name || !formState.category || formState.price <= 0) {
    message.error('Please fill in all required fields.')
    return
  }

  if (formState.track_stock && formState.quantity <= 0) {
    formState.is_available = false
  }

  isSaving.value = true
  try {
    const itemData = {
      name: formState.name,
      category: formState.category,
      price: formState.price,
      description: formState.description,
      image: formState.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=300&q=80',
      is_available: formState.is_available,
      track_stock: formState.track_stock,
      quantity: formState.track_stock ? formState.quantity : -1
    }

    if (modalMode.value === 'add') {
      const newItem = await menuService.createMenuItem(itemData)
      mockMenuItems.value.unshift(newItem)
    } else {
      if (formState.id !== null) {
        const updatedItem = await menuService.updateMenuItem(formState.id, itemData)
        const index = mockMenuItems.value.findIndex(item => item.id === formState.id)
        if (index !== -1) {
          mockMenuItems.value[index] = updatedItem
        }
      }
    }
    isModalVisible.value = false
    message.success(`Dish successfully ${modalMode.value === 'add' ? 'created' : 'updated'}!`)
  } catch (error: any) {
    message.error('Failed to save dish: ' + error.message)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    await menuService.deleteMenuItem(id)
    mockMenuItems.value = mockMenuItems.value.filter(item => item.id !== id)
    message.success('Dish deleted successfully.')
  } catch (error: any) {
    message.error('Failed to delete dish: ' + error.message)
  }
}

const isCategoryModalVisible = ref(false)
const newCategoryName = ref('')

const openCategoryModal = () => {
  newCategoryName.value = ''
  isCategoryModalVisible.value = true
}

const handleSaveCategory = async () => {
  const trimmed = newCategoryName.value.trim()
  if (!trimmed) {
    message.error('Please enter a category name.')
    return
  }
  if (categories.value.includes(trimmed)) {
    message.error('Category already exists.')
    return
  }

  isSaving.value = true
  try {
    await menuService.addCategory(trimmed)
    categories.value.push(trimmed)
    message.success(`Category "${trimmed}" added successfully.`)
    isCategoryModalVisible.value = false
  } catch (error: any) {
    message.error('Failed to create category: ' + error.message)
  } finally {
    isSaving.value = false
  }
}

const isImageModalVisible = ref(false)
const imageFormUrl = ref('')
const selectedPresetIndex = ref<number | null>(null)

const imagePresets = [
  { name: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
  { name: 'Salad', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80' },
  { name: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80' },
  { name: 'Pasta', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80' },
  { name: 'Dessert', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80' },
  { name: 'Drinks', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80' }
]

const openImageModal = () => {
  imageFormUrl.value = formState.image || ''
  const idx = imagePresets.findIndex(p => p.url === formState.image)
  selectedPresetIndex.value = idx !== -1 ? idx : null
  isImageModalVisible.value = true
}

const handleSelectPreset = (url: string, index: number) => {
  imageFormUrl.value = url
  selectedPresetIndex.value = index
}

const handleFileUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        imageFormUrl.value = reader.result
        selectedPresetIndex.value = null
      }
    }
    reader.readAsDataURL(file)
  }
}

const handleSaveImage = () => {
  formState.image = imageFormUrl.value
  isImageModalVisible.value = false
  message.success('Food image applied!')
}

</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
  background-color: #ffffff !important;
  color: #64748b;
  font-weight: 600;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0 !important;
}

:deep(.ant-tabs-nav::before) {
  border-bottom: none !important;
}

:deep(.ant-tabs-tab) {
  padding-bottom: 14px !important;
  font-weight: 600 !important;
  color: #64748b !important;
  transition: all 0.2s ease !important;
}

:deep(.ant-tabs-tab-active) {
  color: #E63946 !important;
}

:deep(.ant-tabs-ink-bar) {
  height: 3px !important;
  border-radius: 99px !important;
  background-color: #E63946 !important;
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

.scale-102 {
  transform: scale(1.02);
}

:deep(.price-input-number .ant-input-number-input) {
  text-align: center !important;
  font-weight: 600 !important;
  color: #1e293b !important;
}

.custom-height-select,
.custom-height-input {
  height: 44px !important;
  line-height: 44px !important;
}

.custom-height-btn {
  height: 44px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  padding: 0 16px !important;
  line-height: 1 !important;
}

:deep(.ant-btn) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.ant-btn .ant-btn-icon),
:deep(.ant-btn .anticon) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  margin-top: 0 !important;
}

:deep(.custom-height-select .ant-select-selector) {
  height: 44px !important;
  padding: 0 12px !important;
  display: flex !important;
  align-items: center !important;
  border-radius: 8px !important;
}

:deep(.custom-height-input) {
  height: 44px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 8px !important;
}

:deep(.custom-height-input .ant-input-number-input-wrapper),
:deep(.custom-height-input .ant-input-number-input) {
  height: 44px !important;
  line-height: 44px !important;
  text-align: center !important;
}

:deep(.custom-form .ant-form-item) {
  margin-bottom: 0 !important;
}

:deep(.ant-form-item-label > label) {
  font-weight: 600 !important;
  color: #334155 !important;
}
</style>