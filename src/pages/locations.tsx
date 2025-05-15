import { LocationList } from "@/components/LocationList"
import styles from "../styles/LocationsPage.module.css"
import { Footer } from "@/components/Footer"

// Mock data for the slideshow
const slideshowImages = [
  { src: "/placeholder.svg?height=600&width=1200", alt: "Dog pasture in Antwerp" },
  { src: "/placeholder.svg?height=600&width=1200", alt: "Dogs playing in Wilrijk" },
  { src: "/placeholder.svg?height=600&width=1200", alt: "Fenced dog area in Antwerp" },
]

export default function Home() {
  return (
<main className={styles.main}>
  <section className={styles.locationsSection}>
    <h1>Hondenweides in Antwerpen</h1>
    <LocationList />
  </section>
<Footer />
</main>
  )
}