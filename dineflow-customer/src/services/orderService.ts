import { supabase } from '@/lib/supabaseClient'

// --- Type Definitions ---

export interface CartItemPayload {
  menu_item_id: number
  quantity: number
  price: number          // price at time of order (snapshot)
}

export interface PlaceOrderPayload {
  table_name: string     // e.g. "Table 3"
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

// --- Order Service ---

export const orderService = {

  // Place a new order — inserts into orders, then order_items
  async placeOrder(payload: PlaceOrderPayload): Promise<Order> {
    // Step 1: Create the parent order row
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

    // Step 2: Insert all order items linked to this order
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

  // Track order status by order ID (for post-checkout status tracking)
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
