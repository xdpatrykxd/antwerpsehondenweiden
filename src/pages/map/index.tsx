import { Footer } from "@/components/Footer";
import dynamic from "next/dynamic";
import styles from "@/styles/Maps.module.css";

const LeafletMap = dynamic(() => import("../../components/LeafletMap"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className={styles.main}>
    <div className={styles.container}>
      <h1 className={styles.title}>Kaart Hondenweide</h1>
      <div className={styles.mapWrapper}>
        <LeafletMap />
      </div>
      <Footer />
    </div>
    </main>
  );
}
