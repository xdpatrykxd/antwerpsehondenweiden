"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "../styles/ZoneCard.module.css";

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

interface ZoneCardProps {
  zone: Pasture;
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const renderStars = (rating: number) => (
    <div className={styles.stars} aria-label={`Rating: ${rating} uit 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? styles.filledStar : styles.emptyStar}
          aria-hidden="true"
        >
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );

  return (
    <Link href={`/details/${zone._id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image
            src={zone.image || "/placeholder.svg"}
            alt={`Foto van hondenweide ${zone.dogParkName}`}
            width={400}
            height={300}
            className={styles.image}
          />
          
        </div>

        <div className={styles.info}>
          <h2 className={styles.title}>{zone.dogParkName || "Naam onbekend"}</h2>
          <address className={styles.address}>{zone.address}</address>
          <div className={styles.ratingBox}>
            {renderStars(Math.round(zone.rating))}
            <span className={styles.ratingValue}>{zone.rating.toFixed(1)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
