'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center bg-white p-6">
        <div>
          <h1 className="text-xl font-medium text-stone-900 mb-2">Error al cargar la página</h1>
          <p className="text-stone-500 text-sm mb-4">{error.message}</p>
          <button type="button" onClick={() => reset()} className="text-sm underline text-stone-700">
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
