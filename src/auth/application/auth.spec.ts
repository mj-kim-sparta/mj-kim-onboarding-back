import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./service/authService";
import { UserData } from "../../user/application/service/userData";
import { JwtService, JwtModule } from '@nestjs/jwt';
import { secretKey } from './service/constants';
import { TokensDto } from './port/in/tokensDto';
const tokenTypes = {
    validAccessToken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoidmFsaWQgYWNjZXNzIHRva2VuIiwiZXhwIjoxNzQzMDk1NDc3OTk5LCJpYXQiOjE3MjczMjc0Nzh9.mG3iWFpgYNxNFf28w_w3JckLPebOr_UaZ8DeqDep8qE",
    wrongAccessToken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoid3JvbmcgYWNjZXNzIHRva2VuIiwiZXhwIjoyMDAwMDAwMDAwfQ.QpEdRvEhTeMInX2Jvt8d3HLhyQ9bkWiPuHtyW0aN8IJ",
    expiredAccessToken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiZXhwaXJlZCBhY2Nlc3MgdG9rZW4iLCJleHAiOjE3MjcxNTg4ODk5NzV9.5f4-ePf80V6KY25M7AE_P3bIh5Q7a3d9t9tmR8fFxy8",
    validRefreshToken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoidmFsaWQgcmVmcmVzaCB0b2tlbiIsImV4cCI6MTcyNzM5NjM3NzMwNywiaWF0IjoxNzI3MzA5OTc3fQ.oIhtDvyI15_c5kvgDBEnlp6fhwUdIQyaKL4CzMjPQ6U",
    wrongRefreshToken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoid3JvbmcgcmVmcmVzaCB0b2tlbiIsImV4cCI6MjAwMDAwMDAwMH0.jFLkU_enx0C5WT2EPE2sABFaeRZN-eGM2ZNvWDaqUe5",
    expiredRefreshToken : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiZXhwaXJlZCByZWZyZXNoIHRva2VuIiwiZXhwIjoxNzI3MTU4ODg5OTc1fQ.uKsZI8wmykRAY_pU-XdRZVGMR8lAElZm0ItBS2CzMsY"
}
const wrongEmailFormat = ["wrong@format1", "wrong.format2", "wrong.format3@"];

class User {
    email: string;
    password: string;
    constructor(emailCond:number, passwordCond:number) {
        switch (emailCond) {
            case 0:
                this.email = undefined;
                break;
            case 1:
                this.email = wrongEmailFormat[0];
                break;
            case 2:
                this.email = wrongEmailFormat[1];
                break;
            case 3:
                this.email = wrongEmailFormat[1];
                break;
            case 4:
                this.email = "not@a.user";
                break;
            case 5:
                this.email = "a@real.user";
                break;
            default:
                break;
        }

        switch (passwordCond) {
            case 0:
                this.password = undefined;
                break;
            case 1:
                this.password = "wrongpassword";
                break;
            case 2:
                this.password = "rightpassword";
                break;
            default:
                break;
        }
    }
}

class Token {
    accessToken: string;
    refreshToken: string;
    constructor(accessTokenCond:number, refreshTokenCond:number) {
        switch (accessTokenCond) {
            case 0:
                this.accessToken = undefined;
                break;
            case 1:
                this.accessToken = tokenTypes.wrongAccessToken; //wrong token
                break;
            case 2:
                this.accessToken = tokenTypes.validAccessToken; //valid token
                break;
            case 3:
                this.accessToken = tokenTypes.expiredAccessToken; //expired token
                break;
            default:
                break;
        }
        switch (refreshTokenCond) {
            case 0:
                this.refreshToken = undefined;
                break;
            case 1:
                this.refreshToken = tokenTypes.wrongRefreshToken; //wrong token
                break;
            case 2:
                this.refreshToken = tokenTypes.validRefreshToken; //valid token
                break;
            case 3:
                this.refreshToken = tokenTypes.expiredRefreshToken; //expired token
                break;
            default:
                break;
        }
    }
}

let authService: AuthService;
let userData: UserData;
let token: TokensDto;

describe('인증 테스트', () => {
    beforeAll(async () => {

        // const mockUserData = {
        //     findUser: jest.fn()
        // }
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService, UserData, JwtService, Token
            ],
            imports: [JwtModule.register({
                secret: secretKey
            })]
        }).compile();
        authService = module.get<AuthService>(AuthService);
        userData = module.get<UserData>(UserData);
        token = module.get<Token>(Token);
    });
    describe('로그인', () => {
        const users = [...Array(18).keys()].map((i) => new User(Math.floor(i/3), i%3)); // 모든 경우의 수 생성
        users.forEach((user) => {
            if (user.email === "a@real.user" && user.password === "rightpassword") {
                it('이메일과 비밀번호가 모두 맞으면 accessToken, refreshToken을 반환한다.', async () => {
                    const res = await authService.verifyUser(user.email, user.password);
                    expect(res instanceof TokensDto).toBe(true);
                });
                return;
            }
            if (!user.email) {
                it('이메일 입력이 없으면 email please를 반환한다.', async () => {
                    const result = await authService.verifyUser(user.email, user.password);
                    expect(result).toBe("email please");
                });
                return;
            }
            if (!user.password) {
                it('비밀번호 입력이 없으면 password please를 반환한다.', async () => {
                    const result = await authService.verifyUser(user.email, user.password);
                    expect(result).toBe("password please");
                });
                return;
            }
            if (wrongEmailFormat.includes(user.email)) {
                it('이메일 형식이 올바르지 않으면 wrong email format을 반환한다.', async () => {
                    const result = await authService.verifyUser(user.email, user.password);
                    expect(result).toBe("wrong email format");
                });
                return;
            }
            else {
                it('이메일 혹은 비밀번호가 올바르지 않으면 wrong email or password를 반환한다.', async () => {
                    const result = await authService.verifyUser(user.email, user.password);
                    expect(result).toBe("wrong email or password");
                });
            }
        });
    });

    describe('토큰 검증', () => {
        const tokens = [...Array(16).keys()].map((i) => new Token(Math.floor(i/4), i%4)); // 모든 경우의 수 생성
        tokens.forEach((token) => {
            if (token.accessToken === tokenTypes.validAccessToken) {
                it('accessToken이 유효하면 auth success를 반환한다.', () => {
                    expect(authService.verifyToken(token)).toBe("auth success");
                });
                return;
            }
            if (token.accessToken === tokenTypes.expiredAccessToken) {
                describe('accessToken이 만료되었을 때', () => {
                    if (token.refreshToken === tokenTypes.validRefreshToken) {
                        it('refreshToken이 유효하면 token refresh를 반환한다.', () => {
                            const res = authService.verifyToken(token);
                            expect(res instanceof TokensDto).toBe(true);
                        });
                    }
                    else {
                        it('refreshToken이 만료되었거나 잘못되었으면 auth failed를 반환한다.', () => {
                            expect(authService.verifyToken(token)).toBe("auth failed");
                        });
                    }
                });
                return;
            }
            it('accessToken이 잘못된 경우 auth failed를 반환한다.', () => {
                expect(authService.verifyToken(token)).toBe("auth failed");
            });
        });
    });
});
