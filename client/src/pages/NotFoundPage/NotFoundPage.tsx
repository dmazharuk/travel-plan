import { JSX } from "react";
import styles from "./NotFoundPage.module.css";

export function NotFoundPage(): JSX.Element {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Ой! Кажется, вы заблудились.</p>
        <p className={styles.description}>
          Страница, которую вы ищете, не существует. Возможно, она была удалена
          или перемещена.
        </p>
        <button
          className={styles.button}
          onClick={() => (window.location.href = "/")}
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}
