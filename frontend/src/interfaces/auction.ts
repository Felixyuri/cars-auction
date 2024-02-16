interface AuctionInfos {
    id?: string;
    brand: string;
    model: string;
    year: number;
    startingBid: number;
    auctionStartDate: string | Date;
    auctionEndDate: string | Date;
    creatorId: string;
    creator?: {
        name: string;
    };
}