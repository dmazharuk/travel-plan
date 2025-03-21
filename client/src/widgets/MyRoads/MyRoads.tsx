import { getAllRoads, getRoadById, updateRoad } from '@/app/entities/road';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './MyRoads.module.css';

export function MyRoads() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cityImages, setCityImages] = useState<{ [key: string]: string }>({});

  const { roads, isLoading, error } = useAppSelector((state) => state.road);
  const { user } = useAppSelector((state) => state.user);

  // лечим всратую разметку=)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getAllRoads());
  }, [dispatch]);

  // Проверка на наличие author
  const userRoads = useMemo(
    () =>
      roads.filter(
        (road) =>
          road.author?.id === user?.id ||
          (road.companions?.some((companion) => companion.id === user?.id) &&
            (road.visibility === 'public' || road.visibility === 'friends')),
        [roads, user?.id]
      ),
    [roads, user?.id]
  );

  useEffect(() => {
    const fetchCityImages = async () => {
      const uniqueCities = Array.from(
        new Set(userRoads.map((road) => road.city))
      );
      const newImages: { [key: string]: string } = {};

      await Promise.all(
        uniqueCities.map(async (city) => {
          if (!cityImages[city]) {
            try {
              // Пробуем найти изображение города
              let response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                  city
                )}&client_id=${
                  import.meta.env.VITE_UNSPLASH_ACCESS_KEY
                }&per_page=1`
              );
              let data = await response.json();

              // Если не нашли - ищем по общему запросу "travel"
              if (!data.results?.[0]?.urls?.regular) {
                response = await fetch(
                  `https://api.unsplash.com/search/photos?query=travel&client_id=${
                    import.meta.env.VITE_UNSPLASH_ACCESS_KEY
                  }&per_page=1`
                );
                data = await response.json();
              }

              if (data.results?.[0]?.urls?.regular) {
                newImages[city] = data.results[0].urls.regular;
              }
            } catch (error) {
              console.error('Error fetching image for', city, error);
            }
          }
        })
      );

      setCityImages((prev) => ({ ...prev, ...newImages }));
    };

    if (userRoads.length > 0) fetchCityImages();
  }, [userRoads]);

  // Функция для генерации пастельного цвета и его более темного варианта
  const getPastelColorPair = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 25 + Math.floor(Math.random() * 20);
    const lightness = 80 + Math.floor(Math.random() * 10);
    const pastelColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    const darkerSaturation = saturation + 20;
    const darkerLightness = Math.max(lightness - 15, 20);
    const darkerColor = `hsl(${hue}, ${darkerSaturation}%, ${darkerLightness}%)`;

    return { pastelColor, darkerColor };
  };

  const getNextVisibility = (
    currentVisibility: 'private' | 'friends' | 'public'
  ) => {
    if (currentVisibility === 'public') return 'friends';
    if (currentVisibility === 'friends') return 'private';
    return 'public';
  };

  const handleToggleVisibility = (
    roadId: number,
    currentVisibility: 'private' | 'friends' | 'public'
  ) => {
    const newVisibility = getNextVisibility(currentVisibility);
    const roadToUpdate = roads.find((road) => road.id === roadId);

    if (roadToUpdate) {
      const updatedRoadData = {
        ...roadToUpdate,
        visibility: newVisibility as 'private' | 'friends' | 'public',
        city: roadToUpdate.city,
        country: roadToUpdate.country,
        transport: roadToUpdate.transport,
        transportInfo: roadToUpdate.transportInfo,
        routeInfo: roadToUpdate.routeInfo,
      };

      dispatch(updateRoad({ id: roadId, roadData: updatedRoadData })).then(() =>
        dispatch(getAllRoads())
      );
    }
  };

  const handleRoadClick = async (roadId: number) => {
    await dispatch(getRoadById({ id: Number(roadId) }));
    navigate(`/cabinet/road/${roadId}`);
  };

  const handleCreateRoadClick = () => {
    navigate('/create-road');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои маршруты</h1>
        <div className={styles.conteinerForTitle}>
          <button
            onClick={handleCreateRoadClick}
            className={styles.createButton}
          >
            Создать маршрут
          </button>
        </div>
      </div>

      {userRoads.length === 0 ? (
        <div className={styles.emptyMessage}>
          У вас пока нет созданных маршрутов
        </div>
      ) : (
        <div className={styles.roadList}>
          {userRoads.map((road) => {
            const { pastelColor, darkerColor } = getPastelColorPair(); // Получаем цвета
            return (
              <div
                key={road.id}
                className={styles.roadItem}
                onClick={() => handleRoadClick(road.id)}
                style={{
                  backgroundColor: pastelColor, // Фон карточки
                  border: `2px solid ${darkerColor}`, // Граница карточки
                }}
              >
                <div className={styles.roadHeader}>
                  <div className={styles.roadImageContainer}>
                    {cityImages[road.city] ? (
                      <img
                        src={cityImages[road.city]}
                        alt={road.city}
                        className={styles.roadImage}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.imagePlaceholder} />
                    )}
                  </div>
                  <div className={styles.roadInfo}>
                    <div className={styles.titleBlock}>
                      <h3 className={styles.roadTitle}>
                        {road.city}, {road.country}
                      </h3>
                      <div className={styles.controls}>
                        {road.author?.id === user?.id && (
                          <span
                            className={styles.ownerBadge}
                            style={{ backgroundColor: darkerColor }}
                          >
                            Мой маршрут
                          </span>
                        )}
                        {road.author?.id === user?.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVisibility(road.id, road.visibility);
                            }}
                            className={styles.visibilityButton}
                          >
                            {road.visibility === 'public'
                              ? 'Публичный'
                              : road.visibility === 'friends'
                              ? 'Для друзей'
                              : 'Приватный'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={styles.details}>
                      <p className={styles.organizer}>
                        Организатор: {road.author?.username}
                      </p>
                      <p className={styles.tripDate}>
                        {`${new Date(
                          road.tripStartDate
                        ).toLocaleDateString()} - ${new Date(
                          road.tripEndDate
                        ).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
