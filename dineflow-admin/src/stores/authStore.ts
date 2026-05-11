import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)
    const isAuthenticated = ref(false)

    const login = async (email: string, password: string) => {
        try {
            const data = await authService.login(email, password)
            user.value = data.user
            isAuthenticated.value = true
            return { success: true }
        } catch (error: any) {
            console.error('Login failed:', error)
            return { success: false, error: error.message }
        }
    }

    const logout = async () => {
        await authService.logout()
        user.value = null
        isAuthenticated.value = false
    }

    return { user, isAuthenticated, login, logout }
})