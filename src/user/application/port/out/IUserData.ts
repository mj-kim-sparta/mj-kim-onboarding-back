import { User } from "../../../domain/User";

export interface IUserData {
    findUser(email: string) /* :Promise<User> */;
    createUser(email: string, password: string);
  }