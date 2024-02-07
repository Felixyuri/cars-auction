import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuctionDto } from './dto/auction.dto';

@Injectable()
export class AuctionService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {};

    async createAuction(auctionDto: AuctionDto) {
        return new Date;
        // if(
        //     auctionDto.auctionEndDate < new Date &&
        //     auctionDto.auctionStartDate > new Date
        // )
    }
}
