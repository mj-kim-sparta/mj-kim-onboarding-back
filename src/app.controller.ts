import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { AuthResult } from 'src/auth/application/port/in/authResult';
import { Auth } from 'src/auth/application/service/auth.decorator';
import { AuthService } from 'src/auth/application/service/authService';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


    // 로그인이 필요한 어떤 기능의 예시: 등록
  @Post('/apply')
  async apply(@Req() req: Request, @Res() res: Response, @Auth() auth: AuthResult) {
      if (auth.result === "success") {
          if (auth.tokens) {
              return res.send({
                  ok: true,
                  message: "등록 성공",
                  accessToken: auth.tokens.accessToken,
                  refreshToken: auth.tokens.refreshToken
              });
          }
          else {
              return res.send({
                  ok: true,
                  message: "등록 성공"
              });
          }
      }
      return res.status(401).json({
          ok: false,
          message: "로그인이 필요합니다."
      });
  }
}
