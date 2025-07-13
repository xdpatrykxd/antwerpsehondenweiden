"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/DetailsPage.module.css";

interface Review {
  id: number;
  user: string;
  text: string;
  rating: number;
}

interface Pasture {
  _id?: string;
  area: string;
  image: string;
  dogParkName: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  size: string;
  benchCount: number;
  hasShade: boolean;
  hasTrashbin: boolean;
  hasWaterFountain: boolean;
  waterFountainDetail: string;
  hasWaterPool: boolean;
  hasParkourObstacles: boolean;
  hasEveningLight: boolean;
  isFenced: boolean;
  fenceDetail: string;
  groundTypes: string[];
  reviews: Review[];
  rating: number;
  extraInfo: string;
}

export default function PastureDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [pasture, setPasture] = useState<Pasture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchPasture() {
      setLoading(true);
      try {
        const res = await fetch(`/api/pastures/${id}`);
        if (!res.ok) throw new Error("Failed to fetch pasture");
        const data = await res.json();
        setPasture(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPasture();
  }, [id]);

  if (loading) return <p className={styles.loading}>Laden...</p>;
  if (!pasture) return <p className={styles.error}>Hondenweide niet gevonden.</p>;

return (
  <article className={styles.container}>
    <div className={styles.leftColumn}>
      {/* Header + image */}
      <header className={styles.header}>
        <h1 className={styles.title}>{pasture.dogParkName || "Naam onbekend"}</h1>
      </header>

      <img
        className={styles.image}
        src={pasture.image || "/placeholder.svg"}
        alt={`Foto van ${pasture.dogParkName}`}
        width={600}
      />
    </div>

    <div className={styles.rightColumn}>
      <section>
        <h2 className={styles.sectionTitle}>📌 Locatie</h2>
        <table className={styles.infoTable}>
          <tbody>
        <p className={styles.subInfo}><span>📍</span> {pasture.area}</p>
        <p className={styles.subInfo}><span>🏠</span> {pasture.address}</p>
          </tbody>
        </table>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>🌟 Details</h2>
        <table className={styles.detailsTable}>
          <tbody>
            <tr><th>Grootte</th><td>{pasture.size}</td></tr>
            <tr><th>Aantal zitbanken</th><td>{pasture.benchCount}</td></tr>
            <tr><th>Schaduw aanwezig</th><td>{pasture.hasShade ? "🌳 Ja" : "❌ Nee"}</td></tr>
            <tr><th>Vuilnisbak</th><td>{pasture.hasTrashbin ? "🗑️ Ja" : "❌ Nee"}</td></tr>
            <tr><th>Drinkfontein</th><td>{pasture.hasWaterFountain ? `🚰 Ja (${pasture.waterFountainDetail})` : "❌ Nee"}</td></tr>
            <tr><th>Waterspeelzone</th><td>{pasture.hasWaterPool ? "💧 Ja" : "❌ Nee"}</td></tr>
            <tr><th>Parcours obstakels</th><td>{pasture.hasParkourObstacles ? "🏃‍♂️ Ja" : "❌ Nee"}</td></tr>
            <tr><th>Verlichting in de avond</th><td>{pasture.hasEveningLight ? "💡 Ja" : "❌ Nee"}</td></tr>
            <tr><th>Afgesloten</th><td>{pasture.isFenced ? `🚧 Ja (${pasture.fenceDetail})` : "❌ Nee"}</td></tr>
            <tr><th>Bodemtypes</th><td>{pasture.groundTypes.length > 0 ? pasture.groundTypes.join(", ") : "Onbekend"}</td></tr>
          </tbody>
        </table>
      </section>

      {pasture.extraInfo && (
        <section className={styles.extraInfo}>
          <h2 className={styles.sectionTitle}>ℹ️ Extra informatie</h2>
          <p>{pasture.extraInfo}</p>
        </section>
      )}

      <section className={styles.ratingSection}>
        <h2 className={styles.sectionTitle}>⭐ Beoordeling: {pasture.rating.toFixed(1)} / 5</h2>
      </section>

      <section>
        <h3 className={styles.sectionTitle}>📝 Reviews</h3>
        {pasture.reviews.length > 0 ? (
          <ul className={styles.reviewsList}>
            {pasture.reviews.map((review) => (
              <li key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewAvatar}>🐶</span>
                  <strong className={styles.reviewUser}>{review.user}</strong>
                  <span className={styles.reviewRating}> — {review.rating} / 5</span>
                </div>
                <p className={styles.reviewText}>{review.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noReviews}>Geen beoordelingen beschikbaar.</p>
        )}
      </section>
    </div>
  </article>
);


}
