import React, { useState } from 'react';
import YandexMap from '../YandexMap/YandexMap';
import styles from './RouteManager.module.css';

const RouteManager: React.FC = () => {
  const [points, setPoints] = useState<{ coords: [number, number]; name: string; number: number }[]>([]);

  const handleAddToRoute = (coords: [number, number], name: string) => {
    const newPoint = {
      coords,
      name,
      number: points.length + 1, // Номер точки = текущее количество точек + 1
    };
    setPoints((prev) => [...prev, newPoint]); // Добавляем точку в список с номером
    alert(`Точка "${name}" добавлена`); // Показываем сообщение с названием
  };

  return (
    <div className={styles.main}>
      <YandexMap points={points} onAddToRoute={handleAddToRoute} />
      <div>
        <h2>Точки маршрута:</h2>
        <ul>
          {points.map((point, index) => (
            <li key={index}>
              <strong>{point.number}. {point.name}</strong>: {point.coords.join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RouteManager;