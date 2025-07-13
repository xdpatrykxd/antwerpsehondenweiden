"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Slideshow.module.css";

interface SlideshowProps {
  images: { src: string; alt: string; caption?: string }[];
  autoPlay?: boolean;
  interval?: number;
}

export function Slideshow({
  images,
  autoPlay = true,
  interval = 5000,
}: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback((i: number) => setCurrentIndex(i), []);
  const goToPrevious = useCallback(
    () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length]
  );
  const goToNext = useCallback(
    () => setCurrentIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const t = setInterval(goToNext, interval);
    return () => clearInterval(t);
  }, [autoPlay, interval, isPaused, goToNext]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === " ") setIsPaused((p) => !p);
    },
    [goToPrevious, goToNext]
  );
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  if (!images.length) return null;

  return (
    <div
      className={styles.slideshow}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.slideshowContainer}>
        {images.map((img, idx) => {
          // extract the pasture-id from "/pictures/<id>/filename"
          const m = img.src.match(/^\/pictures\/([^/]+)\//);
          const id = m ? m[1] : null;

          const slideContent = (
            <div
              className={`${styles.slide} ${
                idx === currentIndex ? styles.active : ""
              }`}
              aria-hidden={idx !== currentIndex}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className={styles.slideImage}
                  sizes="(max-width:768px)100vw,(max-width:1200px)80vw,1200px"
                  priority={idx === 0}
                />
              </div>
              {img.caption && (
                <div className={styles.caption}>
                  <p>{img.caption}</p>
                </div>
              )}
            </div>
          );

          // if we have a valid id, wrap in Link
          return id ? (
            <Link
              href={`/details/${id}`}
              key={idx}
              className={styles.slideLink}
            >
              {slideContent}
            </Link>
          ) : (
            <div key={idx}>{slideContent}</div>
          );
        })}

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
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Afspelen" : "Pauzeren"}
          >
            {isPaused ? <PlayIcon /> : <PauseIcon />}
          </button>
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${
                  i === currentIndex ? styles.activeDot : ""
                }`}
                onClick={() => goToSlide(i)}
                aria-label={`Ga naar dia ${i + 1}`}
              />
            ))}
          </div>
          <div className={styles.counter}>
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

// SVG icons...
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path
      d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
      fill="currentColor"
    />
  </svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24">
    <path
      d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
      fill="currentColor"
    />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" />
  </svg>
);
