import { useState } from 'react';
import YandexMap from '../YandexMap/YandexMap';
import styles from './RouteManager.module.css';
import { useAppSelector } from '@/shared/hooks/reduxHooks';
import { MapCoord } from '../MapCoord/MapCoord';

interface RouteManagerProps {
  pathId: number | null; // Добавляем pathId в пропсы
}

const RouteManager: React.FC<RouteManagerProps> = ({ pathId }) => {
  const [points, setPoints] = useState<
    {
      coords: [number, number];
      name: string;
      number: number;
      description: string | undefined;
    }[]
  >([]);

  const handleAddToRoute = (
    coords: [number, number],
    name: string,
    description: string | undefined
  ) => {
    const newPoint = {
      coords,
      name,
      description,
      number: points.length + 1,
    };

    setPoints((prev) => [...prev, newPoint]);
  };

  const coordinates = useAppSelector((state) => state.coordinate.coordinates);

  return (
    <div className={styles.container}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <YandexMap
            points={points}
            onAddToRoute={handleAddToRoute}
            pathId={pathId}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.coordinatesContainer}>
            <h3 className={styles.coordinatesTitle}>Координаты маршрута</h3>
            <ul className={styles.coordinatesList}>
              {coordinates.length !== 0 ? (
                coordinates.map(
                  (coord) =>
                    coord.pathId === pathId && (
                      <li key={coord.id} className={styles.coordinateItem}>
                        <MapCoord coord={coord} />
                      </li>
                    )
                )
              ) : (
                <div>Вы пока не добивали точки</div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteManager;
