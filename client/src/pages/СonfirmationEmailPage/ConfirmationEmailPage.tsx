import { confirmEmailThunk, refreshTokensThunk } from '@/app/entities/user/api';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './ConfirmationEmailPage.module.css';

export function ConfirmationEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFunction = async () => {
      try {
        await dispatch(confirmEmailThunk(token));
        await dispatch(refreshTokensThunk());
        setIsSuccess(true);
        setTimeout(() => {
          navigate(CLIENT_ROUTES.CABINET_PAGE);
        }, 3000);
      } catch (error) {
        console.error('Ошибка при подтверждении почты', error);
        setErrorMessage(
          'Не удалось подтвердить email. Ссылка устарела или недействительна.'
        );
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunction();
  }, [dispatch, navigate, token]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Подтверждение email</h1>

      {isLoading ? (
        <div className={styles.statusContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.message}>Идет подтверждение email...</p>
        </div>
      ) : isSuccess ? (
        <div className={styles.statusContainer}>
          <div className={`${styles.icon} ${styles.successIcon}`}></div>
          <p className={styles.message}>Email успешно подтвержден!</p>
          <p className={styles.redirectText}>
            Вы будете перенаправлены в личный кабинет...
          </p>
        </div>
      ) : (
        <div className={styles.statusContainer}>
          <div className={`${styles.icon} ${styles.errorIcon}`}></div>
          <p className={styles.message}>{errorMessage}</p>
          <button
            className={styles.button}
            onClick={() => navigate(CLIENT_ROUTES.SIGN_IN)}
          >
            Перейти на страницу входа
          </button>
        </div>
      )}
    </div>
  );
}
