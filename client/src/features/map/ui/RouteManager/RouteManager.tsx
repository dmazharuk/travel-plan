import React, { useState } from 'react';
import YandexMap from '../YandexMap/YandexMap';
import styles from './RouteManager.module.css';

interface RouteManagerProps {
  pathId: number | null; // Добавляем pathId в пропсы
}

const RouteManager: React.FC<RouteManagerProps> = ({ pathId }) => {
  const [points, setPoints] = useState<{ coords: [number, number]; name: string; number: number }[]>([]);

  const handleAddToRoute = (coords: [number, number], name: string) => {
    const newPoint = {
      coords,
      name,
      number: points.length + 1,
    };
    setPoints((prev) => [...prev, newPoint]);
    alert(`Точка "${name}" добавлена`);
  };

  return (
    <div className={styles.container}>
      <YandexMap points={points} onAddToRoute={handleAddToRoute} pathId={pathId} />
      <div className={styles.formGroup}>
        <h2 className={styles.title}>Точки маршрута:</h2>
        <ul className={styles.coordinatesList}>
          {points.map((point, index) => (
            <li key={index} className={styles.coordinateItem}>
              <strong>{point.number}. {point.name}</strong>: {point.coords.join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteManager;