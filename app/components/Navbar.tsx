import Link from 'next/link'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link href="/catalog" className="font-semibold text-gray-900 tracking-tight shrink-0">
            Happy Cart
          </Link>
          <Link href="/catalog" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0">
            Catálogo
          </Link>
          <Show when="signed-in">
            <Link href="/cart" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0">
              Carrito
            </Link>
            <Link href="/invoice" className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0">
              Boletas
            </Link>
          </Show>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Show when="signed-out">
            <SignInButton>
              <button className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Iniciar sesión
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors">
                Registrarse
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  )
}
