import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, CreateUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ErrorToThrowHandler } from 'src/exception/ERRORExceptions.handler';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {};

    async signIn(authDto: AuthDto) {
        try {
            const user_valid = await this.validateUser(authDto.email, authDto.password);

            if(!user_valid) {
                throw ErrorToThrowHandler({message: "User is invalid", status: HttpStatus.UNAUTHORIZED});
            }

            const token = this.jwtService.sign(
                { email: user_valid.email, sub: user_valid.id},
                { secret: process.env.SECRET_KEY}
                );
            return { access_token: token };
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    };
    
    async createUser(createUserDto: CreateUserDto) {
        try {
            const userExist = await this.getUser(createUserDto.email);
            if(userExist) {
                throw ErrorToThrowHandler({message: 'Duplicate user', status: HttpStatus.CONFLICT});
            }

            createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

            const userCreated = await this.prisma.user.create({
                data: createUserDto
            });

            return {...userCreated, password: undefined, id: undefined};
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    };

    async validateUser(email: string, password: string) {
        if(email && password) {
            const userExist = await this.getUser(email);
            
            if(userExist) {
                const comparePass = await bcrypt.compare(password, userExist.password);
                if(comparePass) return userExist;
            }
        }
        return undefined;
    }

    async getUser(email: string) {
        return this.prisma.user.findUnique({ where: { email }});
    };
}
