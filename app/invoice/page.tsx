import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { formatCLP } from '@/lib/format'

export default async function InvoicePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { data: invoices } = await supabaseAdmin
    .from('invoice')
    .select('id, created_at, status, total_value')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Mis Boletas</h1>

      {!invoices?.length ? (
        <p className="text-gray-500">No tienes boletas aún.</p>
      ) : (
        <>
          <div className="hidden sm:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-medium">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(invoice.created_at).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          invoice.status === 'issued'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {invoice.status === 'issued' ? 'Emitida' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCLP(invoice.total_value)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/invoice/${invoice.id}`}
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden flex flex-col gap-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-600">
                    {new Date(invoice.created_at).toLocaleDateString('es-CL')}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      invoice.status === 'issued'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {invoice.status === 'issued' ? 'Emitida' : 'Pendiente'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900">{formatCLP(invoice.total_value)}</p>
                  <Link
                    href={`/invoice/${invoice.id}`}
                    className="text-gray-600 hover:text-gray-900 underline"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
