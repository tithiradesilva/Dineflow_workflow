import { supabase } from '../lib/supabaseClient'

export interface Category {
  id: number
  name: string
  created_at?: string
}

export interface MenuItem {
  id: number
  name: string
  description: string | null
  price: number
  image: string | null
  category_id: number | null
  is_available: boolean
  track_stock: boolean
  quantity: number
  created_at?: string
  category?: string
}

export const menuService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data as Category[]
  },

  async addCategory(name: string) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select()

    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error('Failed to add category. Permission denied.')
    }
    return data[0] as Category
  },

  async getMenuItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .order('id', { ascending: false })

    if (error) throw error
    
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      image: item.image,
      category_id: item.category_id,
      is_available: item.is_available,
      track_stock: item.track_stock,
      quantity: item.quantity,
      created_at: item.created_at,
      category: item.categories?.name || 'Uncategorized'
    }))
  },

  async resolveCategoryId(categoryName: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .maybeSingle()

    if (error) throw error
    return data?.id || null
  },

  async createMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'category_id'> & { category: string }) {
    const categoryId = await this.resolveCategoryId(item.category)
    
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category_id: categoryId,
        is_available: item.is_available,
        track_stock: item.track_stock,
        quantity: item.quantity
      }])
      .select('*, categories(name)')

    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error('Failed to create menu item. Permission denied.')
    }
    
    const record = data[0]
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      price: Number(record.price),
      image: record.image,
      category_id: record.category_id,
      is_available: record.is_available,
      track_stock: record.track_stock,
      quantity: record.quantity,
      created_at: record.created_at,
      category: record.categories?.name || 'Uncategorized'
    }
  },

  async updateMenuItem(id: number, item: Omit<MenuItem, 'id' | 'created_at' | 'category_id'> & { category: string }) {
    const categoryId = await this.resolveCategoryId(item.category)

    const { data, error } = await supabase
      .from('menu_items')
      .update({
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category_id: categoryId,
        is_available: item.is_available,
        track_stock: item.track_stock,
        quantity: item.quantity
      })
      .eq('id', id)
      .select('*, categories(name)')

    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error('MenuItem not found or permission denied.')
    }
    
    const record = data[0]
    return {
      id: record.id,
      name: record.name,
      description: record.description,
      price: Number(record.price),
      image: record.image,
      category_id: record.category_id,
      is_available: record.is_available,
      track_stock: record.track_stock,
      quantity: record.quantity,
      created_at: record.created_at,
      category: record.categories?.name || 'Uncategorized'
    }
  },

  async deleteMenuItem(id: number) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
