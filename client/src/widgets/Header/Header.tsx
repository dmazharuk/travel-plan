import { signOutThunk } from '@/app/entities/user';
import { SignInModal } from '@/features/auth/SignInModal/SignInModal';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { JSX, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import styles from './Header.module.css';

export function Header(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAppSelector((state) => state.user.user);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onSignOutHandler = async () => {
    dispatch(signOutThunk());
    alert('Вы вышли');
    navigate(CLIENT_ROUTES.WELCOME_PAGE);
  };

  return (
    <nav className={styles.container}>
      <NavLink to={CLIENT_ROUTES.WELCOME_PAGE}>Начало тут</NavLink>
      {user ? (
        <>
        <button onClick={onSignOutHandler}>Выйти</button>
        </>
      ) : (
        <>
        <button onClick={openModal}>Войти</button>
        </>
      )}

      {isModalOpen && <SignInModal closeModal={closeModal} />}
    </nav>
  );
}


