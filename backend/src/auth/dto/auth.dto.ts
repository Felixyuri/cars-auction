import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ description: "User's e-mail" })
    email: string;

    @ApiProperty({ description: "User's name" })
    name: string;

    @ApiProperty({description: "User's password"})
    password: string;
}

export class AuthDto {
    @ApiProperty({description: "User's e-mail"})
    email: string;
    
    @ApiProperty({description: "User's password"})
    password: string;
}