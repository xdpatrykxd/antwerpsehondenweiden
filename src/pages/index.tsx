import { Slideshow } from "../components/SlideShow"
import styles from "../styles/Home.module.css"
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
  <section className={styles.intro}>
    <h1>Antwerpse Hondenweiden</h1>
    <p className={styles.introText}>
      Welkom bij Antwerpse Hondenweiden – een website die hondenbezitters helpt om de beste losloopweides in en rond Antwerpen te vinden. 
      Onze missie is om jouw trouwe viervoeter de vrijheid te geven om veilig te rennen en spelen, terwijl jij eenvoudig de dichtstbijzijnde hondenweide met de juiste voorzieningen kunt vinden.
    </p>
  </section>

  <section className={styles.slideshowSection}>
    <Slideshow images={slideshowImages} />
  </section>

  {/*}<section className={styles.contactSection}>
    <h2>Dien een nieuwe hondenweide in</h2>
    <p>
      Ken je een hondenweide die nog niet op onze website staat? Help ons de database uit te breiden door deze hieronder in te dienen. 
      We bekijken je inzending en voegen deze toe aan de site.
    </p>
    <ContactForm />
  </section>{*/}

  <Footer />
</main>

  )
}