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
        <header>
          <nav className="navbar">
            <div className="logo">
              <a href="/">Antwerpse Hondenweiden</a>
            </div>
            <ul className="nav-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/sponsors">Sponsors</a>
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <footer>
          <p>&copy; {new Date().getFullYear()} Antwerpse Hondenweiden. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
