import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { AuctionDto, BidDto } from './dto/auction.dto';
import { Response } from 'express';
import { HTTPExceptionHandler } from 'src/exception/httpExceptions';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auction')
@Controller('auction')
export class AuctionController {
    constructor(private readonly auctionService: AuctionService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new auction' })
    @ApiResponse({ status: 201, description: 'The creation of the auction was completed successfully.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBody({ type: AuctionDto })
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

    @ApiOperation({ summary: 'Update auction' })
    @ApiResponse({ status: 200, description: 'The auction was successfully modified.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBody({ type: AuctionDto })
    @ApiBearerAuth()
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateAuction: AuctionDto,
        @Res() res: Response
    ) {
        try {
            const updatedAuction = await this.auctionService.updateAuction(id, updateAuction);
            return res.send(updatedAuction);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Get all auctions' })
    @ApiResponse({ status: 200, description: 'The details of the auctions.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(
        @Res() res: Response
    ) {
        try {
            const auctionExist = await this.auctionService.findAll();
            return res.send(auctionExist);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Get one auction by id' })
    @ApiResponse({ status: 200, description: 'The details of the auction.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
            const auctionExist = await this.auctionService.findOne(id);
            return res.send(auctionExist);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Get one auction by user id' })
    @ApiResponse({ status: 200, description: 'The details of the auction.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBearerAuth()
    @Get('/user/:id')
    @UseGuards(JwtAuthGuard)
    async findOneByUser(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
            const auctionExist = await this.auctionService.findByUser(id);
            return res.send(auctionExist);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Delete one auction by id' })
    @ApiResponse({ status: 200, description: 'The auction has been deleted.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
            const auctionDeleted = await this.auctionService.remove(id);
            return res.send(auctionDeleted);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Create new bid' })
    @ApiResponse({ status: 200, description: 'The creation of the bid was completed successfully' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBody({ type: BidDto })
    @ApiBearerAuth()
    @Post('bid')
    @UseGuards(JwtAuthGuard)
    async createBid(
        @Body() createBid: BidDto,
        @Res() res: Response
    ) {
        try {
            const newBid = await this.auctionService.createBid(createBid);
            return res.send(newBid);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Update bid by id' })
    @ApiResponse({ status: 200, description: 'The bid was successfully modified.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBody({ type: BidDto })
    @ApiBearerAuth()
    @Patch('bid/:id')
    @UseGuards(JwtAuthGuard)
    async updateBid(
        @Param('id') id: string,
        @Body() updateBid: BidDto,
        @Res() res: Response
    ) {
        try {
            const bidUpdated = await this.auctionService.updateBid(id, updateBid);
            return res.send(bidUpdated);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Get all bids with user' })
    @ApiResponse({ status: 200, description: 'The details of the bids.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBearerAuth()
    @Get('bids/user/:id')
    @UseGuards(JwtAuthGuard)
    async findUserBids(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
            const bidsExist = await this.auctionService.findBidsUser(id);
            return res.send(bidsExist);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Get bid by id' })
    @ApiResponse({ status: 200, description: 'The details of the bid.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBearerAuth()
    @Get('bid/:id')
    @UseGuards(JwtAuthGuard)
    async findBid(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
            const bidExist = await this.auctionService.findBid(id);
            return res.send(bidExist);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Get all bids by auction id' })
    @ApiResponse({ status: 200, description: 'The details of the bid by auction id.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBearerAuth()
    @Get('bids/auction/:id')
    @UseGuards(JwtAuthGuard)
    async findAllBidsAuction(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
            const bidsExist = await this.auctionService.findAllBidsAuction(id);
            return res.send(bidsExist);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Get the highest bid at the auction' })
    @ApiResponse({ status: 200, description: 'The details of the highest bid by auction id.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBearerAuth()
    @Get('bid/highestAmount/:auctionId')
    @UseGuards(JwtAuthGuard)
    async findHighestAmount(
        @Param('auctionId') id: string,
        @Res() res: Response
    ) {
        try {
            const bidExist = await this.auctionService.findHighestAmount(id);
            return res.send(bidExist);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }

    @ApiOperation({ summary: 'Get user by email' })
    @ApiResponse({ status: 200, description: 'The details of the user by email.' })
    @ApiResponse({ status: 403, description: 'Access to the resource forbidden.' })
    @ApiBearerAuth()
    @Get('finduser/:email')
    @UseGuards(JwtAuthGuard)
    async findUserByEmail(
        @Param('email') email: string,
        @Res() res: Response
    ) {
        try {
            const userExist = await this.auctionService.findUserByEmail(email);
            return res.send(userExist);
        } catch (error) {
            throw new HTTPExceptionHandler(error);
        }
    }
}
