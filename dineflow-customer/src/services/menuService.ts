import { supabase } from '@/lib/supabaseClient'

// --- Type Definitions ---

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
  category: string       // resolved category name (not ID)
  is_available: boolean
  track_stock: boolean
  quantity: number
}

// --- Menu Service ---

export const menuService = {

  // Fetch all categories (used for filter tabs on ProductsPage)
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) throw error
    return data as Category[]
  },

  // Fetch all available menu items, joining category name from categories table
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .eq('is_available', true)       // only show available items to customers
      .order('id', { ascending: false })

    if (error) throw error

    // Flatten the nested categories object into a plain string
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
