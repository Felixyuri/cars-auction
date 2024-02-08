import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuctionDto, BidDto } from './dto/auction.dto';
import { ErrorToThrowHandler } from 'src/exception/ERRORExceptions.handler';

@Injectable()
export class AuctionService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {};

    async createAuction(auctionDto: AuctionDto) {
        try {
            const { auctionEndDate, auctionStartDate, startingBid } = auctionDto;
            if (auctionEndDate < new Date() && auctionStartDate < new Date() && auctionEndDate < auctionStartDate) {
                throw ErrorToThrowHandler({message: "Auction date is invalid", status: HttpStatus.BAD_REQUEST});
            }
            if(startingBid < 100) {
                throw ErrorToThrowHandler({message: "Enter a value greater than hundred for the bid", status: HttpStatus.BAD_REQUEST});
            }
            
            const auctionCreated = await this.prisma.auction.create({ data: auctionDto });
            return auctionCreated;
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    }

    async updateAuction(id: string, auctionDto: AuctionDto) {
        try {
            const { auctionEndDate, auctionStartDate, startingBid } = auctionDto;
            if (auctionEndDate < new Date() && auctionStartDate < new Date() && auctionEndDate < auctionStartDate) {
                throw ErrorToThrowHandler({message: "Auction date is invalid", status: HttpStatus.UNAUTHORIZED});
            }
            if(startingBid < 100) {
                throw ErrorToThrowHandler({message: "Enter a value greater than hundred for the bid", status: HttpStatus.UNAUTHORIZED});
            }

            const auction = await this.findOne(id);
            const auctionUpdated = await this.prisma.auction.update({
                where: { id: auction.id },
                data: auctionDto
            });
            return auctionUpdated;
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    }

    async findOne(id: string) {
        try {
            const auction = await this.prisma.auction.findUnique({where: {id}});
            if(!auction) {
                throw ErrorToThrowHandler({message: "Auction not found", status: HttpStatus.CONFLICT});
            }
            return auction;
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    }

    async findAll() {
        try {
            const auction = await this.prisma.auction.findMany({
                include: {
                    creator: {
                        select: { name: true }
                    }
                }
            });

            return auction;
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    }

    async findByUser(id: string) {
        try {
            const auction = await this.prisma.auction.findMany({
                where: { creatorId: id }
            });
            return auction;
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    }

    async remove(id: string) {
        try {
            const auctionExist = await this.findOne(id);
            const auctionDeleted = await this.prisma.auction.delete({
                where: { id: auctionExist.id}
            });
            return auctionDeleted;
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    }

    async createBid(bidDto: BidDto) {
        try {
            const auctionExist = await this.findOne(bidDto.auctionId);
            await this.validateAuctionAndBidDetails(auctionExist, bidDto);

            const createdBid = await this.prisma.bid.create({data: bidDto});
            return createdBid;
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    }
    
    async validateAuctionAndBidDetails(auctionDetails: AuctionDto, bidDetails: BidDto) {
        if (auctionDetails.creatorId === bidDetails.userId) throw ErrorToThrowHandler({message: "Bidder does not qualify", status: HttpStatus.BAD_REQUEST});
        if (auctionDetails.auctionEndDate < new Date() || auctionDetails.auctionStartDate > new Date()) throw ErrorToThrowHandler({message: "Bidding for this auction is currently closed", status: HttpStatus.BAD_REQUEST});
        if (bidDetails.amount <= auctionDetails.startingBid) throw ErrorToThrowHandler({message: "The bid must exceed the starting bid", status: HttpStatus.BAD_REQUEST});
        
        const highestBid = await this.findHighestBidByAuction(bidDetails.auctionId);
        if (highestBid && bidDetails.amount <= highestBid.amount) throw ErrorToThrowHandler({message: "The bid amount must surpass the current highest bid", status: HttpStatus.BAD_REQUEST});
    }

    async findHighestBidByAuction(id: string) {
        try {
            const auction = await this.findOne(id);
            const auctionHighestBidValue = await this.prisma.bid.findFirst({
                where: { auctionId: auction.id},
                orderBy: { amount: 'desc'}
            });
            return auctionHighestBidValue;
        } catch (error) {
            throw ErrorToThrowHandler(error);
        }
    }

    async updateBid(id: string, bidDto: BidDto) {
        const auctionExist = await this.findOne(id);
        await this.validateAuctionAndBidDetails(auctionExist, bidDto);
        const updatedBid = await this.prisma.bid.create({ data: bidDto });
        return updatedBid;
    }

    async findBidsUser(id: string) {
        const userExist = await this.prisma.user.findUnique({ where: {id}});
        if(!userExist) {
            throw ErrorToThrowHandler({message: "User not exist", status: HttpStatus.NOT_FOUND});
        }

        const bidsByUser = await this.prisma.bid.findMany({
            where: {userId: userExist.id}
        });
        return bidsByUser;
    }

    async findBid(id: string) {
        const bidExist = await this.prisma.bid.findUnique({
            where: { id }
        });
        if(!bidExist) {
            throw ErrorToThrowHandler({message: "Bid not exist", status: HttpStatus.NOT_FOUND});
        };
        return bidExist;
    }

    async findAllBidsAuction(id: string) {
        const auctionExist = await this.findOne(id);
        const bidsAuction = await this.prisma.bid.findMany({
            where: { auctionId: auctionExist.id },
            include: { user: {
                select: { name: true }
            }},
            orderBy: { amount: 'desc'}
        });

        return bidsAuction;
    }

    async findHighestAmount(id: string) {
        const auctionExist = await this.findOne(id);
        const highetsBidValue = await this.prisma.bid.findFirst({
            where: { auctionId: auctionExist.id},
            orderBy: { amount: 'desc'}
        });

        return highetsBidValue;
    }

    async findUserByEmail(email: string) {
        const userExist = await this.prisma.user.findUnique({ where: { email }});
        return {...userExist, password: undefined};
    }
}
