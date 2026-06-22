import { supabase } from '@/lib/supabaseClient'

export interface Category {
  id: number
  name: string
}

export interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number
  image: string | null
  category: string
  is_available: boolean
  track_stock: boolean
  quantity: number
}

export const menuService = {

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) throw error
    return data as Category[]
  },

  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .eq('is_available', true)
      .order('id', { ascending: false })

    if (error) throw error

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      image: item.image,
      category: item.categories?.name || 'Other',
      is_available: item.is_available,
      track_stock: item.track_stock,
      quantity: item.quantity
    }))
  }
}
