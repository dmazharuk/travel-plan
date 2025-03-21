import React, { useId, useState } from "react";
import YandexMap from "../YandexMap/YandexMap";
import styles from "./RouteManager.module.css";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { MapCoord } from "../MapCoord/MapCoord";

interface RouteManagerProps {
  pathId: number | null; // Добавляем pathId в пропсы
}

const RouteManager: React.FC<RouteManagerProps> = ({ pathId }) => {
  const pointId = useId();
  console.log(pointId);

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

        {/* {coordinates?.length === 0 ? 
       (
        <div className={styles.formNoCoords}>
          Вы пока не добавили точки
        </div>
      )
      :
      ( */}
        <div className={styles.formGroup}>
          <div className={styles.coordinatesContainer}>
            <h3 className={styles.coordinatesTitle}>Координаты маршрута</h3>
            <ul className={styles.coordinatesList}>
              {coordinates.length !== 0 &&
                coordinates.map(
                  (coord) =>
                    coord.pathId === pathId && (
                      <li key={coord.id} className={styles.coordinateItem}>
                        {/* {coordinates?.length === 0 ? <></> : */}
                        <MapCoord coord={coord} />
                        {/* } */}
                      </li>
                    )
                )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteManager;
