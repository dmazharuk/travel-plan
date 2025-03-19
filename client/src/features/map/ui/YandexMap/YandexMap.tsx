import React, { useEffect, useRef, useState } from "react";
import styles from "./YandexMap.module.css";
import {
  createCoordinateThunk,
} from "@/app/entities/coordinate";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";

declare const ymaps: typeof import("yandex-maps");

// interface YandexMapProps {
//   points: { coords: [number, number]; name: string; number: number }[]; // Добавляем поле number
//   onAddToRoute?: (coords: [number, number], name: string) => void; // Обработчик добавления точки в маршрут
// }

interface YandexMapProps {
  points: { coords: [number, number]; name: string; number: number ; description?: string; }[];
  onAddToRoute?: (coords: [number, number], name: string) => void;
  pathId: number | null; // Добавляем pathId в пропсы
  coordinates?: { coords: [number, number]; coordinateNumber: number; coordinateTitle: string ; coordinateBody: string; }[];
}

// const coordinatesArray = [coordinates.latitude, coordinates.longitude];

const YandexMap: React.FC<YandexMapProps> = ({ points, onAddToRoute, pathId  }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<ymaps.Map | null>(null); // Для хранения экземпляра карты
  const placemarksRef = useRef<ymaps.GeoObjectCollection>(
    new ymaps.GeoObjectCollection()
  ); // Для хранения постоянных меток
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  ); // Выбранные координаты
  const [pointName, setPointName] = useState(""); // Название точки
  const [pointDescription, setpointDescription] = useState(""); // Описание точки
  const tempPlacemarkRef = useRef<ymaps.Placemark | null>(null); // Для хранения временной метки

const coordinatesArray = [coordinates.latitude, coordinates.longitude];


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

  useEffect(() => {
    // Загрузка API Яндекс Карт
    ymaps.ready(() => {
      if (!mapRef.current || mapInstance.current) return; // Если карта уже создана, выходим

      // Создание карты
      mapInstance.current = new ymaps.Map(mapRef.current, {
        center: points[0]?.coords || [55.76, 37.64], // Центр карты (первая точка или Москва)
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
      searchControl.events.add("resultselect", (e: any) => {
        const results = searchControl.getResultsArray();
        const selectedResult = results[e.get("index")];
        // @ts-expect-error: Тип функции не совпадает с ожидаемым
        const coords = selectedResult.geometry.getCoordinates();
        // @ts-expect-error: Тип функции не совпадает с ожидаемым
        const name = selectedResult.properties.get("name"); // Получаем название организации

        setSelectedCoords(coords); // Сохраняем выбранные координаты
        setPointName(name); // Устанавливаем название организации
        addTempPlacemark(coords); // Добавляем временную метку
      });

      // Обработка клика по карте
      mapInstance.current.events.add("click", (e: any) => {
        const coords = e.get("coords") as [number, number];
        setSelectedCoords(coords); // Сохраняем выбранные координаты
        setPointName(""); // Очищаем название, так как это не организация
        addTempPlacemark(coords); // Добавляем временную метку
      });

      // Добавляем коллекцию постоянных меток на карту
      mapInstance.current.geoObjects.add(placemarksRef.current);
    });
  }, [addTempPlacemark, points]);

  // Обновление постоянных меток при изменении points
  useEffect(() => {
    if (!mapInstance.current) return;

    // Очищаем старые метки
    placemarksRef.current.removeAll();

    // Добавляем новые метки
    points.forEach((point) => {
      const placemark = new ymaps.Placemark(point.coords, {
        hintContent: `${point.number}. ${point.name}`, // Добавляем номер в подпись
        balloonContent: `Название: ${point.name}<br>Описание: ${
          point.description
        }<br>Координаты: ${point.coords.join(", ")}`,
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

      if (pathId) { // Проверяем, что pathId существует
        await dispatch(
          createCoordinateThunk({
            latitude: selectedCoords[0],
            longitude: selectedCoords[1],
            coordinateTitle: pointName,
            coordinateBody: pointDescription,
            coordinateNumber: points.length + 1, // Номер точки
            pathId: pathId, // Используем pathId
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
    <div className={styles.main}>
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
      {selectedCoords && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Введите название точки"
            value={pointName}
            onChange={(e) => setPointName(e.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <input
            type="text"
            placeholder="Опишите место"
            value={pointDescription}
            onChange={(e) => setpointDescription(e.target.value)}
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button type="button" onClick={handleAddToRoute}>
            Добавить в маршрут: {selectedCoords[0].toFixed(4)},{" "}
            {selectedCoords[1].toFixed(4)}
          </button>
        </div>
      )}
    </div>
  );
};

export default YandexMap;
