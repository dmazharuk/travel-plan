import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { showAlert } from "../alert";
import { Navigate, Outlet } from "react-router";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";


export function ProtectedRoute() {

  const {user} = useAppSelector(state => state.user);
  if(!user){
    showAlert({ message: 'Пожалуйста, авторизуйтесь', status: 'mistake' });
    return <Navigate to={CLIENT_ROUTES.MAIN} />}

if (!user.isEmailConfirmed){
  showAlert({ message: 'Пожалуйста, подтвердите ваш email', status: 'mistake' });
  return <Navigate to={CLIENT_ROUTES.MAIN} />}
  
  return <Outlet />
}
