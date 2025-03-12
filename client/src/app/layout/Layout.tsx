import { Footer } from '@/widgets/Footer/Footer';
import { Header } from '@/widgets/Header/Header';
import { JSX } from 'react';
import { Outlet } from 'react-router';

export default function Layout(): JSX.Element {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
