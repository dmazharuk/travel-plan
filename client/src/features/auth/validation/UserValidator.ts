// import { IUserSignInData, IUserSignUpData } from '@/entities/user';

import { IUserSignInData, IUserSignUpData } from "@/app/entities/user";

interface IUserSignUpValidateData extends IUserSignUpData {
  repeatPassword: string;
}

export default class UserValidator {
  static validateSignUp({
    username,
    email,
    password,
    repeatPassword,
  }: IUserSignUpValidateData) {
    if (
      !username ||
      username.trim().length === 0 ||
      typeof username !== 'string'
    ) {
      return {
        isValid: false,
        error: 'Username is required and must non-empty string',
      };
    }

    if (
      !email ||
      email.trim().length === 0 ||
      typeof email !== 'string' ||
      !this.validateEmail(email)
    ) {
      return {
        isValid: false,
        error:
          'Email is required and must non-empty string and must be valid email',
      };
    }

    if (
      !password ||
      password.trim().length === 0 ||
      typeof password !== 'string' ||
      !this.validatePassword(password)
    ) {
      return {
        isValid: false,
        error:
          'Password is required, must be a non-empty string, contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
      };
    }

    if (repeatPassword !== password) {
      return {
        isValid: false,
        error: "Passwords don't match",
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateSignIn({ email, password }: IUserSignInData) {
    if (!email || email.trim().length === 0 || typeof email !== 'string') {
      return {
        isValid: false,
        error: 'Email is required and must non-empty string.',
      };
    }

    if (
      !password ||
      password.trim().length === 0 ||
      typeof password !== 'string'
    ) {
      return {
        isValid: false,
        error: 'Password is required, must be a non-empty string.',
      };
    }

    return {
      isValid: true,
      error: null,
    };
  }

  static validateEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password: string) {
    // Регулярные выражения для проверки требований к паролю
    const hasUpperCase = /[A-Z]/; // Проверка на наличие заглавной буквы
    const hasLowerCase = /[a-z]/; // Проверка на наличие строчной буквы
    const hasNumbers = /\d/; // Проверка на наличие цифры
    const hasSpecialCharacters = /[!@#$%^&*()-,.?":{}|<>]/; // Проверка на наличие спецсимвола
    const isValidLength = password.length >= 8; // Проверка на минимальную длину

    // Проверка всех условий
    if (
      !hasUpperCase.test(password) ||
      !hasLowerCase.test(password) ||
      !hasNumbers.test(password) ||
      !hasSpecialCharacters.test(password) ||
      !isValidLength
    ) {
      return false; // Пароль не валиден
    } else {
      return true; // Пароль валиден
    }
  }
}
