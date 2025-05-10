import Image from "next/image"
import styles from "../../styles/sponsor.module.css"

// Mock data for sponsors
const sponsors = [
  { id: 1, name: "Pet Store Antwerp", logo: "/placeholder.svg?height=100&width=200", link: "#" },
  { id: 2, name: "Doggy Daycare", logo: "/placeholder.svg?height=100&width=200", link: "#" },
  { id: 3, name: "Antwerp Dog Trainers", logo: "/placeholder.svg?height=100&width=200", link: "#" },
  { id: 4, name: "Premium Dog Food", logo: "/placeholder.svg?height=100&width=200", link: "#" },
]

// Mock data for recommended products
const products = [
  { id: 1, name: "Durable Dog Leash", image: "/placeholder.svg?height=200&width=200", link: "#", price: "€24.99" },
  { id: 2, name: "Interactive Dog Toy", image: "/placeholder.svg?height=200&width=200", link: "#", price: "€14.99" },
  { id: 3, name: "Comfortable Dog Bed", image: "/placeholder.svg?height=200&width=200", link: "#", price: "€49.99" },
]

export default function SponsorsPage() {
  return (
    <main className={styles.main}>
      <section className={styles.intro}>
        <h1>Our Sponsors</h1>
        <p>
          Affiliate links and sponsors help us keep the Antwerpse Hondenweiden website free and up-to-date. We partner
          with local businesses that share our love for dogs and provide quality products and services for dog owners.
        </p>
      </section>

      <section className={styles.sponsorsSection}>
        <h2>Our Partners</h2>
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
        <h2>Recommended Products</h2>
        <p>
          These are products we recommend for dog owners. When you purchase through these links, we may earn a small
          commission at no additional cost to you.
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
    </main>
  )
}
