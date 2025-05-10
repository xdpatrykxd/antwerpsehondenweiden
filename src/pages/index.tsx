import Link from "next/link"
import { Slideshow } from "@/components/slideshow"
import { LocationList } from "@/components/location-list"
import { ContactForm } from "@/components/contact-form"
import styles from "../styles/Home.module.css"

// Mock data for the slideshow
const slideshowImages = [
  { src: "/placeholder.svg?height=600&width=1200", alt: "Dog pasture in Antwerp" },
  { src: "/placeholder.svg?height=600&width=1200", alt: "Dogs playing in Wilrijk" },
  { src: "/placeholder.svg?height=600&width=1200", alt: "Fenced dog area in Antwerp" },
]

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.intro}>
        <h1>Antwerpse Hondenweiden</h1>
        <p className={styles.introText}>
          Welcome to Antwerpse Hondenweiden – a website dedicated to helping dog owners find the best off-leash areas in
          and around Antwerp. Our mission is to give your furry friend the freedom to run and play safely, while helping
          you locate the nearest dog pastures with all the right amenities.
        </p>
      </section>

      <section className={styles.slideshowSection}>
        <Slideshow images={slideshowImages} />
      </section>

      <section className={styles.locationsSection}>
        <h2>Dog Pastures in Antwerp</h2>
        <LocationList />
      </section>

      <section className={styles.contactSection}>
        <h2>Submit a New Dog Pasture</h2>
        <p>
          Know of a dog pasture that's not listed? Help us grow our database by submitting it below. We'll review your
          submission and add it to our site.
        </p>
        <ContactForm />
      </section>

      <div className={styles.sponsorLink}>
        <p>
          Support our site by checking out our <Link href="/sponsors">sponsors</Link>.
        </p>
      </div>
    </main>
  )
}