import { supabase } from '../lib/supabaseClient.ts'

export const authService = {
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            throw new Error(error.message)
        }

        return data
    },

    async logout() {
        const { error } = await supabase.auth.signOut()
        if (error) throw new Error(error.message)
    },

    async getCurrentUser() {
        const { data: { session } } = await supabase.auth.getSession()
        return session?.user || null
    }
}