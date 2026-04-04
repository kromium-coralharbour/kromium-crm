import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: 'Kromium CRM', description: 'Kromium Digital Agency CRM' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{height:'100vh',overflow:'hidden',background:'#0B0E1A',color:'#EEF0F5',fontFamily:'Inter,sans-serif'}}>
        {children}
      </body>
    </html>
  )
}
