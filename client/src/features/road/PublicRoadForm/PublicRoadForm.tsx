import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { getAllRoads } from '@/app/entities/road/api';
import { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '@/shared/hooks/reduxHooks';
import styles from '../../../widgets/MyRoads/MyRoads.module.css';
import { useNavigate } from 'react-router';
import { SignInModal } from '@/features/auth/SignInModal/SignInModal';
export default function PublicRoadForm() {
  const dispatch = useAppDispatch();
  const allPublicRoads = useAppSelector((state) =>
    state.road.roads.filter((road) => road.visibility === 'public'),
  );
  const user = useAppSelector((state) => state.user.user);

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  

  useEffect(() => {
    dispatch(getAllRoads());
  }, [dispatch]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);


  return (
    <div>
      {
        <div className={styles.roadList}>
          {allPublicRoads.map((road) => (
            <div
              key={road.id}
              className={styles.roadItem}
              onClick={user ? () => navigate(`/cabinet/road/${road.id}`) : openModal}
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
              </div>
            </div>
          ))}
        </div>
      }
      {isModalOpen && <SignInModal closeModal={closeModal} />}
    </div>
  );
}
