<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(#e63946_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-10"></div>
    
    <div class="flex items-center space-x-3 mb-8 select-none z-10">
      <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-[#f87171] flex items-center justify-center shadow-lg shadow-primary/20">
        <span class="text-2xl">🍳</span>
      </div>
      <div>
        <span class="text-2xl font-heading font-extrabold tracking-tight text-secondary">DineFlow</span>
        <span class="text-[10px] block text-accent font-semibold uppercase tracking-wider">Management Suite</span>
      </div>
    </div>

    <div class="w-full max-w-md z-10">
      <div class="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">

        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-accent"></div>

        <div class="text-center mb-8 mt-1">
          <h1 class="text-3xl font-heading font-semibold text-secondary tracking-tight" style="font-weight: 750 !important;">Welcome</h1>
          <p class="text-slate-400 mt-1.5 font-medium text-sm">System Portal: Sign in to continue</p>
        </div>

        <a-form layout="vertical" :model="formState" @finish="onFinish" class="space-y-5">

          <a-form-item
            label="Email Address"
            name="email"
            :rules="[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Please enter a valid email!' }]"
            class="mb-4"
          >
            <a-input 
              v-model:value="formState.email" 
              placeholder="admin@dineflow.com" 
              size="large" 
              class="rounded-xl border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans"
            >
              <template #prefix>
                <MailOutlined class="text-slate-400 mr-2" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            label="Password"
            name="password"
            :rules="[{ required: true, message: 'Please enter your password!' }]"
            class="mb-2"
          >
            <a-input-password 
              v-model:value="formState.password" 
              placeholder="••••••••" 
              size="large" 
              class="rounded-xl border-slate-200 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-sans"
            >
              <template #prefix>
                <LockOutlined class="text-slate-400 mr-2" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="flex items-center justify-between text-xs py-1 select-none">
            <a-checkbox v-model:checked="formState.remember" class="text-slate-500 font-medium">
              Remember credentials
            </a-checkbox>
            <a href="#" class="text-primary hover:text-primary-dark font-semibold transition-colors">
              Forgot Password?
            </a>
          </div>

          <a-form-item class="mt-6 mb-0">
            <a-button 
              type="primary" 
              html-type="submit" 
              size="large" 
              :loading="isSubmitting"
              :disabled="isSubmitting"
              class="w-full bg-primary hover:bg-primary-dark border-none rounded-xl font-semibold shadow-md shadow-primary/20 transition-all h-12 flex items-center justify-center text-white"
            >
              <template v-if="loginSuccess">
                <CheckCircleOutlined class="mr-2 text-lg animate-fade-in" /> Signed In Successfully!
              </template>
              <template v-else-if="isSubmitting">
                Authenticating...
              </template>
              <template v-else>
                Sign In to Dashboard <ArrowRightOutlined class="ml-2 text-sm" />
              </template>
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <div class="text-center mt-8 text-xs text-slate-400 flex items-center justify-center space-x-1.5 select-none">
        <SafetyCertificateOutlined class="text-slate-400 text-sm" />
        <span>Secure authentication. Need access? Contact <span class="font-semibold text-slate-500">System Admin</span>.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useAuthStore } from '../stores/authStore'
import { 
  MailOutlined, 
  LockOutlined, 
  ArrowRightOutlined, 
  SafetyCertificateOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const formState = reactive({
  email: '',
  password: '',
  remember: true
})

const isSubmitting = ref(false)
const loginSuccess = ref(false)

const onFinish = async (values: any) => {
  isSubmitting.value = true
  
  const result = await authStore.login(values.email, values.password)
  
  if (result.success) {
    loginSuccess.value = true
    message.success({ content: 'Access granted! Welcome back.', duration: 1.5 })
    
    setTimeout(() => {
      router.push('/')
    }, 800)
  } else {
    
    isSubmitting.value = false
    loginSuccess.value = false
    message.error({ content: result.error || 'Authentication failed', duration: 3 })
  }
}
</script>

<style scoped>

:deep(.ant-form-item-label > label) {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1D3557;
  padding-bottom: 4px;
}

:deep(.ant-input-affix-wrapper-lg) {
  padding: 8px 14px;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>