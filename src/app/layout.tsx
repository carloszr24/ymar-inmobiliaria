import type { Metadata } from 'next'
import { DM_Sans, Manrope, Montserrat } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
})

const display = DM_Sans({
  subsets: ['latin'],
  variable: '--font-display',
})

const logo = Montserrat({
  subsets: ['latin'],
  variable: '--font-logo',
  weight: ['700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Alessandra Maggi | Agente inmobiliaria en Almería',
  description: 'Servicio inmobiliario personalizado en Almería y Roquetas de Mar para compra, venta e inversión.',
  keywords: 'alessandra maggi, agente inmobiliaria, almería, roquetas de mar, pisos, casas, venta, compra',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${sans.variable} ${display.variable} ${logo.variable}`}>
      <body className="bg-white text-stone-900 antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
