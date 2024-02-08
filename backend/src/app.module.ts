import { Module } from '@nestjs/common';
import { AuctionController } from './auction/auction.controller';
import { AuctionModule } from './auction/auction.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuctionService } from './auction/auction.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    AuctionModule,
    AuthModule,
    JwtModule,
    ConfigModule.forRoot({ isGlobal: true})
  ],
  controllers: [AuctionController, AuthController],
  providers: [
    AuctionService,
    AuthService,
    PrismaService,
    JwtService,
  ],
})
export class AppModule {}
