import styles from './SignInModal.module.css';
import { IUserSignInData, signInThunk } from '@/app/entities/user';
import { useAppDispatch } from '@/shared/hooks/reduxHooks';
import { useId, useState } from 'react';
import { useNavigate } from 'react-router';
import UserValidator from '../validation/UserValidator';
import { CLIENT_ROUTES } from '@/shared/enums/clientRoutes';

interface SignInModalProps {
  closeModal: () => void;
}

const INITIAL_INPUTS_DATA = {
  email: '',
  password: '',
};

export function SignInModal({ closeModal }: SignInModalProps) {
  const [inputs, setInputs] = useState<IUserSignInData>(INITIAL_INPUTS_DATA);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const emailInputId = useId();
  const passwordInputId = useId();

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { isValid, error } = UserValidator.validateSignIn(inputs);
    if (!isValid) return alert(error);
    try {
      const resultAction = await dispatch(signInThunk(inputs));
      if (resultAction.payload?.error) {
        alert('ошибка авторизации');
        return;
      }
      alert('вы успешно авторизованы');
      setInputs(INITIAL_INPUTS_DATA);
      navigate(CLIENT_ROUTES.MAIN); // поправь наигацию на страничку кабинета пользователя
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const { email, password } = inputs;

  return (
    <div className={styles.modal} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>вход в TRAVEL-PLAN</h2>
        <form className={styles.modalForm} onSubmit={onSubmitHandler}>
          <label htmlFor={emailInputId}>email:</label>
          <input
            type="email"
            name="email"
            placeholder="введите email"
            onChange={onChangeHandler}
            value={email}
            id={emailInputId}
            className={styles.modalInput}
          />

          <label htmlFor={passwordInputId}>пароль:</label>
          <input
            type="password"
            name="password"
            placeholder="введите пароль"
            onChange={onChangeHandler}
            value={password}
            id={passwordInputId}
            className={styles.modalInput}
          />

          <button
            className={styles.modalButton}
            type="submit"
            disabled={!email || !password}
          >
            войти
          </button>
        </form>

        <p className={styles.modalText}>
          Не зарегестрированы?
          <span
            className={styles.registerLink}
            onClick={() => {
              closeModal();
              navigate(CLIENT_ROUTES.SIGN_UP);
            }}
          >
            зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
}
