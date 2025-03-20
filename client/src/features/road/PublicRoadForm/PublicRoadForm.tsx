import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { getAllRoads } from '@/app/entities/road/api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/shared/hooks/reduxHooks';
import styles from './PublicRoadForm.module.css';
import { useNavigate } from 'react-router';
import { SignInModal } from '@/features/auth/SignInModal/SignInModal';

export default function PublicRoadForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cityImages, setCityImages] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { roads, isLoading, error } = useAppSelector((state) => state.road);
  const { user } = useAppSelector((state) => state.user);

  const allPublicRoads = useMemo(
    () => roads.filter((road) => road.visibility === 'public'),
    [roads]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getAllRoads());
  }, [dispatch]);

  useEffect(() => {
    const fetchCityImages = async () => {
      const uniqueCities = Array.from(
        new Set(allPublicRoads.map((road) => road.city))
      );
      const newImages: { [key: string]: string } = {};

      await Promise.all(
        uniqueCities.map(async (city) => {
          if (!cityImages[city]) {
            try {
              const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${city}&client_id=${
                  import.meta.env.VITE_UNSPLASH_ACCESS_KEY
                }&per_page=1`
              );
              const data = await response.json();
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

    if (allPublicRoads.length > 0) fetchCityImages();
  }, [allPublicRoads]);

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

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Публичные маршруты</h1>
      </div>

      {allPublicRoads.length === 0 ? (
        <div className={styles.emptyMessage}>
          Нет доступных публичных маршрутов
        </div>
      ) : (
        <div className={styles.roadList}>
          {allPublicRoads.map((road) => {
            const { pastelColor, darkerColor } = getPastelColorPair();
            return (
              <div
                key={road.id}
                className={styles.roadItem}
                onClick={
                  user ? () => navigate(`/cabinet/road/${road.id}`) : openModal
                }
                style={{
                  backgroundColor: pastelColor,
                  border: `2px solid ${darkerColor}`,
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
      {isModalOpen && <SignInModal closeModal={closeModal} />}
    </div>
  );
}