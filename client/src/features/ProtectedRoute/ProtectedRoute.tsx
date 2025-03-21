import { useAppDispatch, useAppSelector } from '@/shared/hooks/reduxHooks';
import { showAlert } from '../alert';
import { Navigate, Outlet } from 'react-router';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { useEffect } from 'react';

export function ProtectedRoute() {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      dispatch(
        showAlert({ message: 'Пожалуйста, авторизуйтесь', status: 'mistake' })
      );
     
    } else if (!user.isEmailConfirmed) {
      dispatch(
        showAlert({
          message: 'Пожалуйста, подтвердите ваш email',
          status: 'mistake',
        })
      );
      
    }
  }, [user, dispatch]);

  if (!user) {
    return <Navigate to={CLIENT_ROUTES.MAIN} />;
   
      }
  if (!user.isEmailConfirmed) {
    return <Navigate to={CLIENT_ROUTES.MAIN} />;
  }

  return <Outlet />;
}
