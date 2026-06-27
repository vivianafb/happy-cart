'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CartLink() {
  const [count, setCount] = useState(0)

  function readCount() {
    try {
      const stored = sessionStorage.getItem('cart')
      if (!stored) return setCount(0)
      const cart = JSON.parse(stored) as { quantity: number }[]
      setCount(cart.reduce((sum, i) => sum + i.quantity, 0))
    } catch {
      setCount(0)
    }
  }

  useEffect(() => {
    readCount()
    window.addEventListener('cartUpdated', readCount)
    window.addEventListener('storage', readCount)
    return () => {
      window.removeEventListener('cartUpdated', readCount)
      window.removeEventListener('storage', readCount)
    }
  }, [])

  return (
    <Link href="/cart" className="relative text-gray-500 hover:text-gray-900 transition-colors shrink-0" aria-label="Carrito">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .955-.343 1.087-.835l1.456-5.467H6.106L7.5 14.25zM9.75 19.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
