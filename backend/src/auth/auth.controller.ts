import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from './dto/auth.dto';
import { Response } from 'express';
import { HTTPExceptionHandler } from 'src/exception/httpExceptions';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('create')
    async create(
        @Body() createUserDto: CreateUserDto,
        @Res() res: Response
    ) {
        try {
            const newUser = await this.authService.createUser(createUserDto);
            return res.send(newUser);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @Post('login')
    async login(
        @Body() authDto: AuthDto,
        @Res() res: Response
    ) {
        try {
            const loginUser = await this.authService.signIn(authDto);
            return res.send(loginUser);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

}
