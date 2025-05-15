import Image from "next/image"
import styles from "@/styles/Sponsor.module.css";
import { Footer } from "@/components/Footer"

// Mock data for sponsors
const sponsors = [
  { id: 1, name: "Pet Store Antwerp", logo: "/placeholder.svg?height=100&width=200", link: "#" },
  { id: 2, name: "Doggy Daycare", logo: "/placeholder.svg?height=100&width=200", link: "#" },
  { id: 3, name: "Antwerp Dog Trainers", logo: "/placeholder.svg?height=100&width=200", link: "#" },
  { id: 4, name: "Premium Dog Food", logo: "/placeholder.svg?height=100&width=200", link: "#" },
]

// Mock data for recommended products
const products = [
  { id: 1, name: "Stevige Hondenriem", image: "/placeholder.svg?height=200&width=200", link: "#", price: "€24,99" },
  { id: 2, name: "Interactief Hondenspeelgoed", image: "/placeholder.svg?height=200&width=200", link: "#", price: "€14,99" },
  { id: 3, name: "Comfortabel Hondenbed", image: "/placeholder.svg?height=200&width=200", link: "#", price: "€49,99" },
]

export default function SponsorsPage() {
  return (
    <main className={styles.main}>
      <section className={styles.intro}>
        <h1>Onze Sponsors</h1>
        <p>
          Affiliate links en sponsors helpen ons om de Antwerpse Hondenweiden-website gratis en actueel te houden. 
          We werken samen met lokale bedrijven die onze liefde voor honden delen en kwaliteitsproducten en -diensten bieden voor hondenbezitters.
        </p>
      </section>

      <section className={styles.sponsorsSection}>
        <h2>Onze Partners</h2>
        <div className={styles.sponsorGrid}>
          {sponsors.map((sponsor) => (
            <a key={sponsor.id} href={sponsor.link} className={styles.sponsorCard}>
              <Image
                src={sponsor.logo || "/placeholder.svg"}
                alt={sponsor.name}
                width={200}
                height={100}
                className={styles.sponsorLogo}
              />
              <p>{sponsor.name}</p>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.productsSection}>
        <h2>Aanbevolen Producten</h2>
        <p>
          Dit zijn producten die wij aanbevelen voor hondenbezitters. Wanneer je via deze links iets koopt, ontvangen wij mogelijk een kleine commissie – zonder extra kosten voor jou.
        </p>
        <div className={styles.productGrid}>
          {products.map((product) => (
            <a key={product.id} href={product.link} className={styles.productCard}>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={200}
                height={200}
                className={styles.productImage}
              />
              <h3>{product.name}</h3>
              <p className={styles.price}>{product.price}</p>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
