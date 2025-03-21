import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { getPathByRoadIdThunk } from '@/app/entities/path/api';
import { getCoordinatesByPathIdThunk } from '@/app/entities/coordinate/api';
import MapViewerYandexMap from '../MapViewerYandexMap/MapViewerYandexMap';
import { MapCoord } from '../MapCoord/MapCoord';
import { MapCoordNotAuthor } from '../MapCoord/MapCoordNotAuthor';
import styles from './MapViewer.module.css';

interface MapManagerProps {
  roadId: number | null | undefined;
}

const MapViewer: React.FC<MapManagerProps> = ({ roadId }) => {
  const dispatch = useAppDispatch();
  const path = useAppSelector((state) => state.path.path); // Получаем один path
  const { user } = useAppSelector((state) => state.user);

  const coordinates = useAppSelector((state) => state.coordinate.coordinates);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки данных
  const [points, setPoints] = useState<
    { coords: [number, number]; name: string; number: number }[]
  >([]);
  const [initialCenter, setInitialCenter] = useState<[number, number]>([
    55.76, 37.64,
  ]); // По умолчанию Москва

  // Преобразуем координаты в формат для YandexMap
  useEffect(() => {
    if (coordinates.length > 0) {
      const formattedPoints = coordinates.map((coord, index) => ({
        coords: [coord.latitude, coord.longitude] as [number, number],
        name: coord.coordinateTitle,
        number: index + 1,
        description: coord.coordinateBody,
      }));
      setPoints(formattedPoints);

      // Устанавливаем центр карты на первую точку
      setInitialCenter(formattedPoints[0].coords);
      setIsLoading(false); // Данные загружены
    }

    return () => {
      setPoints([]);
    };
  }, [coordinates]);

  const handleAddToRoute = (coords: [number, number], name: string) => {
    const newPoint = {
      coords,
      name,
      number: points.length + 1,
    };
    setPoints((prev) => [...prev, newPoint]);
  };

  // Получаем Path по roadId
  useEffect(() => {
    if (roadId) {
      dispatch(getPathByRoadIdThunk(roadId))
        .unwrap()
        .then(() => setIsLoading(false)) // Данные загружены
        .catch(() => setIsLoading(false)); // Обработка ошибки
    }
  }, [roadId, dispatch]);

  // Получаем координаты по pathId
  useEffect(() => {
    if (path?.id) {
      dispatch(getCoordinatesByPathIdThunk(path.id))
        .unwrap()
        .then(() => setIsLoading(false)) // Данные загружены
        .catch(() => setIsLoading(false)); // Обработка ошибки
    } else {
      dispatch(getCoordinatesByPathIdThunk(0))
        .unwrap()
        .then(() => setIsLoading(false)) // Данные загружены
        .catch(() => setIsLoading(false)); // Обработка ошибки
    }
  }, [path, dispatch]);

  if (isLoading) {
    return <p>Загрузка данных...</p>; // Показываем индикатор загрузки
  }

  return (
    <div className={styles.container}>
      <div className={styles.formGrid}>
        {/* {path?.userId === user?.id && coordinates.length !== 0 && coordinates.map((coord) => (
                  path?.roadId === roadId && */}
        <div className={styles.formGroup}>
          <MapViewerYandexMap
            key={initialCenter.join(',')} // Принудительно пересоздаем карту при изменении initialCenter
            points={points}
            onAddToRoute={handleAddToRoute}
            path={path}
            pathId={path?.id}
            initialCenter={initialCenter}
          />
        </div>

        {/* {path?.userId === user?.id && ( <div>лол<div/>  )}; */}
        {coordinates.length < 0 ? (
          <p className={styles.formNoCoords}>
            Организатор пока не добавил карту
          </p>
        ) : (
          <div className={styles.formGroup}>
            <div className={styles.coordinatesContainer}>
              <h3 className={styles.coordinatesTitle}>Координаты маршрута</h3>
              <ul className={styles.coordinatesList}>
                {path?.userId === user?.id &&
                  coordinates.length !== 0 &&
                  coordinates.map(
                    (coord) =>
                      path?.roadId === roadId && (
                        <li key={coord.id} className={styles.coordinateItem}>
                          <MapCoord coord={coord} />
                        </li>
                      )
                  )}
                {path?.userId !== user?.id &&
                  coordinates.length !== 0 &&
                  coordinates.map(
                    (coord) =>
                      path?.roadId === roadId && (
                        <li key={coord.id} className={styles.coordinateItem}>
                          <MapCoordNotAuthor coord={coord} />
                        </li>
                      )
                  )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapViewer;
