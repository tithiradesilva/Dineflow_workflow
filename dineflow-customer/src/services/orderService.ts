import { supabase } from '@/lib/supabaseClient'

export interface CartItemPayload {
  menu_item_id: number
  quantity: number
  price: number
}

export interface PlaceOrderPayload {
  table_name: string
  items: CartItemPayload[]
  total: number
  payment_method: 'card' | 'cash'
  subtotal: number
  tax: number
  discount: number
  coupon_code: string | null
}

export interface Order {
  id: number
  table_name: string
  total: number
  status: 'Preparing' | 'Ready' | 'Delivered'
  created_at: string
}

export const orderService = {

  async placeOrder(payload: PlaceOrderPayload): Promise<Order> {

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        table_name: payload.table_name,
        total: payload.total,
        status: 'Preparing',
        payment_method: payload.payment_method,
        subtotal: payload.subtotal,
        tax: payload.tax,
        discount: payload.discount,
        coupon_code: payload.coupon_code
      }])
      .select()
      .single()

    if (orderError) throw orderError

    const orderId = orderData.id

    const orderItems = payload.items.map(item => ({
      order_id: orderId,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return orderData as Order
  },

  async getOrderStatus(orderId: number): Promise<'Preparing' | 'Ready' | 'Delivered'> {
    const { data, error } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data.status
  }
}
