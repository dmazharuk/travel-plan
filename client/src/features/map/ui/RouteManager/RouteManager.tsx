import React, { useState } from 'react';
import YandexMap from '../YandexMap/YandexMap';
import styles from './RouteManager.module.css';

interface RouteManagerProps {
  pathId: number | null; // Добавляем pathId в пропсы
}

const RouteManager: React.FC<RouteManagerProps> = ({ pathId }) => {
  const [points, setPoints] = useState<{ coords: [number, number]; name: string; number: number; description: string | undefined }[]>([]);

  const handleAddToRoute = (coords: [number, number], name: string, description: string | undefined) => {
    const newPoint = {
      coords,
      name,
      description,
      number: points.length + 1,
    };
    setPoints((prev) => [...prev, newPoint]);
    // alert(`Точка "${name}" добавлена`);
    console.log(newPoint.description);
  };

  

  return (
    <div className={styles.container}>
      <YandexMap points={points} onAddToRoute={handleAddToRoute} pathId={pathId} />
      <div className={styles.formGroup}>
        <h3 className={styles.formLabel}>Координаты маршрута:</h3>
        <ul className={styles.coordinatesList}>
          {points.map((point, index) => (
            <li key={index} className={styles.coordinateItem}>
              <div className={styles.mapReview}>
                <div>{point.number}. {point.name}, {point.description}</div>
                <div>{point.coords.join(', ')}</div>
              </div>
              {/* <strong>{point.number}. {point.name}</strong>: {point.coords.join(', ')} */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteManager;