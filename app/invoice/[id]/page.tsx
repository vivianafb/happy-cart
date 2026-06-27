import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { formatCLP } from '@/lib/format'

export default async function InvoiceDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: invoice } = await supabaseAdmin
    .from('invoice')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!invoice) notFound()

  const { data: items } = await supabaseAdmin
    .from('invoice_items')
    .select('*, products(name)')
    .eq('invoice_id', id)

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Detalle de Boleta</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(invoice.created_at).toLocaleDateString('es-CL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 text-sm space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 w-28 shrink-0">Estado</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              invoice.status === 'issued'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {invoice.status === 'issued' ? 'Emitida' : 'Pendiente'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 w-28 shrink-0">Código SII</span>
          <span className="text-gray-900">{invoice.siiCode ?? 'Pendiente'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 w-28 shrink-0">PDF</span>
          {invoice.pdfUrl ? (
            <a
              href={invoice.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline hover:text-gray-600"
            >
              Ver PDF
            </a>
          ) : (
            <span className="text-gray-400">Pendiente</span>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Producto</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Cant.</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">P. Unitario</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items?.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-gray-900">
                  {(item.products as { name: string } | null)?.name ?? '—'}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-gray-600">{formatCLP(item.price)}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {formatCLP(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Neto</span>
          <span>{formatCLP(invoice.net_value)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Impuestos (15%)</span>
          <span>{formatCLP(invoice.taxes)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>{formatCLP(invoice.total_value)}</span>
        </div>
      </div>
    </div>
  )
}
