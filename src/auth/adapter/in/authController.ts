import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from '../../application/service/authService';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { TokensDto } from '../../application/port/in/tokensDto';
import { LoginDto } from 'src/auth/application/port/in/loginDto';
import { LogoutDto } from 'src/auth/application/port/in/logoutDto';
import { AuthResult } from 'src/auth/application/port/in/authResult';
import { Auth } from 'src/auth/application/service/auth.decorator';

@ApiTags('인증 관련 API')
@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('/login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        console.log("try login with", dto);
        const result = await this.authService.verifyUser(dto);
        if (result.result === "success") {
            console.log("login success");
            // res.cookie('accessToken', result.tokens.accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 });
            // res.cookie('refreshToken', result.tokens.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });
            return res.send({
                ok: true,
                message: "로그인 성공",
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken
            });
        }
        else {
            console.log("login failed", result.message);
            return res.status(401).json({ message: result.message });
        }
    }

    /*
    @Post('/logout')
    async logout(@Req() req: Request, @Res() res: Response, @Body() dto: LogoutDto, @Auth() auth: AuthResult) {
        let accessToken = "";
        let refreshToken ="";
        try {
            accessToken = req.cookies['accessToken'];
            refreshToken = req.cookies['refreshToken'];
        } catch (error) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // const auth = await this.authService.verifyToken(new TokensDto(accessToken, refreshToken));
        if (auth.result === "success") {
            res.cookie('accessToken', '', { httpOnly: true,  domain: ".spartacodingclub.kr", maxAge: 0 });
            res.cookie('refreshToken', '', { httpOnly: true,  domain: ".spartacodingclub.kr", maxAge: 0 });
            return res.send(); // whatever api result
        }
        return res.status(401).json({ message: "Invalid credentials" });
    }
    */
}
