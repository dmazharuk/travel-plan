import { JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { MainPage, NotFoundPage } from '@/pages';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import Layout from '../layout/Layout';
import {SignUpPage} from '@/pages/SignUpPage/SignUpPage';
import { WelcomePage } from '@/pages/WelcomePage/WelcomePage';

export default function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={CLIENT_ROUTES.MAIN} element={<Layout />}>
          <Route path={CLIENT_ROUTES.MAIN} element={<MainPage />} />
          <Route path = {CLIENT_ROUTES.SIGN_UP} element = {<SignUpPage/>}/>
          <Route path = {CLIENT_ROUTES.WELCOME_PAGE} element = {<WelcomePage/>}/>
          <Route path={CLIENT_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
