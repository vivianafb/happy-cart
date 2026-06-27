'use client'

import { useState, useEffect } from 'react'
import { getInvoiceStatus, type InvoiceStatusData } from '@/app/actions/invoice-status'

export default function InvoiceStatusPoller({
  invoiceId,
  initial,
}: {
  invoiceId: number
  initial: InvoiceStatusData
}) {
  const [data, setData] = useState<InvoiceStatusData>(initial)

  useEffect(() => {
    if (data.status === 'issued') return

    const id = setInterval(async () => {
      try {
        const result = await getInvoiceStatus(invoiceId)
        setData(result)
        if (result.status === 'issued') clearInterval(id)
      } catch {
      }
    }, 3000)

    return () => clearInterval(id)
  }, [invoiceId, data.status])

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 text-sm space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-gray-500 w-24 shrink-0">Estado</span>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            data.status === 'issued'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {data.status === 'issued' ? 'Emitida' : 'Pendiente'}
        </span>
      </div>
      <div className="flex items-start gap-3">
        <span className="text-gray-500 w-24 shrink-0">Código SII</span>
        <span className="text-gray-900 break-all">{data.siiCode ?? 'Pendiente'}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-500 w-24 shrink-0">PDF</span>
        {data.pdfUrl ? (
          <a
            href={data.pdfUrl}
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
  )
}
