import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Retrieve persisted user phone number if available
  const phoneNumber = ref(localStorage.getItem('dineflow_user_phone') || '')

  const showLoginModal = ref(false)
  const isCheckoutTrigger = ref(false)
  const hasSkippedPhone = ref(false)

  const isLoggedIn = computed(() => !!phoneNumber.value)

  function login(phone: string) {
    phoneNumber.value = phone
    localStorage.setItem('dineflow_user_phone', phone)
  }

  function logout() {
    phoneNumber.value = ''
    localStorage.removeItem('dineflow_user_phone')
  }

  return {
    phoneNumber,
    showLoginModal,
    isCheckoutTrigger,
    hasSkippedPhone,
    isLoggedIn,
    login,
    logout
  }
})
