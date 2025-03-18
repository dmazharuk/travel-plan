import styles from './SignInModal.module.css';
import {
  signInThunk,
  signUpThunk,
  recoverPasswordThunk,
  resetPasswordThunk,
} from '@/app/entities/user';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useEffect, useId, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
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
  resetToken: '',
  newPassword: '',
};

type FormMode = 'signIn' | 'signUp' | 'forgotPassword' | 'resetPassword';

export function SignInModal({ closeModal }: SignInModalProps) {
  const [formMode, setFormMode] = useState<FormMode>('signIn');
  const [inputs, setInputs] =
    useState<typeof INITIAL_INPUTS_DATA>(INITIAL_INPUTS_DATA);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const usernameInputId = useId();
  const emailInputId = useId();
  const passwordInputId = useId();
  const repeatPasswordInputId = useId();
  const newPasswordInputId = useId();
  const resetTokenInputId = useId();

  const [searchParams, setSearchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  useEffect(() => {
    if (resetToken) {
      setFormMode('resetPassword');
      setInputs((prev) => ({ ...prev, resetToken }));
    }
  }, [resetToken]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleFormSwitch = (mode: FormMode) => {
    setFormMode(mode);
    setInputs(INITIAL_INPUTS_DATA);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = UserValidator.validateEmail(inputs.email);
    if (!isValid) {
      return dispatch(
        showAlert({ message: 'Ошибка валидации', status: 'mistake' })
      );
    }

    try {
      await dispatch(recoverPasswordThunk(inputs.email));
      dispatch(
        showAlert({
          message: 'Инструкции по сбросу пароля отправлены на email',
          status: 'success',
        })
      );
      setFormMode('signIn');
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = UserValidator.validatePassword(inputs.newPassword);

    if (!isValid) {
      return dispatch(
        showAlert({ message: 'ошибка валидации', status: 'mistake' })
      );
    }

    try {
      await dispatch(resetPasswordThunk(inputs.newPassword));

      dispatch(
        showAlert({
          message: 'Пароль успешно изменен!',
          status: 'success',
        })
      );

      // Очищаем параметр token из URL
      searchParams.delete('token');
      setSearchParams(searchParams);

      setFormMode('signIn');
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formMode === 'signUp') {
      const { error } = UserValidator.validateSignUp(inputs);
      if (error) {
        return dispatch(showAlert({ message: error, status: 'mistake' }));
      }

      if (inputs.password !== inputs.repeatPassword) {
        return dispatch(
          showAlert({ message: 'Пароли не совпадают', status: 'mistake' })
        );
      }
    }

    if (formMode === 'signIn') {
      const { error } = UserValidator.validateSignIn(inputs);
      if (error) {
        return dispatch(showAlert({ message: error, status: 'mistake' }));
      }
    }

    try {
      let resultAction;
      if (formMode === 'signUp') {
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
          showAlert({ message: 'Ошибка авторизации', status: 'mistake' })
        );
      }

      dispatch(
        showAlert({ message: 'Вы успешно авторизованы', status: 'success' })
      );
      setInputs(INITIAL_INPUTS_DATA);
      navigate(CLIENT_ROUTES.CABINET_PAGE);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    // Очищаем токен при закрытии модалки
    if (resetToken) {
      searchParams.delete('token');
      setSearchParams(searchParams);
    }
    closeModal();
  };

  const renderFormContent = () => {
    switch (formMode) {
      case 'signUp':
        return (
          <>
            <h2>Регистрация в Travel-Plan</h2>
            <form className={styles.modalForm} onSubmit={onSubmitHandler}>
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

              <button
                className={styles.modalButton}
                type="submit"
                disabled={
                  !inputs.email ||
                  !inputs.password ||
                  !inputs.username ||
                  inputs.password !== inputs.repeatPassword
                }
              >
                Зарегистрироваться
              </button>
            </form>
          </>
        );

      case 'forgotPassword':
        return (
          <>
            <h2>Восстановление пароля</h2>
            <form className={styles.modalForm} onSubmit={handleForgotPassword}>
              <label htmlFor={emailInputId}>Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Введите ваш email"
                onChange={onChangeHandler}
                value={inputs.email}
                id={emailInputId}
                className={styles.modalInput}
              />

              <button
                className={styles.modalButton}
                type="submit"
                disabled={!inputs.email}
              >
                Отправить инструкции
              </button>
            </form>
          </>
        );

      case 'resetPassword':
        return (
          <>
            <h2>Сброс пароля</h2>
            <form className={styles.modalForm} onSubmit={handlePasswordReset}>
              <label htmlFor={resetTokenInputId}>Код подтверждения:</label>
              <input
                type="text"
                name="resetToken"
                placeholder="Введите код из письма"
                onChange={onChangeHandler}
                value={inputs.resetToken}
                id={resetTokenInputId}
                className={styles.modalInput}
              />

              <label htmlFor={newPasswordInputId}>Новый пароль:</label>
              <input
                type="password"
                name="newPassword"
                placeholder="Введите новый пароль"
                onChange={onChangeHandler}
                value={inputs.newPassword}
                id={newPasswordInputId}
                className={styles.modalInput}
              />

              <button
                className={styles.modalButton}
                type="submit"
                disabled={!inputs.resetToken || !inputs.newPassword}
              >
                Сбросить пароль
              </button>
            </form>
          </>
        );

      default: // signIn
        return (
          <>
            <h2>Вход в Travel-Plan</h2>
            <form className={styles.modalForm} onSubmit={onSubmitHandler}>
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

              <button
                className={styles.modalButton}
                type="submit"
                disabled={!inputs.email || !inputs.password}
              >
                Войти
              </button>
            </form>
          </>
        );
    }
  };

  const renderFooterLinks = () => {
    switch (formMode) {
      case 'signUp':
        return (
          <p className={styles.modalText}>
            Уже зарегистрированы?{' '}
            <span
              className={styles.registerLink}
              onClick={() => handleFormSwitch('signIn')}
            >
              Войти
            </span>
          </p>
        );

      case 'forgotPassword':
        return (
          <p className={styles.modalText}>
            Вспомнили пароль?{' '}
            <span
              className={styles.registerLink}
              onClick={() => handleFormSwitch('signIn')}
            >
              Войти
            </span>
          </p>
        );

      case 'resetPassword':
        return null;

      default: // signIn
        return (
          <>
            <p className={styles.modalText}>
              Нет аккаунта?{' '}
              <span
                className={styles.registerLink}
                onClick={() => handleFormSwitch('signUp')}
              >
                Зарегистрироваться
              </span>
            </p>
            <p className={styles.modalText}>
              <span
                className={styles.registerLink}
                onClick={() => handleFormSwitch('forgotPassword')}
              >
                Забыли пароль?
              </span>
            </p>
          </>
        );
    }
  };

  return (
    <div className={styles.modal} onClick={handleCloseModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {renderFormContent()}
        {renderFooterLinks()}
      </div>
    </div>
  );
}
