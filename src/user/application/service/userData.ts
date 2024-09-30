import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/User';
import { IUserData } from '../port/out/IUserData';

@Injectable()
export class UserData implements IUserData {
    private users: User[] = [
        {
            email: "a@real.user",
            password: bcrypt.hashSync("rightpassword", 10)
        }
    ]
    findUser(email: string) {
        return this.users.find(user => user.email === email);
    }
    createUser(email: string, password: string) {
        this.users.push({ email, password });
    }
}   