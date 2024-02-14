import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from './dto/auth.dto';
import { Response } from 'express';
import { HTTPExceptionHandler } from 'src/exception/httpExceptions';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The creation of the user was completed successfully.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBody({ type: CreateUserDto })
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

    @ApiOperation({ summary: 'User login request' })
    @ApiResponse({ status: 200, description: 'User successfully logged.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiBody({ type: AuthDto })
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
