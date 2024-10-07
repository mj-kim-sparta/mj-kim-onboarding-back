import { Inject, Injectable, Module } from "@nestjs/common";
import { IUserData } from "../../../user/application/port/out/IUserData";
import { UserData } from "../../../user/application/service/userData";
import * as bcrypt from 'bcrypt';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { secretKey } from './constants';
import { TokensDto } from "../port/in/tokensDto";
import { LoginDto, LoginResultDto } from "../port/in/loginDto";
import { AuthResult } from "../port/in/authResult";
@Module({
    imports: [JwtModule.register({
        secret: secretKey
    })],
    exports: [JwtModule]
})

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserData)
        private readonly userData: IUserData,
        private readonly jwtService: JwtService
    ) {};
    
    verifyUser = async (loginDto: LoginDto): Promise<LoginResultDto> => {
        const email = loginDto.email;
        const password = loginDto.password;
        if (!email) {
            return {result: "fail", message: "email please", tokens: null};
        }
        if (!password) {
            return {result: "fail", message: "password please", tokens: null};
        }
        // 이메일 포맷 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {result: "fail", message: "wrong email format", tokens: null};
        }
        // db에서 이메일 검색하고 password와 대조
        const user = await this.userData.findUser(email);
        if (user && bcrypt.compareSync(password, user.password)) {
            const accessTokenPayload = { "id": "1234567890" , "name": "user", "exp": Date.now() + 1000 * 60 * 30};
            const refreshTokenPayload = { "id": "1234567890" , "name": "user", "exp": Date.now() + 1000 * 60 * 60 * 24 };
            const accessToken = this.jwtService.sign(accessTokenPayload, {secret: secretKey});
            const refreshToken = this.jwtService.sign(refreshTokenPayload, {secret: secretKey});
            // console.log(accessToken);
            return {result: "success", message: "login success", tokens: new TokensDto(accessToken, refreshToken)};
        }
        else {
            return {result: "fail", message: "wrong email or password", tokens: null};
        }
    };

    verifyToken = (tokens: TokensDto) => {
        // 토큰 검증 로직
        try {
            const decodedAccessToken = this.jwtService.verify(tokens.accessToken, {secret: secretKey});
            if (decodedAccessToken.exp > Date.now()) {
                return {result: "success", message: "auth success"};
            }
        } catch (error) {
            return {result: "fail", message: "auth failed"};
        }
        // accessToken 만료시 refreshToken 검증
        try {
            const decodedRefreshToken = this.jwtService.verify(tokens.refreshToken, {secret: secretKey});
            if (decodedRefreshToken.exp > Date.now()) {
                const newAccessTokenPayload = { "id": "1234567890" , "name": "valid access token", "exp": Date.now() + 1000 * 60 * 30 };
                const newAccessToken = this.jwtService.sign(newAccessTokenPayload, {secret: secretKey});
                const newRefreshTokenPayload = { "id": "1234567890" , "name": "valid refresh token", "exp": Date.now() + 1000 * 60 * 60 * 24 };
                const newRefreshToken = this.jwtService.sign(newRefreshTokenPayload, {secret: secretKey});
                return {result: "success", message: "auth success", tokens: new TokensDto(newAccessToken, newRefreshToken)};
            }
        } catch (error) {
            return {result: "fail", message: "auth failed"};
        }
        return {result: "fail", message: "auth failed"};
    };

}