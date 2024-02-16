import React, { useState } from 'react';
import { View, Text, ScrollView, Modal } from 'react-native';
import { Button, DataTable } from 'react-native-paper';
import { useTailwind } from 'tailwind-rn';
import CreateBid from './CreateBid';
import api from '../api';
import TableBidsAuction from './TableBidsAuction';

const TableAuctions = ({ auctions }: any) => {
    const [showBidModal, setShowBidModal] = useState(false);
    const [auctionToBid, setAuctionToBid] = useState('');
    const [infosAuctionBidModal, setInfosAuctionBidModal] = useState();
    const [auctionDetails, setAuctionDetails] = useState();
    const tailwind = useTailwind();

    const getAllBidsFromAuction = async (id: string) => {
        await api.get(`auction/bids/auction/${id}`)
            .then(({ data }) => {
                setShowBidModal(true);
                setInfosAuctionBidModal(data);
            })
    }

    return (
        <>
            {auctions?.length === 0 ? (
                <View style={tailwind('flex-1 justify-center items-center')}>
                    <Text style={tailwind('font-bold')}>Sem dados</Text>
                </View>
            ) : (
                <ScrollView horizontal>
                    <View style={{ flexDirection: 'row' }}>
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title style={{ width: 100 }}>Marca</DataTable.Title>
                                    <DataTable.Title style={{ width: 100 }}>Modelo</DataTable.Title>
                                    <DataTable.Title style={{ width: 80 }}>Ano</DataTable.Title>
                                    <DataTable.Title style={{ width: 120 }}>Inicio</DataTable.Title>
                                    <DataTable.Title style={{ width: 120 }}>Fim</DataTable.Title>
                                    <DataTable.Title style={{ width: 100 }}>Criador</DataTable.Title>
                                    <DataTable.Title style={{ width: 100 }}>Lance</DataTable.Title>
                                </DataTable.Header>

                                {auctions?.map((auction: any) => (
                                    <DataTable.Row key={auction.id}>
                                        <DataTable.Cell style={{ width: 100 }}>{auction.brand}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100 }}>{auction.model}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 80 }}>{auction.year}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 120 }}>{new Date(auction.auctionStartDate).toLocaleDateString('pt-BR')}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 120 }}>{new Date(auction.auctionEndDate).toLocaleDateString('pt-BR')}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100 }}>{auction.creator.name}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100 }}>
                                            <Button
                                                style={{ width: '80%' }}
                                                onPress={() => {
                                                    getAllBidsFromAuction(auction?.id);
                                                    setAuctionToBid(auction?.id);
                                                    setShowBidModal(true);
                                                    setAuctionDetails(auction);
                                                }}
                                            >
                                                Ofertar
                                            </Button>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                            </DataTable>
                        </ScrollView>
                    </View>
                </ScrollView>
            )}

            <Modal visible={showBidModal} onDismiss={() => setShowBidModal(false)}>
                <CreateBid
                    onHide={setShowBidModal}
                    auctionId={auctionToBid}
                    getAllBidsFromAuction={getAllBidsFromAuction}
                    auctionDetails={auctionDetails}
                />
                <TableBidsAuction bids={infosAuctionBidModal} />
            </Modal>
        </>
    );
};

export default TableAuctions;
