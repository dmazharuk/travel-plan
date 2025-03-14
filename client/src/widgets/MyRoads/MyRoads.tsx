import { getAllRoads, updateRoad } from '@/app/entities/road';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from "./MyRoads.module.css";


export function MyRoads() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { roads, isLoading, error } = useAppSelector((state) => state.road);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllRoads());
  }, [dispatch]);

  const userRoads = roads.filter((road) => road.author.id === user?.id);

  const handleToggleVisibility = (roadId: number, currentVisibility: string) => {
    const newVisibility = currentVisibility === 'public' ? 'private' : 'public';

    const roadToUpdate = roads.find((road) => road.id === roadId);

    if (roadToUpdate) {
      const updatedRoadData = {
        ...roadToUpdate,
        visibility: newVisibility,
        city: roadToUpdate.city,
        country: roadToUpdate.country,
        transport: roadToUpdate.transport,
        transportInfo: roadToUpdate.transportInfo,
        routeInfo: roadToUpdate.routeInfo,
      };

      dispatch(updateRoad({ id: roadId, roadData: updatedRoadData })).then(() =>
        dispatch(getAllRoads()),
      );
    }
  };

  const handleRoadClick = (roadId: number) => {
    navigate(`/cabinet/road/${roadId}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мой кабинет</h1>
        <button
          onClick={() => navigate('/create-road')}
          className={styles.createButton}
        >
          Создать новый маршрут
        </button>
      </div>

      {userRoads.length === 0 ? (
        <div className={styles.emptyMessage}>
          У вас пока нет созданных маршрутов
        </div>
      ) : (
        <div className={styles.roadList}>
          {userRoads.map((road) => (
            <div
              key={road.id}
              className={styles.roadItem}
              onClick={() => handleRoadClick(road.id)}
            >
              <div className={styles.roadHeader}>
                <div>
                  <h3 className={styles.roadTitle}>
                    {road.city}, {road.country}
                  </h3>
                  <p className={styles.roadDate}>
                    Создан: {new Date(road.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleVisibility(road.id, road.visibility);
                  }}
                  className={`${styles.visibilityButton} ${
                    road.visibility === 'public' ? styles.public : ''
                  }`}
                >
                  {road.visibility === 'public' ? 'Публичный' : 'Приватный'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
