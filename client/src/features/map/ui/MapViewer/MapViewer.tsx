import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { getPathByRoadIdThunk } from "@/app/entities/path/api";
import { getCoordinatesByPathIdThunk } from "@/app/entities/coordinate/api";
import YandexMap from "../YandexMap/YandexMap";
// import YandexMap from "../YandexMap/YandexMap";
//
// interface RouteManagerProps {
//   pathId: number | null | undefined; // Добавляем pathId в пропсы
  
// }
//

interface MapManagerProps {
  roadId: number | null | undefined; // Добавляем pathId в пропсы
  
}


const MapViewer: React.FC<MapManagerProps>  = ({ roadId }) => {
  const dispatch = useAppDispatch();
  const path = useAppSelector((state) => state.path.path); // Получаем один path
  const coordinates = useAppSelector((state) => state.coordinate.coordinates);

    const [points, setPoints] = useState<{ coords: [number, number]; name: string; number: number }[]>([]);
    
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
      dispatch(getPathByRoadIdThunk(roadId));
    }
  }, [roadId, dispatch]);

  console.log('<<<<<<<<<>>>>>>>>>>>>>>>>>>>>.',  roadId);
  console.log('<<<!!!!!!!!!!!!!!!!!!!!!!!!!!>.',  path);
  // console.log('<<<!!!!))))))))))))))))))))!!>.',  path[0].id);
  

  // console.log('<(((((((((((((((()))))))))))))))))))!!>.',  path[0].roadId);

  console.log('>>>>>********************************>>>>>>.',  path?.id);

  // Получаем координаты по pathId
  useEffect(() => {
    if (path?.id) {
      dispatch(getCoordinatesByPathIdThunk(path.id));
    }
  }, [path, dispatch]);



  // console.log('Path:', path);
  console.log('Coordinates:', coordinates);
  
  // coordinates={coordinates}
  return (
    <div>
      <YandexMap points={points} onAddToRoute={handleAddToRoute} pathId={path?.id} />
      {coordinates.length > 0 ? (
        
        <div>
          <h3>Координаты маршрута:</h3>
          <ul>
            {coordinates.map((coord) => (
              <li key={coord.id}>
                {coord.coordinateTitle}: {coord.latitude}, {coord.longitude}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Координаты не найдены.</p>
      )}
    </div>
  );
};

export default MapViewer;