import { JSX, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Parallax from '@/widgets/Parallax/Parallax';
import styles from './WelcomePage.module.css';
import { useSearchParams } from 'react-router';
import { SignInModal } from '@/features/auth/SignInModal/SignInModal';
import { useNavigate } from 'react-router';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { CalendarWidget } from '@/widgets/CalendarWidget/CalendarWidget';
import { useAppSelector } from '@/shared/hooks/reduxHooks';

export function WelcomePage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  const linkVariants = (index: number) => ({
    hidden: {
      opacity: 0,
      x: index % 2 === 0 ? 100 : -100,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  });

  // история с календарем

  const handleConfirmDates = () => {
 
    if (user) {
      navigate(CLIENT_ROUTES.CREATE_ROAD_PAGE, {
        state: {
          startDate,
          endDate,
        },
      });
    } else {
      setIsModalOpen(true);
    }
  };

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    if (searchParams.get('token')) {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  return (
    <>
      <div>
        <Parallax setIsModalOpen={setIsModalOpen} />
        <div className={styles.underParallax}>
          <div className={styles.linkList}>
            <motion.div
              className={styles.linkItem}
              variants={linkVariants(1)} // Передаем индекс элемента
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} // Задержка зависит от индекса
              onClick={() => navigate(CLIENT_ROUTES.PUBLIC_ROADS_PAGE)}
              style={{ cursor: 'pointer' }}
              whileHover={{ scale: 1.03 }}
            >
              <div className={styles.linkCard}>
                {' '}
                <img className={styles.img} src="/div1.png" />
              </div>
              <div className={styles.linkCard}>
                {' '}
                Посмотреть готовые маршруты
              </div>
            </motion.div>

            <motion.div
              className={styles.linkItem}
              variants={linkVariants(2)} // Передаем индекс элемента
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 1 * 0.2, ease: 'easeOut' }} // Задержка зависит от индекса
              style={{ cursor: 'pointer' }}
              onClick={() =>
                user
                  ? navigate(CLIENT_ROUTES.CREATE_ROAD_PAGE)
                  : setIsModalOpen(true)
              }
              whileHover={{ scale: 1.03 }}
            >
              <div className={styles.linkCard}>
                {' '}
                <img className={styles.img} src="/div2.png" />
              </div>
              <div className={styles.linkCard}> Построить свой маршрут</div>
            </motion.div>

            <motion.div
              className={styles.linkItem}
              variants={linkVariants(3)} // Передаем индекс элемента
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.5, delay: 2 * 0.2, ease: 'easeOut' }} // Задержка зависит от индекса
              style={{ cursor: 'pointer' }}
              onClick={() => setIsCalendarOpen(true)}
              whileHover={{ scale: 1.03 }}
            >
              <div className={styles.linkCard}>
                {' '}
                <img className={styles.img} src="/div3.png" />
              </div>
              <div className={styles.linkCard}> Календарик путешествий</div>
            </motion.div>
            {isCalendarOpen && (
              <CalendarWidget
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                onClose={() => setIsCalendarOpen(false)}
                onConfirm={handleConfirmDates}
              />
            )}

            <motion.div
              className={styles.linkItem}
              variants={linkVariants(4)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.5, delay: 2 * 0.6, ease: 'easeOut' }}
              onClick={() =>
                user
                  ? navigate(CLIENT_ROUTES.CABINET_PAGE)
                  : setIsModalOpen(true)
              }
              style={{ cursor: 'pointer' }}
              whileHover={{ scale: 1.03 }}
            >
              <div className={styles.linkCard}>
                {' '}
                <img className={styles.img} src="/div5.jpg" />
              </div>
              <div className={styles.linkCard}> Планер для компании</div>
            </motion.div>
          </div>
        </div>
      </div>
      <div>
        {isModalOpen && (
          <SignInModal closeModal={() => setIsModalOpen(false)} />
        )}
      </div>
    </>
  );
}
