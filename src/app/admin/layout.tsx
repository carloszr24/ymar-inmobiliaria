import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel Admin | Ymar',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin navbar */}
      <header className="bg-stone-950 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-display text-lg font-medium">
            <span className="text-gold">Ymar</span>
            <span className="text-stone-400 text-xs ml-2 font-sans font-normal tracking-widest uppercase">Admin</span>
          </span>
        </div>
        <a href="/" className="text-xs text-stone-400 hover:text-white transition-colors">
          ← Ver web
        </a>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
    </div>
  )
}
