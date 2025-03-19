// import React, { useEffect, useRef } from "react";
// // import styles from "./MapViewer.module.css";
// //for commit
// //for commit


// interface MapViewerProps {
//   points: { coords: [number, number]; coordinateTitle: string; coordinateNumber: number ; }[];
// }

// const MapViewer: React.FC<MapViewerProps> = ({ points }) => {
//   const mapRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (mapRef.current && window.ymaps) {
//       const map = new window.ymaps.Map(mapRef.current, {
//         center: points[0]?.coords || [55.76, 37.64],
//         zoom: 10,
//       });

//       points.forEach((point) => {
//         const placemark = new window.ymaps.Placemark(point.coords, {
//           balloonContent: `Название: ${point.coordinateTitle}<br>Номер: ${point.coordinateNumber}`,
//         });
//         map.geoObjects.add(placemark);
//       });
//     }
//   }, [points]);

//   return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
// };

// export default MapViewer;







// import React, { useEffect, useRef } from "react";
// import styles from "./MapViewer.module.css";

// interface MapViewerProps {
//   points: { coords: [number, number]; name: string; number: number }[];
// }

// const MapViewer: React.FC<MapViewerProps> = ({ points }) => {
//   const mapRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (mapRef.current && window.ymaps) {
//       const map = new window.ymaps.Map(mapRef.current, {
//         center: points[0]?.coords || [55.76, 37.64],
//         zoom: 10,
//       });

//       points.forEach((point) => {
//         const placemark = new window.ymaps.Placemark(point.coords, {
//           balloonContent: `Название: ${point.name}<br>Номер: ${point.number}`,
//         });
//         map.geoObjects.add(placemark);
//       });
//     }
//   }, [points]);

//   return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
// };

// export default MapViewer;





// import React, { useEffect, useState } from 'react';
// import YandexMap from '@/features/map/ui/YandexMap/YandexMap';
// import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
// import { getCoordinatesByPathId } from '@/app/entities/coordinate';

// interface MapViewerProps {
//   pathId: number | null;
// }

// const MapViewer: React.FC<MapViewerProps> = ({ pathId }) => {
//   const dispatch = useAppDispatch();
//   const coordinates = useAppSelector((state) => state.coordinate.coordinates);
//   const [points, setPoints] = useState<{ coords: [number, number]; name: string; number: number }[]>([]);

//   useEffect(() => {
//     if (pathId) {
//       dispatch(getCoordinatesByPathId(pathId));
//     }
//   }, [pathId, dispatch]);

//   useEffect(() => {
//     if (coordinates) {
//       const mappedPoints = coordinates.map((coord, index) => ({
//         coords: [coord.latitude, coord.longitude] as [number, number],
//         name: coord.coordinateTitle,
//         number: index + 1,
//       }));
//       setPoints(mappedPoints);
//     }
//   }, [coordinates]);

//   return (
//     <div>
//       <YandexMap points={points} pathId={pathId} />
//       <div>
//         <h2>Точки маршрута:</h2>
//         <ul>
//           {points.map((point, index) => (
//             <li key={index}>
//               <strong>{point.number}. {point.name}</strong>: {point.coords.join(', ')}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default MapViewer;









// import React, { useEffect, useState } from 'react';
// import YandexMap from '@/features/map/ui/YandexMap/YandexMap';
// import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
// import { getCoordinatesByPathId } from '@/app/entities/coordinate';
// import { getPathByRoadId } from '@/app/entities/path';

// interface MapViewerProps {
//   roadId: number | null; // Принимаем roadId вместо pathId
// }

// const MapViewer: React.FC<MapViewerProps> = ({ roadId }) => {
//   const dispatch = useAppDispatch();
//   const coordinates = useAppSelector((state) => state.coordinate.coordinates);
//   const paths = useAppSelector((state) => state.path.paths);
//   const [points, setPoints] = useState<{ coords: [number, number]; name: string; number: number }[]>([]);

//   // Получаем pathId по roadId
//   useEffect(() => {
//     if (roadId) {
//       dispatch(getPathByRoadId(roadId));
//     }
//   }, [roadId, dispatch]);

//   // Получаем координаты по pathId
//   useEffect(() => {
//     if (paths.length > 0) {
//       const pathId = paths[0].id; // Предполагаем, что у Road только один Path
//       dispatch(getCoordinatesByPathId(pathId));
//     }
//   }, [paths, dispatch]);

//   // Преобразуем координаты в точки для карты
//   useEffect(() => {
//     if (coordinates) {
//       const mappedPoints = coordinates.map((coord, index) => ({
//         coords: [coord.latitude, coord.longitude] as [number, number],
//         name: coord.coordinateTitle,
//         number: index + 1,
//       }));
//       setPoints(mappedPoints);
//     }
//   }, [coordinates]);

//   return (
//     <div>
//       <YandexMap points={points} pathId={paths.length > 0 ? paths[0].id : null} />
//       <div>
//         <h2>Точки маршрута:</h2>
//         <ul>
//           {points.map((point, index) => (
//             <li key={index}>
//               <strong>{point.number}. {point.name}</strong>: {point.coords.join(', ')}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default MapViewer;





// import React, { useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
// import { getPathByRoadIdThunk } from '@/app/entities/path/api';
// import { getCoordinatesByPathIdThunk } from '@/app/entities/coordinate/api';

// const MapViewer = ({ roadId }) => {
//   const dispatch = useAppDispatch();
//   const path = useAppSelector((state) => state.path.path);
//   const coordinates = useAppSelector((state) => state.coordinate.coordinates);

//   // Получаем Path по roadId
//   useEffect(() => {
//     if (roadId) {
//       dispatch(getPathByRoadIdThunk(roadId));
//     }
//   }, [roadId, dispatch]);

//   // Получаем координаты по pathId
//   useEffect(() => {
//     if (path?.id) {
//       dispatch(getCoordinatesByPathIdThunk(path.id));
//     }
//   }, [path, dispatch]);

//   return (
//     <div>
//       {/* Отображение карты и координат */}
//     </div>
//   );
// };

// export default MapViewer;






// import React, { useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
// import { getPathByRoadIdThunk } from '@/app/entities/path/api';
// import { getCoordinatesByPathIdThunk } from '@/app/entities/coordinate/api';

// const MapViewer = ({ roadId }) => {
//   const dispatch = useAppDispatch();
//   const path = useAppSelector((state) => state.path.path);
//   const coordinates = useAppSelector((state) => state.coordinate.coordinates);

//   // Получаем Path по roadId
//   useEffect(() => {
//     if (roadId) {
//       dispatch(getPathByRoadIdThunk(roadId));
//     }
//   }, [roadId, dispatch]);

//   // Получаем координаты по pathId
//   useEffect(() => {
//     if (path?.id) {
//       dispatch(getCoordinatesByPathIdThunk(path.id));
//     }
//   }, [path, dispatch]);

//   return (
//     <div>
//       {/* Отображение карты и координат */}
//     </div>
//   );
// };

// export default MapViewer;



import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHooks";
import { getPathByRoadIdThunk } from "@/app/entities/path/api";
import { getCoordinatesByPathIdThunk } from "@/app/entities/coordinate/api";
import YandexMap from "../YandexMap/YandexMap";
// import YandexMap from "../YandexMap/YandexMap";

interface RouteManagerProps {
  pathId: number | null | undefined; // Добавляем pathId в пропсы
  
}

const MapViewer: React.FC<RouteManagerProps>  = ({ roadId }) => {
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
  

  return (
    <div>
      <YandexMap points={points} onAddToRoute={handleAddToRoute} pathId={path?.id} coordinates={coordinates}/>
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