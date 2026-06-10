import { supabase } from '@/lib/supabaseClient'

// --- Type Definitions ---

export interface Coupon {
  id: number
  code: string
  discount_percent: number
  is_active: boolean
}

export interface CouponValidationResult {
  valid: boolean
  discount_percent: number
}

// --- Coupon Service ---

export const couponService = {

  // Validate a coupon code against the database
  async validateCoupon(code: string): Promise<CouponValidationResult> {
    const { data, error } = await supabase
      .from('coupons')
      .select('id, code, discount_percent, is_active')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return { valid: false, discount_percent: 0 }
    }

    return { valid: true, discount_percent: data.discount_percent }
  }
}
