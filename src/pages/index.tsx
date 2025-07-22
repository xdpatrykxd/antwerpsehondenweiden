"use client";

import { useEffect, useState } from "react";
import { Slideshow } from "@/components/Slideshow";
import styles from "../styles/Home.module.css";
import { Footer } from "@/components/Footer";
import { DogLoader } from "@/components/DogLoader";

interface ImageType {
  src: string;
  alt: string;
  caption?: string;
}

export default function Home() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/images");
        if (!res.ok) throw new Error("Failed to fetch images");

        const data: string[] = await res.json();

        const formattedImages = data.map((src) => ({
          src,
          alt: "Slideshow image",
        }));

        setImages(formattedImages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

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
        {loading ? (
          <DogLoader/>
        ) : images.length > 0 ? (
          <Slideshow images={images} />
        ) : (
          <p>No images found.</p>
        )}
      </section>

      <Footer />
    </main>
  );
}
