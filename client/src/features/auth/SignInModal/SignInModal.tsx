import styles from './SignInModal.module.css';
import { signInThunk, signUpThunk } from '@/app/entities/user';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useId, useState } from 'react';
import { useNavigate } from 'react-router';
import UserValidator from '../validation/UserValidator';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';
import { showAlert } from '@/features/alert';

interface SignInModalProps {
  closeModal: () => void;
}

const INITIAL_INPUTS_DATA = {
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
};

export function SignInModal({ closeModal }: SignInModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [inputs, setInputs] =
    useState<typeof INITIAL_INPUTS_DATA>(INITIAL_INPUTS_DATA);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const usernameInputId = useId();
  const emailInputId = useId();
  const passwordInputId = useId();
  const repeatPasswordInputId = useId();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleFormSwitch = () => {
    setIsSignUp(!isSignUp);
    setInputs(INITIAL_INPUTS_DATA);
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignUp) {
      const { error } = UserValidator.validateSignUp(inputs);
      if (error) {
        return dispatch(showAlert({ message: error, status: 'mistake' }));
      }

      if (inputs.password !== inputs.repeatPassword) {
        return dispatch(
          showAlert({ message: 'Неверный пароль', status: 'mistake' })
        );
      }
    } else {
      const { error } = UserValidator.validateSignIn(inputs);
      if (error) {
        return dispatch(showAlert({ message: error, status: 'mistake' }));
      }
    }
    try {
      let resultAction;
      if (isSignUp) {
        const signUpData = {
          username: inputs.username,
          email: inputs.email,
          password: inputs.password,
        };
        resultAction = await dispatch(signUpThunk(signUpData));
      } else {
        const { email, password } = inputs;
        resultAction = await dispatch(signInThunk({ email, password }));
      }
      if (resultAction.payload?.error) {
        return dispatch(
          showAlert({ message: 'ошибка авторизации', status: 'mistake' })
        );
      }
      dispatch(
        showAlert({ message: 'вы успешно авторизованы', status: 'success' })
      );
      setInputs(INITIAL_INPUTS_DATA);
      navigate(CLIENT_ROUTES.CABINET_PAGE);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.modal} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{isSignUp ? 'Регистрация в Travel-Plan' : 'Вход в Travel-Plan'}</h2>

        <form className={styles.modalForm} onSubmit={onSubmitHandler}>
          {isSignUp && (
            <>
              <label htmlFor={usernameInputId}>Имя пользователя:</label>
              <input
                type="text"
                name="username"
                placeholder="Введите имя"
                onChange={onChangeHandler}
                value={inputs.username}
                id={usernameInputId}
                className={styles.modalInput}
              />
            </>
          )}

          <label htmlFor={emailInputId}>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Введите email"
            onChange={onChangeHandler}
            value={inputs.email}
            id={emailInputId}
            className={styles.modalInput}
          />

          <label htmlFor={passwordInputId}>Пароль:</label>
          <input
            type="password"
            name="password"
            placeholder="Введите пароль"
            onChange={onChangeHandler}
            value={inputs.password}
            id={passwordInputId}
            className={styles.modalInput}
          />

          {isSignUp && (
            <>
              <label htmlFor={repeatPasswordInputId}>Повторите пароль:</label>
              <input
                type="password"
                name="repeatPassword"
                placeholder="Повторите пароль"
                onChange={onChangeHandler}
                value={inputs.repeatPassword}
                id={repeatPasswordInputId}
                className={styles.modalInput}
              />
            </>
          )}

          <button
            className={styles.modalButton}
            type="submit"
            disabled={
              !inputs.email ||
              !inputs.password ||
              (isSignUp && !inputs.username)
            }
          >
            {isSignUp ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <p className={styles.modalText}>
          {isSignUp ? 'Уже зарегистрированы? ' : 'Не зарегистрированы? '}
          <span className={styles.registerLink} onClick={handleFormSwitch}>
            {isSignUp ? 'Войти' : 'Зарегистрироваться'}
          </span>
        </p>
      </div>
    </div>
  );
}
