import { getAllRoads, updateRoad } from '@/app/entities/road';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export function MyRoads() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { roads, isLoading, error } = useAppSelector((state) => state.road);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllRoads());
  }, [dispatch]);

  const userRoads = roads.filter((road) => road.userId === user?.id);

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
    navigate(`/road/${roadId}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мой кабинет</h1>
        <button
          onClick={() => navigate('/create-road')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Создать новый маршрут
        </button>
      </div>

      {userRoads.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          У вас пока нет созданных маршрутов
        </div>
      ) : (
        <div className="space-y-4">
          {userRoads.map((road) => (
            <div
              key={road.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleRoadClick(road.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {road.city}, {road.country}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Создан: {new Date(road.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleVisibility(road.id, road.visibility);
                  }}
                  className={
                    road.visibility === 'public'
                      ? 'bg-gray-300 px-3 py-1 rounded'
                      : 'border border-gray-500 px-3 py-1 rounded'
                  }
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
