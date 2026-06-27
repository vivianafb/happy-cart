'use server'

import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

type CartItem = { id: number; name: string; price: number; quantity: number }

export async function generateInvoice(items: CartItem[]): Promise<number> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const total_value = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxes = total_value * 0.15
  const net_value = total_value - taxes

  const { data: invoice, error: invoiceError } = await supabaseAdmin
    .from('invoice')
    .insert({ net_value, taxes, total_value, userId })
    .select('id')
    .single()

  if (invoiceError || !invoice) throw new Error('Failed to create invoice')

  const { error: itemsError } = await supabaseAdmin.from('invoice_items').insert(
    items.map((item) => ({
      invoice_id: invoice.id,
      product_id: item.id,
      price: item.price,
      quantity: item.quantity,
    }))
  )

  if (itemsError) throw new Error('Failed to create invoice items')

  return invoice.id
}
