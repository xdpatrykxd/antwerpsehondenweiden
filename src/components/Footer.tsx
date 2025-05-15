// components/Footer.tsx
import Link from "next/link"
import styles from "../styles/Footer.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Steun onze site door een kijkje te nemen bij onze <Link href="/sponsors">sponsors</Link>.
      </p>
    </footer>
  )
}
