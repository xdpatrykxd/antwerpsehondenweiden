import { Metadata } from "next";
import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <header>
          <nav className="navbar">
            <div className="logo">
              <a href="/">Antwerpse Hondenweiden</a>
            </div>
            <ul className="nav-links">
              <li>
                <a href="/locations">Locaties</a>
              </li>
              <li>
                <a href="/map">Kaart</a>
              </li>
              <li>
                <a href="/sponsors">Sponsors</a>
              </li>
            </ul>
          </nav>
        </header>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
