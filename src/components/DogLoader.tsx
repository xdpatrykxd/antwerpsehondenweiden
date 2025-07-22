import React from "react";
import styles from "@/styles/DogLoader.module.css";

export const DogLoader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.dogContainer}>
        <div className={styles.dog}>
        </div>
        <div className={styles.shadow}></div>
      </div>
      <p className={styles.loadingText}>Even de pootjes strekken...</p>
    </div>
  );
};
