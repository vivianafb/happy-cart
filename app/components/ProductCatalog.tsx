'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCLP } from '@/lib/format'

type Product = { id: number; name: string; price: number }
type CartItem = { id: number; name: string; price: number; quantity: number }

export default function ProductCatalog({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  function updateCart(updated: CartItem[]) {
    setCart(updated)
    sessionStorage.setItem('cart', JSON.stringify(updated))
  }

  function getQuantity(id: number) {
    return cart.find((i) => i.id === id)?.quantity ?? 0
  }

  function increment(product: Product) {
    const existing = cart.find((i) => i.id === product.id)
    if (existing) {
      updateCart(cart.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)))
    } else {
      updateCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }])
    }
  }

  function decrement(product: Product) {
    const existing = cart.find((i) => i.id === product.id)
    if (!existing) return
    if (existing.quantity === 1) {
      updateCart(cart.filter((i) => i.id !== product.id))
    } else {
      updateCart(cart.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity - 1 } : i)))
    }
  }

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Catálogo</h1>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
        >
          Carrito
          {totalItems > 0 && (
            <span className="bg-white text-gray-900 rounded-full text-xs font-bold px-1.5 py-0.5 leading-none">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const qty = getQuantity(product.id)
            return (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-1">{product.name}</p>
                <p className="text-sm text-gray-500 mb-4">{formatCLP(product.price)}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrement(product)}
                    disabled={qty === 0}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-gray-900">{qty}</span>
                  <button
                    onClick={() => increment(product)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
