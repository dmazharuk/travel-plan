import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { showAlert } from '../alert';
import { Navigate, Outlet } from 'react-router';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { useEffect, useRef } from 'react';

export function ProtectedRoute() {
  const dispatch = useAppDispatch();

  const { user, isLoading } = useAppSelector((state) => state.user);
  const hasShowAlert = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      dispatch(
        showAlert({ message: 'Пожалуйста, авторизуйтесь', status: 'mistake' })
      );
      hasShowAlert.current = true;
    } else if (!user.isEmailConfirmed) {
      dispatch(
        showAlert({
          message: 'Пожалуйста, подтвердите ваш email',
          status: 'mistake',
        })
      );

      hasShowAlert.current = true;
    }
  }, [user, dispatch, isLoading]);

  if (isLoading) return;

  if (!user) {
    return <Navigate to={CLIENT_ROUTES.MAIN} />;
  }
  if (!user.isEmailConfirmed) {
    return <Navigate to={CLIENT_ROUTES.MAIN} />;
  }

  return <Outlet />;
}
