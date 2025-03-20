import React, { useEffect, useRef, useState } from "react";
import styles from "./MapViewerYandexMap.module.css";
import { createCoordinateThunk } from "@/app/entities/coordinate";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { IPath } from "@/app/entities/path";

declare const ymaps: typeof import("yandex-maps");

interface MapViewerYandexMapProps {
  points: { coords: [number, number]; name: string; number: number; description?: string }[];
  onAddToRoute?: (coords: [number, number], name: string) => void;
  pathId: number | null | undefined;
  path: IPath | null ;
  initialCenter: [number, number]; // Новый пропс для начального центра карты
}

const MapViewerYandexMap: React.FC<MapViewerYandexMapProps> = ({ points, onAddToRoute, pathId, path, initialCenter }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<ymaps.Map | null>(null); // Для хранения экземпляра карты
  const placemarksRef = useRef<ymaps.GeoObjectCollection>(new ymaps.GeoObjectCollection()); // Для хранения постоянных меток
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null); // Выбранные координаты
  const [pointName, setPointName] = useState(""); // Название точки
  const [pointDescription, setpointDescription] = useState(""); // Описание точки
  const tempPlacemarkRef = useRef<ymaps.Placemark | null>(null); // Для хранения временной метки
  const { user } = useAppSelector((state) => state.user);
  

  // Добавление временной метки
  const addTempPlacemark = (coords: [number, number]) => {
    if (tempPlacemarkRef.current) {
      // Удаляем старую временную метку
      mapInstance.current?.geoObjects.remove(tempPlacemarkRef.current);
    }

    // Создаем новую временную метку
    tempPlacemarkRef.current = new ymaps.Placemark(coords, {
      hintContent: pointName || "Новая точка",
      balloonContent: `Название: ${
        pointName || "Новая точка"
      }<br>Описание: ${pointDescription}<br>Координаты: ${coords.join(", ")}`,
    });

    // Добавляем временную метку на карту
    mapInstance.current?.geoObjects.add(tempPlacemarkRef.current);
  };

  // Функция для вычисления границ, включающих все точки
  const calculateBounds = (points: [number, number][]) => {
    if (points.length === 0) return null;

    const latitudes = points.map((point) => point[0]);
    const longitudes = points.map((point) => point[1]);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);

    return [
      [minLat, minLon], // Юго-западная точка
      [maxLat, maxLon], // Северо-восточная точка
    ] as [[number, number], [number, number]];
  };

  // Функция для расширения границ на заданный процент
  const expandBounds = (bounds: [[number, number], [number, number]], percent: number) => {
    const [[minLat, minLon], [maxLat, maxLon]] = bounds;

    const latDiff = (maxLat - minLat) * percent;
    const lonDiff = (maxLon - minLon) * percent;

    return [
      [minLat - latDiff, minLon - lonDiff], // Расширяем юго-западную точку
      [maxLat + latDiff, maxLon + lonDiff], // Расширяем северо-восточную точку
    ] as [[number, number], [number, number]];
  };

  useEffect(() => {
    // Загрузка API Яндекс Карт
    ymaps.ready(() => {
      if (!mapRef.current) return;

      // Очищаем старую карту, если она существует
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }

      // Создание карты с начальным центром
      mapInstance.current = new ymaps.Map(mapRef.current, {
        center: initialCenter, // Используем переданный центр
        zoom: 10,
        controls: [], // Отключаем все стандартные элементы управления
      });

      // Добавление элемента управления поиском
      const searchControl = new ymaps.control.SearchControl({
        options: {
          provider: "yandex#search",
        },
      });

      mapInstance.current.controls.add(searchControl);

      // Обработка выбора результата поиска
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      searchControl.events.add("resultselect", (e: any) => {
        const results = searchControl.getResultsArray();
        const selectedResult = results[e.get("index")];
        // @ts-expect-error: Type is not ts
        const coords = selectedResult.geometry.getCoordinates();
        // @ts-expect-error: Type is not ts
        const name = selectedResult.properties.get("name"); // Получаем название организации

        setSelectedCoords(coords); // Сохраняем выбранные координаты
        setPointName(name); // Устанавливаем название организации
        addTempPlacemark(coords); // Добавляем временную метку
      });

      // Обработка клика по карте
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapInstance.current.events.add("click", (e: any) => {
        const coords = e.get("coords") as [number, number];
        setSelectedCoords(coords); // Сохраняем выбранные координаты
        setPointName(""); // Очищаем название, так как это не организация
        addTempPlacemark(coords); // Добавляем временную метку
      });

      // Добавляем коллекцию постоянных меток на карту
      mapInstance.current.geoObjects.add(placemarksRef.current);

      // Вычисляем границы для всех точек
      const coords = points.map((point) => point.coords);
      const bounds = calculateBounds(coords);

      // Устанавливаем границы карты, если они есть
      if (bounds) {
        const expandedBounds = expandBounds(bounds, 0.1); // Расширяем границы на 10%
        mapInstance.current.setBounds(expandedBounds, { checkZoomRange: true });
      }
    });
  }, [initialCenter, points]); // Зависимость от initialCenter и points

  // Обновление постоянных меток при изменении points
  useEffect(() => {
    // if (!mapInstance.current) return;

    // Очищаем старые метки
    placemarksRef.current.removeAll();

    // Добавляем новые метки
    points.forEach((point) => {
      const placemark = new ymaps.Placemark(point.coords, {
        hintContent: `${point.name}`, 
        balloonContent: `Номер: ${point.number} <br> Название: ${point.name}<br>Описание: ${
          point.description || "Нет описания"
        }`,
      });
      placemarksRef.current.add(placemark);
    });
  }, [points]);

  // Обработка добавления точки в маршрут
  const dispatch = useAppDispatch();
  const handleAddToRoute = async () => {
    if (selectedCoords && onAddToRoute) {
      onAddToRoute(selectedCoords, pointName);

      if (tempPlacemarkRef.current) {
        mapInstance.current?.geoObjects.remove(tempPlacemarkRef.current);
        tempPlacemarkRef.current = null;
      }

      if (pathId) {
        await dispatch(
          createCoordinateThunk({
            latitude: selectedCoords[0],
            longitude: selectedCoords[1],
            coordinateTitle: pointName,
            coordinateBody: pointDescription,
            coordinateNumber: points.length + 1,
            pathId: pathId,
          })
        );

        setPointName("");
        setpointDescription("");
        setSelectedCoords(null);
      } else {
        console.error("pathId не определен");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div ref={mapRef} className={styles.mapContainer} />

      {path?.userId === user?.id && selectedCoords && (
        // <div>lol<div/>
        <div className={styles.formGroup}>
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Название точки</label>
                <input
                  type="text"
                  placeholder="Введите название точки"
                  value={pointName}
                  onChange={(e) => setPointName(e.target.value)}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Описание места</label>
                <input
                  type="text"
                  placeholder="Опишите место"
                  value={pointDescription}
                  onChange={(e) => setpointDescription(e.target.value)}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonSuccess}`}
                onClick={handleAddToRoute}
              >
                Добавить в маршрут: {selectedCoords[0].toFixed(4)},{" "}
                {selectedCoords[1].toFixed(4)}
              </button>
            </div>
          </div>
        </div>
      )}
      

    </div>
  );
};

export default MapViewerYandexMap;









