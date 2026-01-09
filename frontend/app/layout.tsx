import type { Metadata } from 'next'
import { Anton, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Retidos na URA - Velotax',
  description: 'Gerenciamento de números de clientes retidos na URA',
  icons: {
    icon: '/logo-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/logo-icon.png" type="image/png" />
      </head>
      <body className={`${anton.variable} ${poppins.variable} font-poppins`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
