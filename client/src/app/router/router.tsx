import { JSX } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ConfirmationEmailPage, NotFoundPage } from '@/pages';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import Layout from '../layout/Layout';

import CabinetPage from '@/pages/CabinetPage/CabinetPage';
import { CreateRoadPage } from '@/pages/CreateRoadPage/CreateRoadPage';
import { WelcomePage } from '@/pages/WelcomePage/WelcomePage';
import { RoadDetailPage } from '@/pages/RoadDetailPage/RoadDetailPage';
import PublicRoadsPage from '@/pages/PublicRoadsPage/PublicRoadsPage';
import { ProtectedRoute } from '@/features/ProtectedRoute/ProtectedRoute';

//проверка на юзера

export default function Router(): JSX.Element {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path={CLIENT_ROUTES.MAIN} element={<Layout />}>
          <Route path={CLIENT_ROUTES.MAIN} element={<WelcomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path={CLIENT_ROUTES.CABINET_PAGE} element={<CabinetPage />} />
            <Route path={CLIENT_ROUTES.CREATE_ROAD_PAGE} element={<CreateRoadPage />} />
            <Route path={CLIENT_ROUTES.ROAD_DETAIL_PAGE} element={<RoadDetailPage />} />
          </Route>
          <Route path={CLIENT_ROUTES.СONF_EMAIL} element={<ConfirmationEmailPage />} />
          <Route path={CLIENT_ROUTES.PUBLIC_ROADS_PAGE} element={<PublicRoadsPage />} />
          <Route path={CLIENT_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
