'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatCLP } from '@/lib/format'
import { generateInvoice } from '@/app/actions/invoice'

type CartItem = { id: number; name: string; price: number; quantity: number }

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isPending, startTransition] = useTransition()
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  function updateCart(updated: CartItem[]) {
    setCart(updated)
    sessionStorage.setItem('cart', JSON.stringify(updated))
  }

  function increment(id: number) {
    updateCart(cart.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)))
  }

  function decrement(id: number) {
    const item = cart.find((i) => i.id === id)
    if (!item) return
    if (item.quantity === 1) {
      setConfirmId(id)
    } else {
      updateCart(cart.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)))
    }
  }

  function requestRemove(id: number) {
    setConfirmId(id)
  }

  function confirmRemove() {
    if (confirmId !== null) {
      updateCart(cart.filter((i) => i.id !== confirmId))
      setConfirmId(null)
    }
  }

  function cancelRemove() {
    setConfirmId(null)
  }

  const total_value = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const taxes = total_value * 0.15
  const net_value = total_value - taxes

  function handleGenerateInvoice() {
    startTransition(async () => {
      const invoiceId = await generateInvoice(cart)
      sessionStorage.removeItem('cart')
      router.push(`/invoice/${invoiceId}`)
    })
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">El carrito está vacío.</p>
        <Link href="/catalog" className="text-sm text-gray-900 underline">
          Ir al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-full">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Carrito</h1>

      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <p className="text-gray-900 font-medium mb-6">
              ¿Seguro que quieres eliminar este producto del carrito?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelRemove}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden sm:block bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Producto</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Precio</th>
              <th className="text-center px-4 py-3 text-gray-600 font-medium">Cantidad</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">Total</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-right text-gray-500">{formatCLP(item.price)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => decrement(item.id)}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-50"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {formatCLP(item.price * item.quantity)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => requestRemove(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Eliminar"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col gap-3 mb-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="font-medium text-gray-900">{item.name}</p>
              <button
                onClick={() => requestRemove(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                aria-label="Eliminar"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrement(item.id)}
                  className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-50"
                >
                  −
                </button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => increment(item.id)}
                  className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-xs hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="text-gray-500">{formatCLP(item.price)} c/u</p>
                <p className="font-medium text-gray-900">{formatCLP(item.price * item.quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sm:flex sm:justify-end">
        <div className="sm:w-72">
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 text-sm space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Neto</span>
              <span>{formatCLP(net_value)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Impuestos (15%)</span>
              <span>{formatCLP(taxes)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{formatCLP(total_value)}</span>
            </div>
          </div>

          <button
            onClick={handleGenerateInvoice}
            disabled={isPending}
            className="w-full py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Generando...' : 'Comprar'}
          </button>
        </div>
      </div>
    </div>
  )
}
