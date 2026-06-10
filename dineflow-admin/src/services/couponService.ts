import { supabase } from '../lib/supabaseClient'

// --- Type Definitions ---

export interface Coupon {
  id: number
  code: string
  discount_percent: number
  is_active: boolean
  created_at?: string
}

// --- Coupon Service (Admin CRUD) ---

export const couponService = {

  async getCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Coupon[]
  },

  async createCoupon(code: string, discountPercent: number): Promise<Coupon> {
    const { data, error } = await supabase
      .from('coupons')
      .insert([{
        code: code.trim().toUpperCase(),
        discount_percent: discountPercent,
        is_active: true
      }])
      .select()
      .single()

    if (error) throw error
    return data as Coupon
  },

  async updateCoupon(id: number, updates: Partial<Pick<Coupon, 'code' | 'discount_percent' | 'is_active'>>): Promise<Coupon> {
    const payload: any = {}
    if (updates.code !== undefined) payload.code = updates.code.trim().toUpperCase()
    if (updates.discount_percent !== undefined) payload.discount_percent = updates.discount_percent
    if (updates.is_active !== undefined) payload.is_active = updates.is_active

    const { data, error } = await supabase
      .from('coupons')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Coupon
  },

  async deleteCoupon(id: number): Promise<void> {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async toggleActive(id: number, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('coupons')
      .update({ is_active: isActive })
      .eq('id', id)

    if (error) throw error
  }
}
