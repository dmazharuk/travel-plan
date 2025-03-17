import React, { useState } from 'react';
import RouteManager from '@/features/map/ui/RouteManager/RouteManager';
import styles from './MapPage.module.css';

export const MapPage: React.FC = () => {
  const [isMapVisible, setIsMapVisible] = useState(false); // Создаем состояние для видимости карты

  const handleToggleMap = () => {
    setIsMapVisible((prev) => !prev); // Меняем состояние по клику на кнопку
  };

  return (
    <div className={styles.main}>
      <h1>Маршрут путешествия</h1>
      <button onClick={handleToggleMap}>
        {isMapVisible ? 'Скрыть карту' : 'Добавим карту?'}
      </button>
      {isMapVisible && <RouteManager />} {/* Условный рендеринг компонента */}
    </div>
  );
};

export default MapPage;
