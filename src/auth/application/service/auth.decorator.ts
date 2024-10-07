import { Injectable, Module, createParamDecorator, Req, Request } from "@nestjs/common";
import { TokensDto } from "../port/in/tokensDto";
import { JwtService } from '@nestjs/jwt';
import { secretKey } from './constants';
import { AuthResult } from "../port/in/authResult";

export const Auth = createParamDecorator((data, ctx) => {
    const jwtService = new JwtService();
    const request = ctx.switchToHttp().getRequest();
    if (!request.headers.cookie) {
        return {result: "fail", message: "no cookies"};
    }
    const accessToken = request.headers.cookie.split("; ")[0].split("=")[1];
    const refreshToken = request.headers.cookie.split("; ")[1].split("=")[1];
    const tokens = new TokensDto(accessToken, refreshToken);
    console.log(tokens);
    try {
        const decodedAccessToken = jwtService.verify(tokens.accessToken, {secret: secretKey});
        if (decodedAccessToken.exp > Date.now()) {
            return {result: "success", message: decodedAccessToken.id};
        }
    } catch (error) {
        return {result: "fail", message: "auth failed"};
    }
    // accessToken 만료시 refreshToken 검증
    try {
        const decodedRefreshToken = jwtService.verify(tokens.refreshToken, {secret: secretKey});
        if (decodedRefreshToken.exp > Date.now()) {
            const newAccessTokenPayload = { "id": "1234567890" , "name": "user", "exp": Date.now() + 1000 * 60 * 30 };
            const newAccessToken = jwtService.sign(newAccessTokenPayload, {secret: secretKey});
            const newRefreshTokenPayload = { "id": "1234567890" , "name": "user", "exp": Date.now() + 1000 * 60 * 60 * 24 };
            const newRefreshToken = jwtService.sign(newRefreshTokenPayload, {secret: secretKey});
            return {result: "success", message: "token refresh", tokens: new TokensDto(newAccessToken, newRefreshToken)};
        }
    } catch (error) {
        return {result: "fail", message: "auth failed"};
    }
    return {result: "fail", message: "auth failed"};
});