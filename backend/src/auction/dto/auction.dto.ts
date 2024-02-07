import { ApiProperty } from "@nestjs/swagger";

export class userDto {
    @ApiProperty({ description: "User's id"})
    id: string;

    @ApiProperty({ description: "User's name"})
    name: string;

    @ApiProperty({ description: "User's e-mail"})
    email: string;
}


export class AuctionDto {
    @ApiProperty({ description: "Auction's id"})
    id: string;

    @ApiProperty({ description: "Car brand"})
    brand: string;

    @ApiProperty({ description: "Model car"})
    model: string;

    @ApiProperty({ description: "First offer of the auction"})
    startingBid: number;

    @ApiProperty({ description: "Year of the car"})
    year: number;

    @ApiProperty({ description: "Start date of the auction"})
    auctionStartDate: Date;

    @ApiProperty({ description: "End date of the auction"})
    auctionEndDate: Date;

    @ApiProperty({ description: "Creator of the auction"})
    creatorId: string;
}

export class BidDto {
    @ApiProperty({ description: "Id of the bid"})
    id: string;

    @ApiProperty({ description: "Amount bid"})
    amount: number;

    @ApiProperty({ description: "User offert id"})
    userId: string;

    @ApiProperty({ description: "id of the offer linked to the auction"})
    auctionId: string;
}