import { useEffect, useRef } from 'react';
import styles from './Parallax.module.css';
import { useAppSelector } from '@/shared/hooks/reduxHooks';

type Props = {
  setIsModalOpen: (a: boolean) => void;
};

const Parallax = ({ setIsModalOpen }: Props) => {
  const user = useAppSelector((state) => state.user.user);
  const backgroundRef = useRef<HTMLVideoElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (backgroundRef.current && foregroundRef.current) {
        // Двигаем фоновый слой медленнее
        backgroundRef.current.style.transform = `translateY(${
          scrollY * 0.5
        }px)`;
        // Двигаем передний слой быстрее
        foregroundRef.current.style.transform = `translateY(${
          scrollY * 0.8
        }px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const randomVideo = `/videoMain/videoMain${Math.ceil(
    Math.random() * 10
  )}.mp4`;

  // '/videoMain/all.mp4';

  return (
    <div className={styles.parallaxcontainer}>
      <video
        ref={backgroundRef}
        className={styles.parallaxbackground}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={randomVideo} type="video/mp4" />
      </video>
      {/* Фоновый контент */}

      <div ref={foregroundRef} className={styles.parallaxforeground}>
        {/* Основной контент */}
        <div className={styles.parallaxname}>
          <h1 className={styles.title}>TravelPlan</h1>
          <p className={styles.subtitle}>Спланируй свое путешествие</p>
          {!user && (
            <button
              className={styles.button}
              onClick={() => setIsModalOpen(true)}
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Parallax;
