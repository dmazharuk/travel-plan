import React, { useState } from "react";
import YandexMap from "../YandexMap/YandexMap";
import styles from "./RouteManager.module.css";
import { deleteCoordinateThunk } from "@/app/entities/coordinate";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
// import { useAppSelector } from '@/shared/hooks/reduxHooks';

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
  // const coordinate = useAppSelector((state) => state.road.road);
  const dispatch = useAppDispatch();

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
    // alert(`Точка "${name}" добавлена`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteCoordinate = (point: any) => {
    // console.log(coordinate?.id);

    // await deleteCoordinateThunk(12);
    // return console.log('succes');

    dispatch(deleteCoordinateThunk(point.number))
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.error("Ошибка при удалении координаты:", error);
      });
  };

  return (
    <div className={styles.container}>
      <YandexMap
        points={points}
        onAddToRoute={handleAddToRoute}
        pathId={pathId}
      />
      <div className={styles.formGroup}>
        <h3 className={styles.formLabel}>Координаты маршрута:</h3>
        <ul className={styles.coordinatesList}>
          {points.map((point, index) => (
            <li key={index} className={styles.coordinateItem}>
              <div className={styles.mapReview}>
                <div>
                  {point.number}. {point.name}, {point.description}
                </div>
                <button
                  type="button"
                  className={styles.rubbish}
                  onClick={() => deleteCoordinate(point)}
                >
                  <img src="/rubbishbin.png" className={styles.rubbishBin} />
                  {/* удалить */}
                </button>
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






{/* <div>{point.coords.join(', ')}</div> */}
                {/* <button
                type='button'
                onClick={() => deleteCoordinate(point)}>
                  удалить
                </button> */}