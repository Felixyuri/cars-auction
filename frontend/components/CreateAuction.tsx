import { Button, DatePicker, Form, Input, Modal } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../services/api";
import { toast } from "react-toastify";

const CreateAuction = ({showModal, setShowModal, setAllAuctions}: any) => {
    const { register, handleSubmit, formState: {isSubmitting}} = useForm();
    const [auctionData, setAuctionData] = useState<AuctionInfos>({
        brand: '',
        model: '',
        startingBid: 0,
        year: 2024,
        auctionStartDate: new Date().toISOString(),
        auctionEndDate: '',
        creatorId: ''
    });

    const handleCreate = async () => {
        const userInfos = await getUser();

        if(userInfos) {
            await api.post('auction/create', {...auctionData, creatorId: userInfos?.id})
            .then(({data}) => {
                setAllAuctions({...data, creator: { name: userInfos?.name }});
                setShowModal(false);
            })
            .catch(({response}) => {
                toast.error(response?.data?.message, { autoClose: 1000 });
            });
        }
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
        <Modal
            title={(<div>Criar leilão</div>)}
            open={showModal}
            width={1000}
            onCancel={() => setShowModal(false)}
            footer={false}
        >
            <form onSubmit={handleSubmit(handleCreate)} className="grid grid-cols-12 gap-4">
                <Form.Item className="col-span-4">
                    <label htmlFor="brand">Marca:</label>
                    <Input
                        id="brand"
                        name="brand"
                        type="text"
                        required
                        placeholder='insira a marca do veículo'
                        className='middle-input mt-1'
                        onChange={({target}) => setAuctionData({...auctionData, brand: target.value})}
                    />
                </Form.Item>

                <Form.Item className="col-span-4">
                    <label htmlFor="model">Modelo:</label>
                    <Input
                        type="text"
                        required
                        placeholder='insira o modelo do veículo'
                        className='middle-input mt-1'
                        onChange={({target}) => setAuctionData({...auctionData, model: target.value})}
                    />
                </Form.Item>

                <Form.Item className="col-span-4">
                    <label htmlFor="startingBid">Valor inicial:</label>
                    <Input
                        {...register('startingBid')}
                        type="number"
                        required
                        placeholder='insira o valor inicial do veículo'
                        className='middle-input mt-1'
                        onChange={({target}) => setAuctionData({...auctionData, startingBid: Number(target.value)})}
                    />
                </Form.Item>

                <Form.Item className="col-span-4">
                    <label htmlFor="year">Ano:</label>
                    <Input
                        {...register('year')}
                        type="number"
                        required
                        placeholder='insira o ano do veículo. Ex: 2024'
                        className='middle-input mt-1'
                        maxLength={4}
                        minLength={4}
                        max={2030}
                        min={1900}
                        onChange={({target}) => setAuctionData({...auctionData, year: Number(target.value)})}
                    />
                </Form.Item>

                <Form.Item className="col-span-4">
                    <label>Data de término do leilão:</label>
                    <DatePicker
                        className="w-full mt-1"
                        required
                        onChange={(date) => setAuctionData({...auctionData, auctionEndDate: date.toISOString()})}
                    />
                </Form.Item>

                <div className="col-span-12">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-1/4 float-end bg-slate-500 text-white rounded"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default CreateAuction;