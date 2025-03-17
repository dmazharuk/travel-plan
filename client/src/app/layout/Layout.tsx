import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import Footer from '@/widgets/Footer/Footer';
import { Header } from '@/widgets/Header/Header';
import { JSX, useEffect } from 'react';
import { Outlet } from 'react-router';
import { refreshTokensThunk } from '../entities/user';
import { AlertContainer } from '@/features/alert/ui/AlertContainer';

export default function Layout(): JSX.Element {
  
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
