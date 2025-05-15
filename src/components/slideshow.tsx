"use client"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import styles from "../styles/Slideshow.module.css"

interface SlideshowProps {
  images: {
    src: string
    alt: string
    caption?: string
  }[]
  
  autoPlay?: boolean
  interval?: number
}

export function Slideshow({ 
  images, 
  autoPlay = true, 
  interval = 5000 
}: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!autoPlay || isPaused) return

    const timer = setInterval(() => {
      goToNext()
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, isPaused, goToNext])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === ' ') setIsPaused(prev => !prev)
  }, [goToPrevious, goToNext])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (images.length === 0) return null

  return (
<div 
  className={styles.slideshow}
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
  aria-label="Afbeeldingen diavoorstelling"
>
  <div className={styles.slideshowContainer}>
    {images.map((image, index) => (
      <div 
        key={index}
        className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
        aria-hidden={index !== currentIndex}
      >
        <div className={styles.imageWrapper}>
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority={index === 0}
            className={styles.slideImage}
          />
        </div>
        {image.caption && (
          <div className={styles.caption}>
            <p>{image.caption}</p>
          </div>
        )}
      </div>
    ))}

    {images.length > 1 && (
      <>
        <button 
          className={`${styles.arrow} ${styles.prev}`}
          onClick={goToPrevious}
          aria-label="Vorige dia"
        >
          <ChevronLeftIcon />
        </button>
        <button 
          className={`${styles.arrow} ${styles.next}`}
          onClick={goToNext}
          aria-label="Volgende dia"
        >
          <ChevronRightIcon />
        </button>
      </>
    )}
  </div>

  {images.length > 1 && (
    <div className={styles.controls}>
      <button 
        className={styles.playPause}
        onClick={() => setIsPaused(prev => !prev)}
        aria-label={isPaused ? 'Diavoorstelling afspelen' : 'Diavoorstelling pauzeren'}
      >
        {isPaused ? <PlayIcon /> : <PauseIcon />}
      </button>
      
      <div className={styles.dots}>
        {images.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ga naar dia ${index + 1}`}
          />
        ))}
      </div>

      <div className={styles.counter}>
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )}
</div>

  )
}

// Simple SVG icons (you can replace with your own or import from a library)
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="currentColor"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/>
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M8 5v14l11-7z" fill="currentColor"/>
  </svg>
)

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/>
  </svg>
)