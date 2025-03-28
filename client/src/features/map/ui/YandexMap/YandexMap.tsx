import React, { useEffect, useRef, useState } from 'react';
import styles from './YandexMap.module.css';
import { createCoordinateThunk } from '@/app/entities/coordinate';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';

declare const ymaps: typeof import('yandex-maps');

interface YandexMapProps {
  points: {
    coords: [number, number];
    name: string;
    number: number;
    description?: string | undefined;
  }[];

  onAddToRoute?: (
    coords: [number, number],
    name: string,
    description: string | undefined
  ) => void;

  pathId: number | null | undefined; // Добавляем pathId в пропсы // coordinates?: { coords: [number, number]; coordinateNumber: number; coordinateTitle: string ; coordinateBody: string; }[];
}

const YandexMap: React.FC<YandexMapProps> = ({
  points,
  onAddToRoute,
  pathId,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<ymaps.Map | null>(null); // Для хранения экземпляра карты
  const placemarksRef = useRef<ymaps.GeoObjectCollection>(
    new ymaps.GeoObjectCollection()
  ); // Для хранения постоянных меток

  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  ); // Выбранные координаты

  const [pointName, setPointName] = useState(''); // Название точки
  const [pointDescription, setpointDescription] = useState(''); // Описание точки
  const tempPlacemarkRef = useRef<ymaps.Placemark | null>(null); // Для хранения временной метки // Добавление временной метки

  const addTempPlacemark = (coords: [number, number]) => {
    if (tempPlacemarkRef.current) {
      // Удаляем старую временную метку
      mapInstance.current?.geoObjects.remove(tempPlacemarkRef.current);
    }

    // Создаем новую временную метку с стилизацией
    tempPlacemarkRef.current = new ymaps.Placemark(
      coords,
      {
        hintContent: pointName || 'Новая точка',
        balloonContent: `Название: ${
          pointName || 'Новая точка'
        }<br>Описание: ${pointDescription}<br>Координаты: ${coords.join(', ')}`,
      },
      {
        // Стилизация временной метки
        iconLayout: 'default#image',
        iconImageHref: '/mapitem.png', // URL вашей иконки
        iconImageSize: [30, 30],
        iconImageOffset: [-15, -30],
        // или используем стандартный стиль Яндекс.Карт
        // preset: 'islands#greenIcon', // Пример стандартного стиля
      }
    );

    // Добавляем временную метку на карту
    mapInstance.current?.geoObjects.add(tempPlacemarkRef.current);
  };

  useEffect(() => {
    // Загрузка API Яндекс Карт

    ymaps.ready(() => {
      if (!mapRef.current || mapInstance.current) return; // Если карта уже создана, выходим // Создание карты

      mapInstance.current = new ymaps.Map(mapRef.current, {
        center: points[0]?.coords || [55.76, 37.64], // Центр карты (первая точка или Москва)

        zoom: 10,

        controls: [], // Отключаем все стандартные элементы управления
      }); // Добавление элемента управления поиском

      const searchControl = new ymaps.control.SearchControl({
        options: {
          provider: 'yandex#search',
        },
      });

      mapInstance.current.controls.add(searchControl); // Обработка выбора результата поиска

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      searchControl.events.add('resultselect', (e: any) => {
        const results = searchControl.getResultsArray();

        const selectedResult = results[e.get('index')]; // @ts-expect-error: Тип функции не совпадает с ожидаемым
        const coords = selectedResult.geometry.getCoordinates(); // @ts-expect-error: Тип функции не совпадает с ожидаемым
        const name = selectedResult.properties.get('name'); // Получаем название организации

        setSelectedCoords(coords); // Сохраняем выбранные координаты

        setPointName(name); // Устанавливаем название организации

        addTempPlacemark(coords); // Добавляем временную метку
      }); // Обработка клика по карте

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mapInstance.current.events.add('click', (e: any) => {
        const coords = e.get('coords') as [number, number];
        setSelectedCoords(coords); // Сохраняем выбранные координаты
        setPointName(''); // Очищаем название, так как это не организация

        addTempPlacemark(coords); // Добавляем временную метку
      }); // Добавляем коллекцию постоянных меток на карту

      mapInstance.current.geoObjects.add(placemarksRef.current);
    });
  }, [addTempPlacemark, points]); // Обновление постоянных меток при изменении points

  useEffect(() => {
    if (!mapInstance.current) return;

    // Очищаем старые метки
    placemarksRef.current.removeAll();

    // Добавляем новые метки с стилизацией
    points.forEach((point) => {
      const placemark = new ymaps.Placemark(
        point.coords,
        {
          hintContent: `${point.name}`,
          balloonContent: `Название: ${point.name}<br>Описание: ${
            point.description || 'Нет описания'
          }<br>Координаты: ${point.coords.join(', ')}`,
        },
        {
          // Стилизация метки
          iconLayout: 'default#image', // Используем стандартный layout для изображений
          iconImageHref: '/mapitem.png', // URL вашей иконки
          iconImageSize: [30, 30], // Размер иконки
          iconImageOffset: [-15, -30], // Смещение иконки
          // или используем стандартный стиль Яндекс.Карт
          // preset: 'islands#redIcon', // Пример стандартного стиля
        }
      );

      placemarksRef.current.add(placemark);
    });
  }, [points]);

  const dispatch = useAppDispatch();

  const handleAddToRoute = async () => {
    if (selectedCoords && onAddToRoute) {
      onAddToRoute(selectedCoords, pointName, pointDescription);

      if (pathId) {
        // Проверяем, что pathId существует

        await dispatch(
          createCoordinateThunk({
            latitude: selectedCoords[0],
            longitude: selectedCoords[1],
            coordinateTitle: pointName
              .trim()
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase()),
            coordinateBody: pointDescription.toLocaleLowerCase(),
            coordinateNumber: points.length + 1, // Номер точки
            pathId: pathId, // Используем pathId
          })
        );

        setPointName('');
        setpointDescription('');
        setSelectedCoords(null);
      } else {
        console.error('pathId не определен');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div ref={mapRef} className={styles.mapContainer} />
      {selectedCoords && (
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
                disabled={!pointDescription || !pointName}
              >
                Добавить в маршрут:
                {selectedCoords[0].toFixed(4)},{selectedCoords[1].toFixed(4)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YandexMap;
