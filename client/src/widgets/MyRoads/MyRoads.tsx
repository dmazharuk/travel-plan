import { getAllRoads, updateRoad } from '@/app/entities/road';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './MyRoads.module.css';

export function MyRoads() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { roads, isLoading, error } = useAppSelector((state) => state.road);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllRoads());
  }, [dispatch]);

  // проверка на наличие author
  const userRoads = roads.filter(
    (road) =>
      road.author?.id === user?.id ||
      (road.companions?.some((companion) => companion.id === user?.id) &&
        (road.visibility === 'public' || road.visibility === 'friends')),
  );


  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 50 + Math.floor(Math.random() * 30);
    const lightness = 70 + Math.floor(Math.random() * 10);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getNextVisibility = (currentVisibility: 'private' | 'friends' | 'public') => {
    if (currentVisibility === 'public') return 'friends';
    if (currentVisibility === 'friends') return 'private';
    return 'public';
  };

  const handleToggleVisibility = (
    roadId: number,
    currentVisibility: 'private' | 'friends' | 'public',
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
        dispatch(getAllRoads()),
      );
    }
  };

  const handleRoadClick = (roadId: number) => {
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
        <h1 className={styles.title}>Мой кабинет</h1>
        <div className={styles.conteinerForTitle}>
          <h3>Мои маршруты</h3>
          <button onClick={handleCreateRoadClick} className={styles.createButton}>
            <span>+</span>
            <span className={styles.tooltip}>Создать маршрут</span>
          </button>
        </div>
      </div>

      {userRoads.length === 0 ? (
        <div className={styles.emptyMessage}>У вас пока нет созданных маршрутов</div>
      ) : (
        <div className={styles.roadList}>
          {userRoads.map((road) => (
            <div
              key={road.id}
              className={styles.roadItem}
              onClick={() => handleRoadClick(road.id)}
              style={{ backgroundColor: getRandomColor() }}
            >
              <div className={styles.roadHeader}>
                <div>
                  <h3 className={styles.roadTitle}>
                    {road.city}, {road.country}
                  </h3>
                  <p className={styles.roadDate}>
                    Создан: {new Date(road.createdAt).toLocaleDateString()}
                    <br />
                    Создатель: {road.author?.username}
                  </p>
                  <p className={styles.tripDate}>
                    Даты путешествия:{' '}
                    {`${new Date(road.tripStartDate).toLocaleDateString()} - ${new Date(road.tripEndDate).toLocaleDateString()}`}
                  </p>
                </div>
                {road.author?.id === user?.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(road.id, road.visibility);
                    }}
                    className={`${styles.visibilityButton} }`}
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
          ))}
        </div>
      )}
    </div>
  );
}
