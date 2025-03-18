import React, { useEffect, useRef } from "react";
// import styles from "./MapViewer.module.css";
//for commit
//for commit


interface MapViewerProps {
  points: { coords: [number, number]; name: string; number: number }[];
}

const MapViewer: React.FC<MapViewerProps> = ({ points }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && window.ymaps) {
      const map = new window.ymaps.Map(mapRef.current, {
        center: points[0]?.coords || [55.76, 37.64],
        zoom: 10,
      });

      points.forEach((point) => {
        const placemark = new window.ymaps.Placemark(point.coords, {
          balloonContent: `Название: ${point.name}<br>Номер: ${point.number}`,
        });
        map.geoObjects.add(placemark);
      });
    }
  }, [points]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapViewer;