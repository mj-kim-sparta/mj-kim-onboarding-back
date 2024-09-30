import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserService } from '../../application/service/userService';
import { SignupDto } from '../../application/port/in/signupDto';

@ApiTags('유저 관련 API')
@Controller('/user')
export class UserController {
    constructor(private readonly authService: UserService) {}
    @Post('/signup')
    async signup(@Body() dto: SignupDto, @Res() res: Response) {
        const result = await this.authService.signup(dto);
        if (result.result === "success") {
            return res.send({
                ok: true
            });
        }
        else {
            return res.status(400).json({ message: result.message });
        }
    }
}