export interface IUserSignInData {
  email: string;
  password: string;
}

export interface IUserSignUpData extends IUserSignInData {
  username: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  isEmailConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponseData extends IUser {
  accessToken: string;
  user: IUser;
}

export interface IResetPasswordData {
  token: string;
  newPassword: string;
}
