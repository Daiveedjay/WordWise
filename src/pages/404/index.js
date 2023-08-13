import Link from "next/link";
import styles from "@/styles/Error.module.css";
export default function Custom404() {
  return (
    <div className={styles.error__page}>
      <h1 className="lead__text">404 - Page Not Found</h1>
      <p className="small__text">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/">Go back to the home page</Link>
    </div>
  );
}
