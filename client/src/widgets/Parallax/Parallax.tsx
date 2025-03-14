import React, { useEffect, useRef } from 'react';
import styles from './Parallax.module.css'; 

//fghjk

const Parallax: React.FC = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (backgroundRef.current && foregroundRef.current) {
        // Двигаем фоновый слой медленнее
        backgroundRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
        // Двигаем передний слой быстрее
        foregroundRef.current.style.transform = `translateY(${scrollY * 0.8}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.parallaxcontainer}>
      <div ref={backgroundRef} className={styles.parallaxbackground}>
        {/* Фоновый контент */}
      </div>
      <div ref={foregroundRef} className={styles.parallaxforeground}>
        {/* Основной контент */}
        <div className="parallaxname">
          <h1 className="title">TravelPlan</h1>
          <p className="subtitle">Спланируй свое путешествие</p>
        </div>
      </div>
    </div>
  );
};

export default Parallax;