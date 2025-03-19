import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { getPathByRoadIdThunk } from "@/app/entities/path/api";
import { getCoordinatesByPathIdThunk } from "@/app/entities/coordinate/api";
import MapViewerYandexMap from "../MapViewerYandexMap/MapViewerYandexMap";
import styles from "./MapViewer.module.css"; // Подключаем стили

interface MapManagerProps {
  roadId: number | null | undefined;
}

const MapViewer: React.FC<MapManagerProps> = ({ roadId }) => {
  const dispatch = useAppDispatch();
  const path = useAppSelector((state) => state.path.path); // Получаем один path
  const coordinates = useAppSelector((state) => state.coordinate.coordinates);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки данных

  const [points, setPoints] = useState<{ coords: [number, number]; name: string; number: number }[]>([]);
  const [initialCenter, setInitialCenter] = useState<[number, number]>([55.76, 37.64]); // По умолчанию Москва

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
  }, [coordinates]);

  const handleAddToRoute = (coords: [number, number], name: string) => {
    const newPoint = {
      coords,
      name,
      number: points.length + 1,
    };
    setPoints((prev) => [...prev, newPoint]);
    alert(`Точка "${name}" добавлена`);
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
    }
  }, [path, dispatch]);

  if (isLoading) {
    return <p>Загрузка данных...</p>; // Показываем индикатор загрузки
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Карта маршрута</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <MapViewerYandexMap
            key={initialCenter.join(",")} // Принудительно пересоздаем карту при изменении initialCenter
            points={points}
            onAddToRoute={handleAddToRoute}
            pathId={path?.id}
            initialCenter={initialCenter}
          />
        </div>
        {coordinates.length > 0 ? (
          <div className={styles.formGroup}>
            <h3 className={styles.formLabel}>Координаты маршрута:</h3>
            <ul>
              {coordinates.map((coord) => (
                <li key={coord.id}>
                  {coord.coordinateTitle}, {coord.coordinateBody}: {coord.latitude}, {coord.longitude}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className={styles.formLabel}>Координаты не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default MapViewer;








// ПРИМЕР С LOCALSTORAGE


// import React, { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
// import { getPathByRoadIdThunk } from "@/app/entities/path/api";
// import { getCoordinatesByPathIdThunk } from "@/app/entities/coordinate/api";
// import MapViewerYandexMap from "../MapViewerYandexMap/MapViewerYandexMap";

// interface MapManagerProps {
//   roadId: number | null | undefined;
// }

// const MapViewer: React.FC<MapManagerProps> = ({ roadId }) => {
//   const dispatch = useAppDispatch();
//   const path = useAppSelector((state) => state.path.path); // Получаем один path
//   const coordinates = useAppSelector((state) => state.coordinate.coordinates);
//   const [isLoading, setIsLoading] = useState(true); // Состояние загрузки данных

//   const [points, setPoints] = useState<{ coords: [number, number]; name: string; number: number }[]>([]);
//   const [initialCenter, setInitialCenter] = useState<[number, number]>([55.76, 37.64]); // По умолчанию Москва

//   // Загружаем точки из localStorage при монтировании компонента
//   useEffect(() => {
//     const savedPoints = localStorage.getItem("savedPoints");
//     if (savedPoints) {
//       setPoints(JSON.parse(savedPoints));
//     }
//   }, []);

//   // Сохраняем точки в localStorage при их изменении
//   useEffect(() => {
//     localStorage.setItem("savedPoints", JSON.stringify(points));
//   }, [points]);

//   // Преобразуем координаты в формат для YandexMap
//   useEffect(() => {
//     if (coordinates.length > 0) {
//       const formattedPoints = coordinates.map((coord, index) => ({
//         coords: [coord.latitude, coord.longitude] as [number, number],
//         name: coord.coordinateTitle,
//         number: index + 1,
//         description: coord.coordinateBody,
//       }));
//       setPoints(formattedPoints);

//       // Устанавливаем центр карты на первую точку
//       setInitialCenter(formattedPoints[0].coords);
//       setIsLoading(false); // Данные загружены
//     }
//   }, [coordinates]);

//   const handleAddToRoute = (coords: [number, number], name: string) => {
//     const newPoint = {
//       coords,
//       name,
//       number: points.length + 1,
//     };
//     setPoints((prev) => [...prev, newPoint]);
//     alert(`Точка "${name}" добавлена`);
//   };

//   // Получаем Path по roadId
//   useEffect(() => {
//     if (roadId) {
//       dispatch(getPathByRoadIdThunk(roadId))
//         .unwrap()
//         .then(() => setIsLoading(false)) // Данные загружены
//         .catch(() => setIsLoading(false)); // Обработка ошибки
//     }
//   }, [roadId, dispatch]);

//   // Получаем координаты по pathId
//   useEffect(() => {
//     if (path?.id) {
//       dispatch(getCoordinatesByPathIdThunk(path.id))
//         .unwrap()
//         .then(() => setIsLoading(false)) // Данные загружены
//         .catch(() => setIsLoading(false)); // Обработка ошибки
//     }
//   }, [path, dispatch]);

//   if (isLoading) {
//     return <p>Загрузка данных...</p>; // Показываем индикатор загрузки
//   }

//   return (
//     <div>
//       <MapViewerYandexMap
//         key={initialCenter.join(",")} // Принудительно пересоздаем карту при изменении initialCenter
//         points={points}
//         onAddToRoute={handleAddToRoute}
//         pathId={path?.id}
//         initialCenter={initialCenter}
//       />
//       {coordinates.length > 0 ? (
//         <div>
//           <h3>Координаты маршрута:</h3>
//           <ul>
//             {coordinates.map((coord) => (
//               <li key={coord.id}>
//                 {coord.coordinateTitle}: {coord.latitude}, {coord.longitude}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Координаты не найдены.</p>
//       )}
//     </div>
//   );
// };

// export default MapViewer;