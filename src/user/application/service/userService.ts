import { Injectable, Inject } from "@nestjs/common";
import { IUserData } from "../port/out/IUserData";
import { UserData } from "./userData";
import * as bcrypt from 'bcrypt';
import { IUserService } from '../port/in/IUserService';
import { SignupDto, SignupResultDto } from '../port/in/signupDto';


@Injectable()
export class UserService implements IUserService {
    constructor(
        @Inject(UserData)
        private readonly userData: IUserData
    ) {};
    signup = async (signupDto: SignupDto): Promise<SignupResultDto> => {
        const { email, password } = signupDto;
        if (!email) {
            return {result: "fail", message: "email please"};
        }
        if (!password) {
            return {result: "fail", message: "password please"};
        }
        // 이메일 포맷 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {result: "fail", message: "wrong email format"};
        }
        // db에서 이메일 검색하고 password와 대조
        const user = await this.userData.findUser(email);
        if (user) {
            return {result: "fail", message: "email already exists"};
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        await this.userData.createUser(email, hashedPassword);
        return {result: "success", message: "signup success"};
    }
}