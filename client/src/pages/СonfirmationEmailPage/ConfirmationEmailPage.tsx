import { confirmEmailThunk, refreshTokensThunk } from '@/app/entities/user/api';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export function ConfirmationEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchFunction = async () => {
      try {
        await dispatch(confirmEmailThunk(token));
        await dispatch(refreshTokensThunk());
        setTimeout(() => {
          navigate(CLIENT_ROUTES.CABINET_PAGE);
        }, 1000);
      } catch (error) {
        console.error('Ошибка при подтверждении почты', error);
      }
    };

    fetchFunction();
  }, [token]);

  return <div>{token}</div>;
}
