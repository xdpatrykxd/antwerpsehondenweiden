"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../styles/ZoneCard.module.css";

interface Review {
  id: number;
  user: string;
  text: string;
  rating: number;
}

interface DogPark {
  area: string;
  dogParkName: string | null;
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
  hasParcourObstacles: boolean;
  hasEveningLight: boolean;
  isFenced: boolean;
  fenceDetail: string;
  groundTypes: string[];
  reviews: Review[];
  rating: number;
  extraInfo: string;
}

interface ZoneCardProps {
  zone: DogPark;
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    user: "",
    text: "",
    rating: 5,
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Bedankt voor je beoordeling! Deze wordt eerst gemodereerd.`);
    setNewReview({ user: "", text: "", rating: 5 });
    setShowReviewForm(false);
  };

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

  // Dynamically create list of amenities
  const amenities: string[] = [
    zone.hasWaterFountain && "Drinkfontein",
    zone.hasWaterPool && "Waterspeelzone",
    zone.hasShade && "Schaduw",
    zone.hasTrashbin && "Vuilnisbak",
    zone.hasParcourObstacles && "Parcours obstakels",
    zone.hasEveningLight && "Verlichting",
    zone.isFenced && `Afgesloten (${zone.fenceDetail})`,
    zone.benchCount > 0 && `Aantal zitbanken: ${zone.benchCount} `,
    ...zone.groundTypes.map((type) => `Bodem: ${type}`),
  ].filter(Boolean) as string[];

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{zone.dogParkName || "Naam onbekend"}</h2>
        <address className={styles.address}>{zone.address}</address>
      </header>

      <div className={styles.contentGrid}>
        <div>
          <div className={styles.imageWrapper}>
            <Image
              src="/placeholder.svg"
              alt={`Foto van hondenweide ${zone.dogParkName || "onbekend"}`}
              width={400}
              height={300}
              className={styles.image}
              priority={false}
            />
          </div>
          <div className={styles.ratingBox}>
            <h3 className={styles.sectionTitle}>Beoordeling</h3>
            <div className={styles.ratingContainer}>
              {renderStars(Math.round(zone.rating))}
              <span className={styles.ratingValue}>
                {zone.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.details}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Voorzieningen</h3>
            <ul className={styles.amenitiesList}>
              {amenities.map((amenity, idx) => (
                <li key={idx} className={styles.amenityItem}>
                  {amenity}
                </li>
              ))}
            </ul>
            {zone.extraInfo && (
              <p className={styles.extraInfo}>{zone.extraInfo}</p>
            )}
          </section>
        </div>
      </div>

      <section className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h3 className={styles.sectionTitle}>Beoordelingen</h3>
          {!showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className={styles.addReviewButton}
              aria-expanded={showReviewForm}
            >
              + Voeg een beoordeling toe
            </button>
          )}
        </div>

        {zone.reviews.length > 0 ? (
          <ul className={styles.reviewsList}>
            {zone.reviews.map((review) => (
              <li key={review.id} className={styles.review}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewAuthor}>{review.user}</span>
                  {renderStars(review.rating)}
                </div>
                <p className={styles.reviewText}>{review.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noReviews}>
            Nog geen beoordelingen. Wees de eerste!
          </p>
        )}

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
            <div className={styles.formGroup}>
              <label htmlFor="user-name" className={styles.formLabel}>
                Jouw naam
              </label>
              <input
                id="user-name"
                type="text"
                value={newReview.user}
                onChange={(e) =>
                  setNewReview({ ...newReview, user: e.target.value })
                }
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="user-rating" className={styles.formLabel}>
                Beoordeling
              </label>
              <select
                id="user-rating"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    rating: Number(e.target.value),
                  })
                }
                className={styles.formSelect}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value} – {
                      ["Slecht", "Matig", "Goed", "Zeer goed", "Uitstekend"][
                        value - 1
                      ]
                    }
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="user-review" className={styles.formLabel}>
                Jouw beoordeling
              </label>
              <textarea
                id="user-review"
                value={newReview.text}
                onChange={(e) =>
                  setNewReview({ ...newReview, text: e.target.value })
                }
                className={styles.formTextarea}
                rows={4}
                required
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Verstuur beoordeling
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className={styles.cancelButton}
              >
                Annuleer
              </button>
            </div>
          </form>
        )}
      </section>
    </article>
  );
}
