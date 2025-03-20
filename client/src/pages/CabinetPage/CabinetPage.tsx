import { MyRoads } from '@/widgets/MyRoads/MyRoads';
import styles from './CabinetPage.module.css';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useNavigate } from 'react-router';
import { signOutThunk } from '@/app/entities/user';
import { showAlert } from '@/features/alert';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { Modal } from '@/shared/ui/Modal';
import { useState } from 'react';

export default function CabinetPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const onSignOutHandler = async () => {
    dispatch(signOutThunk());
    dispatch(showAlert({ message: 'Вы вышли', status: 'success' }));
    navigate(CLIENT_ROUTES.MAIN);
  };

  return (
    <div className={styles.main}>
      <MyRoads />
      <button
        className={styles.buttonOut}
        onClick={() => setIsLogoutModalOpen(true)}
      >
        Выйти из аккаунта
      </button>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Подтверждение выхода"
      >
        <div className={styles.modalContent}>
          <p>Вы точно хотите выйти из аккаунта?</p>
          <div className={styles.modalButtons}>
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className={styles.cancelButton}
            >
              Отмена
            </button>
            <button onClick={onSignOutHandler} className={styles.confirmButton}>
              Да, выйти
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
