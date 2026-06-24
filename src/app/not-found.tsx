import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 md:pt-[8.5rem]">
      <div className="text-center">
        <p className="font-display text-8xl font-light text-stone-200 mb-6">404</p>
        <h1 className="font-display text-3xl font-light text-stone-900 mb-4">Página no encontrada</h1>
        <p className="text-stone-500 mb-10">La página que buscas no existe o ha sido movida. Puedes volver al inicio y explorar nuestras propiedades.</p>
        <Link href="/" className="btn-primary px-8 py-3 text-sm">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
