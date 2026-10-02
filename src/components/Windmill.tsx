import styles from "./Windmill.module.css";

interface WindmillProps {
  /** Incremented on each click to restart the spin animation. */
  spinKey: number;
}

export default function Windmill({ spinKey }: WindmillProps) {
  return (
    <svg
      className={styles.windmill}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Éolienne"
    >
      <path d="M30.6 30h2.8l1.6 30h-6z" fill="#D4AF37" />
      <g
        key={spinKey}
        className={`${styles.blades} ${spinKey > 0 ? styles.spin : ""}`}
      >
        <path d="M32 27.2c-.9-6-1.4-12-1-20.2.1-1.3 1.9-1.5 2.3-.3 2.3 7.9 2.9 13.9 1.6 20.1z" fill="#D4AF37" />
        <path d="M32.7 28.8c5.5 2.6 10.6 5.8 17 11 1 .8.2 2.4-1 2.1-8-1.9-13.4-4.6-18-8.6z" fill="#D4AF37" />
        <path d="M31.3 28.8c-5.5 2.6-10.6 5.8-17 11-1 .8-.2 2.4 1 2.1 8-1.9 13.4-4.6 18-8.6z" fill="#D4AF37" />
      </g>
      <circle cx="32" cy="28" r="3.2" fill="#ffffff" />
    </svg>
  );
}
