import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import Footer from '@/widgets/Footer/Footer';
import { Header } from '@/widgets/Header/Header';
import { JSX, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { refreshTokensThunk } from '../entities/user';
import { AlertContainer } from '@/features/alert/ui/AlertContainer';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';

export default function Layout(): JSX.Element {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === CLIENT_ROUTES.MAIN) {
      document.body.classList.add('mainPage');
    } else {
      document.body.classList.remove('mainPage');
    }
  }, [location.pathname]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(refreshTokensThunk());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <AlertContainer />
      <Outlet />
      <Footer />
    </div>
  );
}
