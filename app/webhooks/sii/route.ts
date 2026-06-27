import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  return new Response('OK', { status: 200 })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { documentId, status, sii_code, pdf_url } = body

  await supabaseAdmin
    .from('invoice')
    .update({ status, sii_code: sii_code, pdf_url: pdf_url })
    .eq('id', documentId)

  return new Response('OK', { status: 200 })
}
