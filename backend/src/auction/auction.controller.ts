import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuctionDto } from './dto/auction.dto';
import { Response } from 'express';
import { HTTPExceptionHandler } from 'src/exception/httpExceptions';

@Controller('auction')
export class AuctionController {
    constructor(private readonly auctionService: AuctionService) {}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async create(
        @Body() createAuctionDto: AuctionDto,
        @Res() res: Response
    ) {
        try {
            const newAuction = await this.auctionService.createAuction(createAuctionDto);
            return res.send(newAuction);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }
}
