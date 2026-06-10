import { supabase } from '../lib/supabaseClient'

export interface Order {
  key: string
  id: string
  table: string
  items: string
  total: number
  status: 'Preparing' | 'Ready' | 'Delivered'
  created_at: string
}

export const orderService = {
  async getLiveOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, menu_items(name))')
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((order: any) => {
      const itemsDescription = (order.order_items || [])
        .map((oi: any) => `${oi.quantity}x ${oi.menu_items?.name || 'Unknown Item'}`)
        .join(', ')

      return {
        key: order.id.toString(),
        id: `#ORD-${order.id.toString().padStart(3, '0')}`,
        table: order.table_name,
        items: itemsDescription || 'No items',
        total: Number(order.total),
        status: order.status as 'Preparing' | 'Ready' | 'Delivered',
        created_at: order.created_at
      }
    })
  },

  async updateOrderStatus(id: number, status: 'Preparing' | 'Ready' | 'Delivered') {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error('Order not found or permission denied (check Row Level Security policies).')
    }
    return data[0]
  },

  async getOrderDetails(orderId: number) {
    const { data, error } = await supabase
      .from('order_items')
      .select('*, menu_items(name, image)')
      .eq('order_id', orderId)

    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.menu_items?.name || 'Unknown Dish',
      image: item.menu_items?.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=300&q=80',
      quantity: item.quantity,
      price: Number(item.price),
      subtotal: item.quantity * Number(item.price)
    }))
  },

  async getDashboardStats() {
    // 1. Fetch orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('total, status, created_at, updated_at')

    if (ordersError) throw ordersError

    // 2. Fetch total active available menu items count
    const { data: itemsData, error: itemsError } = await supabase
      .from('menu_items')
      .select('id')
      .eq('is_available', true)

    if (itemsError) throw itemsError

    const activeOrders = (ordersData || []).filter((o: any) => o.status !== 'Delivered').length
    const revenue = (ordersData || []).reduce((acc: number, o: any) => acc + Number(o.total), 0)
    const uniqueTables = new Set((ordersData || []).map((o: any) => o.table_name)).size

    // Calculate actual average prep time for completed orders (Ready or Delivered)
    const completedOrders = (ordersData || []).filter((o: any) =>
      (o.status === 'Ready' || o.status === 'Delivered') && o.updated_at && o.created_at
    )

    let avgPrepTimeMinutes = 0
    if (completedOrders.length > 0) {
      const totalDiffMs = completedOrders.reduce((sum: number, o: any) => {
        const diffMs = new Date(o.updated_at).getTime() - new Date(o.created_at).getTime()
        return sum + Math.max(0, diffMs)
      }, 0)
      avgPrepTimeMinutes = (totalDiffMs / completedOrders.length) / 60000
    }

    // Calculate Efficiency (ratio of completed/delivered orders vs total orders, default to 100% if empty)
    const deliveredCount = (ordersData || []).filter((o: any) => o.status === 'Delivered').length
    const totalCount = (ordersData || []).length
    const efficiencyPercent = totalCount > 0 ? (deliveredCount / totalCount) * 100 : 100

    return {
      activeOrders,
      revenue,
      customersCount: uniqueTables,
      availableItemsCount: (itemsData || []).length,
      avgPrepTime: avgPrepTimeMinutes > 0 ? `${avgPrepTimeMinutes.toFixed(1)} min` : '0.0 min',
      efficiency: `${efficiencyPercent.toFixed(1)}%`
    }
  },

  subscribeToLiveOrders(onChange: () => void) {
    const channel = supabase
      .channel('live-orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          onChange()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'order_items' },
        () => {
          onChange()
        }
      )
      .subscribe()

    return channel
  }
}
