import './globals.css'

export const metadata = {
  title: 'AI Album Cover Generator',
  description: 'Generate stunning AI-powered album covers from your music files',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}