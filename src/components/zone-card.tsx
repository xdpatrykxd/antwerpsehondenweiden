"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import styles from "../styles/zone-card.module.css"

interface Review {
  id: number
  user: string
  text: string
  rating: number
}

interface Zone {
  id: number
  name: string
  address: string
  image: string
  amenities: string[]
  rating: number
  reviews: Review[]
}

interface ZoneCardProps {
  zone: Zone
}

export function ZoneCard({ zone }: ZoneCardProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ user: "", text: "", rating: 5 })

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this to an API
    alert(`Thank you for your review! It will be moderated before appearing on the site.`)
    setNewReview({ user: "", text: "", rating: 5 })
    setShowReviewForm(false)
  }

  return (
    <div className={styles.zoneCard}>
      <div className={styles.zoneHeader}>
        <h3>{zone.name}</h3>
        <p className={styles.address}>{zone.address}</p>
      </div>

      <div className={styles.zoneContent}>
        <div className={styles.imageContainer}>
          <Image
            src={zone.image || "/placeholder.svg"}
            alt={zone.name}
            width={400}
            height={300}
            className={styles.zoneImage}
          />
        </div>

        <div className={styles.zoneInfo}>
          <div className={styles.amenities}>
            <h4>Amenities:</h4>
            <ul>
              {zone.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>

          <div className={styles.rating}>
            <h4>Rating:</h4>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= Math.round(zone.rating) ? styles.filledStar : styles.emptyStar}>
                  ★
                </span>
              ))}
              <span className={styles.ratingText}>({zone.rating.toFixed(1)})</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.reviews}>
        <h4>Reviews:</h4>
        {zone.reviews.length > 0 ? (
          <div className={styles.reviewList}>
            {zone.reviews.map((review) => (
              <div key={review.id} className={styles.review}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewUser}>{review.user}</span>
                  <div className={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= review.rating ? styles.filledStar : styles.emptyStar}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className={styles.reviewText}>{review.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}

        {!showReviewForm ? (
          <button className={styles.reviewButton} onClick={() => setShowReviewForm(true)}>
            Write a Review
          </button>
        ) : (
          <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
            <div className={styles.formGroup}>
              <label htmlFor="user">Your Name:</label>
              <input
                type="text"
                id="user"
                value={newReview.user}
                onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="text">Your Review:</label>
              <textarea
                id="text"
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                required
              />
            </div>

            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitButton}>
                Submit Review
              </button>
              <button type="button" className={styles.cancelButton} onClick={() => setShowReviewForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
