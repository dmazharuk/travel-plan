// import { IUser } from "../../user";

export interface ICompanion {
  id: number;
  username: string;
  email: string;
  User: {
    id: number;
    username: string;
    email: string;
  };
}

export type CompanionArrayType = ICompanion[];

