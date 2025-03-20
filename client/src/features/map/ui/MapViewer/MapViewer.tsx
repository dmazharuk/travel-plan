import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { getPathByRoadIdThunk } from "@/app/entities/path/api";
import {
  deleteCoordinateThunk,
  getAllCoordinatesThunk,
  getCoordinateById,
  getCoordinatesByPathIdThunk,
  updateCoordinateThunk,
} from "@/app/entities/coordinate/api";
import MapViewerYandexMap from "../MapViewerYandexMap/MapViewerYandexMap";
import styles from "./MapViewer.module.css"; // Подключаем стили
import { ICoordinate } from "@/app/entities/coordinate";

interface MapManagerProps {
  roadId: number | null | undefined;
}

const MapViewer: React.FC<MapManagerProps> = ({ roadId }) => {
  const dispatch = useAppDispatch();
  const [editable, setEditable] = useState(false);
  const path = useAppSelector((state) => state.path.path); // Получаем один path
  const coordinates = useAppSelector((state) => state.coordinate.coordinates);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки данных
  const [formData, setFormData] = useState<Partial<ICoordinate>>({
    coordinateTitle: "",
    coordinateBody: "",
  });
  const [points, setPoints] = useState<
    { coords: [number, number]; name: string; number: number }[]
  >([]);
  const [initialCenter, setInitialCenter] = useState<[number, number]>([
    55.76, 37.64,
  ]); // По умолчанию Москва

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteCoordinate = (coordinateId: any) => {
    // console.log(coordinateId);

    dispatch(deleteCoordinateThunk(coordinateId))
      .unwrap()
      .then(() => {})
      .catch((error) => {
        console.error("Ошибка при удалении координаты:", error);
      });
  };

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

  // console.log(path);

  const handleAddToRoute = (coords: [number, number], name: string) => {
    const newPoint = {
      coords,
      name,
      number: points.length + 1,
    };
    setPoints((prev) => [...prev, newPoint]);
    // alert(`Точка "${name}" добавлена`);
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

  // console.log(coordinates);
  // console.log(coords);

  // Получаем координаты по pathId
  useEffect(() => {
    if (path?.id) {
      dispatch(getCoordinatesByPathIdThunk(path.id))
        .unwrap()
        .then(() => setIsLoading(false)) // Данные загружены
        .catch(() => setIsLoading(false)); // Обработка ошибки
    }
  }, [path, dispatch]);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = (coordinateId: any) => {
    // console.log(coordinateId);

    const updatedCoordinate = {
      coordinateTitle: formData.coordinateTitle,
      coordinateBody: formData.coordinateBody,
    };

    if (coordinateId) {
      dispatch(
        updateCoordinateThunk({
          id: Number(coordinateId),
          updatedCoordinate: updatedCoordinate,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getCoordinateById({ id: Number(coordinateId) }));
          dispatch(getAllCoordinatesThunk());
          // navigate(CLIENT_ROUTES.CABINET_PAGE);
        })
        .catch((error) => {
          console.error("Ошибка обновления:", error);
        });
    }
  };

  // const deleteCoordinate = (coordinateId: any) => {
  //   // console.log(coordinateId);

  //   dispatch(deleteCoordinateThunk(coordinateId))
  //     .unwrap()
  //     .then(() => {

  //     })
  //     .catch((error) => {
  //       console.error("Ошибка при удалении координаты:", error);
  //     });

  // };

  if (isLoading) {
    return <p>Загрузка данных...</p>; // Показываем индикатор загрузки
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Карта путешествия 📌</h3>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <MapViewerYandexMap
            key={initialCenter.join(",")} // Принудительно пересоздаем карту при изменении initialCenter
            points={points}
            onAddToRoute={handleAddToRoute}
            path={path}
            pathId={path?.id}
            initialCenter={initialCenter}
          />
        </div>
        {coordinates.length > 0 ? (
          <div className={styles.formGroup}>
            <h3 className={styles.formLabel}>Координаты маршрута:</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Название точки </label>
                <input
                  type="text"
                  name="coordinateTitle"
                  // className={styles.formInput}
                  value={formData.coordinateTitle || ""}
                  onChange={handleChange}
                  disabled={!editable}
                  placeholder="введите новое название точки"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Описание места</label>
                <input
                  type="text"
                  name="coordinateBody"
                  // className={styles.formInput}
                  value={formData.coordinateBody || ""}
                  onChange={handleChange}
                  disabled={!editable}
                  placeholder="введите новое описание"
                />
              </div>
            </div>

            <ul>
              {coordinates.map((coord) => (
                <li key={coord.id}>
                  <div className={styles.mapReview}>
                    <div>
                      {coord.coordinateTitle}, {coord.coordinateBody}
                    </div>
                    {/* <div>{coord.latitude}, {coord.longitude}</div> */}

                    {/* Кнопки управления */}
                    {/* {coord?.user?.id === user?.id && ( */}
                    <div>
                      <button
                        type="button"
                        className={styles.change}
                        onClick={() => setEditable(!editable)}
                      >
                        {editable ? "Отменить" 
                        : <img src="/notes.png" className={styles.rubbishBin} />}
                        {/* <img src="/rubbishbin.png" className={styles.rubbishBin} /> */}
                        {/* изменить */}
                      </button>

                      {editable && (
                        <button
                          type="button"
                          className={`${styles.button} ${styles.buttonSuccess}`}
                          onClick={() => handleSave(coord.id)}
                        >
                          Сохранить
                        </button>
                      )}

                      <button
                        type="button"
                        className={styles.rubbish}
                        onClick={() => deleteCoordinate(coord.id)}
                      >
                        <img
                          src="/rubbishbin.png"
                          className={styles.rubbishBin}
                        />
                        {/* удалить */}
                      </button>
                    </div>
                    {/* )} */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className={styles.formNoCoords}>Организатор пока не добавил карту к этому маршруту</p>
        )}
      </div>
    </div>
  );
};

export default MapViewer;
