import { Button, Empty, Form, Input, Modal, Table } from "antd"
import { useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";

interface AuctionInfos {
    auctionEndDate: string;
    auctionStartDate: string;
    brand: string;
    creatorId: string;
    id: string;
    model: string;
    startingBid: number;
    year: number;
}

const TableAuctions = ({ auctions }: any) => {
    const [showBidModal, setShowBidModal] = useState<boolean>(false);
    const [infosAuctionBidModal, setInfosAuctionBidModal] = useState<AuctionInfos | any>();
    const [auctionToBid, setAuctionToBid] = useState<string>('');
    const [bidAmountUser, setBidAmountUser] = useState<number>(0);
    
    const columns = [
        { title: 'Marca', dataIndex: 'brand', key: 'brand' },
        { title: 'Modelo', dataIndex: 'model', key: 'model' },
        { title: 'Ano', dataIndex: 'year', key: 'year' },
        {
            title: 'Data Inicial', dataIndex: 'auctionStartDate', key: 'auctionStartDate',
            render: (isoDate: string) => {
                return <>{new Date(isoDate).toISOString().split('T')[0].replace(/-/g, '/')}</>
            }
        },
        {
            title: 'Data Final', dataIndex: 'auctionEndDate', key: 'auctionEndDate',
            render: (isoDate: string) => {
                return <>{new Date(isoDate).toISOString().split('T')[0].replace(/-/g, '/')}</>
            }
        },
        {
            title: 'Criador',
            render: (infos: any) => {
                return <>{infos?.creator?.name}</>
            }
        },
        {
            title: 'Lance',
            render: (infos: any) => {
                return <Button onClick={() => {
                    getAllBidsForAuction(infos.id);
                    setAuctionToBid(infos.id);
                }}>
                    Ofertar
                </Button>
            }
        },
    ];

    const columnsBid = [
        { title: 'Oferta', dataIndex: 'amount', key: 'amount'},
        {
            title: 'Nome',
            render: (infos: any) => {
                return <>{infos.user.name}</>
            }
        }
    ]

    const getAllBidsForAuction = (id: string) => {
        api.get(`auction/bids/auction/${id}`)
        .then(({data}) => {
            setShowBidModal(true);
            setInfosAuctionBidModal(data);
        })
        .catch(({response}) => {
            toast.error(response?.data?.message, { autoClose: 1000 });
        });
    }

    const sendBidByUser = async () => {
        const user = await getUser();

        const bidInfos = {
            amount: bidAmountUser,
            userId: user.id,
            auctionId: auctionToBid
        };

        api.post(`/auction/bid`, bidInfos)
        .then(({data}) => {
            getAllBidsForAuction(auctionToBid);
        })
        .catch(({response}) => {
            toast.error(response?.data?.message, { autoClose: 1000 });
        });
    }

    const getUser = async () => {
        const user = localStorage.getItem('user');
        if(!user) return;
        let userInfos = JSON.parse(user);

        await api.get(`auction/finduser/${userInfos.email}`)
        .then(({data}) => {
            userInfos = data;
        })
        .catch(({response}) => {
            toast.error(response?.data?.message, { autoClose: 1000 });
        });

        return userInfos;
    }

    return (
        <>
            <div className="overflow-x-auto scrollbar-hidden">
                <Table
                    dataSource={auctions}
                    rowKey="id"
                    columns={columns}
                    size="middle"
                    pagination={{
                        pageSize: 10,
                        position: ['bottomLeft'],
                        className: 'number-pagination'
                    }}
                    rowClassName="radiusRow"
                    showSorterTooltip={false}
                    style={{ width: '100%' }}
                    locale={{
                        emptyText: <Empty description='Sem dados' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }}
                />
            </div>

            <Modal
                title={(<div>Ofertar</div>)}
                open={showBidModal}
                width={1000}
                onCancel={() => setShowBidModal(false)}
                footer={false}
            >
                <div className="flex gap-2">
                    <Form.Item className="w-1/2">
                        <Input
                            type="number"
                            placeholder='insira a sua oferta'
                            className='middle-input'
                            onChange={({target}) => setBidAmountUser(Number(target.value))}
                        />
                    </Form.Item>
                    <Button
                        className="mr-2 ml-2"
                        onClick={() => sendBidByUser()}
                    >
                        Enviar oferta
                    </Button>
                </div>
                <h1>Ofertas Totais:</h1>
                <Table
                    dataSource={infosAuctionBidModal}
                    rowKey="id"
                    columns={columnsBid}
                    size="middle"
                    pagination={{
                        pageSize: 10,
                        position: ['bottomLeft'],
                        className: 'number-pagination'
                    }}
                    rowClassName="radiusRow"
                    showSorterTooltip={false}
                    style={{ width: '100%' }}
                    locale={{
                        emptyText: <Empty description='Sem dados' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }}
                />
            </Modal>
        </>
    )
}

export default TableAuctions;