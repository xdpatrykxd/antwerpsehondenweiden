import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Antwerpse Hondenweiden",
  description: "Find the best off-leash dog areas in and around Antwerp",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        
        {children}
        <footer>
          <p>&copy; {new Date().getFullYear()} Antwerpse Hondenweiden. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
