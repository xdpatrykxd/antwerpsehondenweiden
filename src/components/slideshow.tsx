"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import styles from "../styles/slideshow.module.css"

interface SlideshowProps {
  images: {
    src: string
    alt: string
  }[]
}

export function Slideshow({ images }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % images.length
    setCurrentIndex(newIndex)
  }

  return (
    <div className={styles.slideshow}>
      <div className={styles.slideshowContainer}>
        {images.map((image, index) => (
          <div key={index} className={`${styles.slide} ${index === currentIndex ? styles.active : ""}`}>
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              priority={index === 0}
              className={styles.slideImage}
            />
          </div>
        ))}
        <button className={`${styles.arrow} ${styles.prev}`} onClick={goToPrevious}>
          &lt;
        </button>
        <button className={`${styles.arrow} ${styles.next}`} onClick={goToNext}>
          &gt;
        </button>
      </div>
      <div className={styles.dots}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
