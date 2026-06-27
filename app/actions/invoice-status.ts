'use server'

import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export type InvoiceStatusData = {
  status: string
  siiCode: string | null
  pdfUrl: string | null
}

export async function getInvoiceStatus(id: number): Promise<InvoiceStatusData> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const { data, error } = await supabaseAdmin
    .from('invoice')
    .select('status, siiCode, pdfUrl')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error || !data) throw new Error('Invoice not found')

  return { status: data.status, siiCode: data.siiCode, pdfUrl: data.pdfUrl }
}
