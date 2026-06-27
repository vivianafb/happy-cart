import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  return new Response('OK', { status: 200 })
}

export async function POST(req: Request) {
  const body = await req.json()
  console.log('webhook received:', body)
  const { documentId, status, siiCode, pdfUrl } = body

  await supabaseAdmin
    .from('invoice')
    .update({ status, siiCode, pdfUrl })
    .eq('id', documentId)

  return new Response('OK', { status: 200 })
}
