import { IUserSignUpData, signUpThunk } from '@/app/entities/user';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import UserValidator from '../validation/UserValidator';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';

const INITIAL_INPUTS_DATA = {
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
};

export function SignUpForm() {
  const [inputs, setInputs] = useState<IUserSignUpData & { repeatPassword: string }>(
    INITIAL_INPUTS_DATA,
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const globalError = useAppSelector((state) => state.user.error);

  const onChangeHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { isValid, error } = UserValidator.validateSignUp(inputs);
    if (!isValid) return alert(error);

    try {
      const resultAction = await dispatch(signUpThunk(inputs));
      if (resultAction.payload?.error) {
        alert('ошибка авторизации');
        return;
      }
      alert('вы вошли в приложение');
      setInputs(INITIAL_INPUTS_DATA);
      navigate(CLIENT_ROUTES.MAIN); // поменять на страницу пользователя
    } catch (error) {
      console.log(error);
    }
  };

  const { username, email, password, repeatPassword } = inputs;

  return (
    <form onSubmit={onSubmitHandler}>
      <input
        type="text"
        name="username"
        placeholder="введите имя"
        autoFocus
        onChange={onChangeHandler}
        value={username}
      />

      <input
        type="email"
        name="email"
        value={email}
        placeholder="введите email"
        autoFocus
        onChange={onChangeHandler}
      />

      <input
        type="password"
        name="password"
        value={password}
        placeholder="введите пароль"
        onChange={onChangeHandler}
        autoFocus
      />
      <input
        type="password"
        name="repeatPassword"
        placeholder="повторите ваш пароль"
        onChange={onChangeHandler}
        value={repeatPassword}
        autoFocus
      />
      <button
        type="submit"
        onClick={() => {
          navigate(CLIENT_ROUTES.MAIN);
        }}
      >
        регистрация
      </button>
    </form>
  );
}
