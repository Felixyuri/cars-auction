import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Button, Modal } from 'react-native-paper';
import TableAuctions from '../../components/TableAuction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigation } from '../../../App';
import CreateAuction from '../../components/CreateAuction';
import api from '../../api';
import Toast from 'react-native-toast-message';

interface DashboardProps {
    navigation: StackNavigation
}

const menus = ['Dashboard'];

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
    const [showModalCreateAuction, setShowModalCreateAuction] = useState(false);
    const [allAuctions, setAllAuctions] = useState<any>();
    const [newAuctionCreatedStatus, setNewAuctionCreatedStatus] = useState(false);

    const signOut = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        navigation.navigate('Home');
    };

    const getAuctions = async () => {
        await api.get('auction')
            .then(({ data }) => {
                setAllAuctions(data);
            })
            .catch(({ response }) => {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao buscar os leilões',
                    text2: response?.data?.message,
                    visibilityTime: 4000,
                });
            })
    }

    useEffect(() => {
        if (newAuctionCreatedStatus) {
            getAuctions();
            setNewAuctionCreatedStatus(false);
        }
    }, [newAuctionCreatedStatus]);

    useEffect(() => {
        getAuctions();
    }, [])

    return (
        <View style={{ flex: 1, marginTop: 39 }}>
            {/* Header */}
            <View style={{ backgroundColor: '#2d3748', padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={{ uri: 'https://i.pinimg.com/474x/54/bc/10/54bc10948c957683d0a0e653422d9c7f.jpg' }}
                />
                <View style={{ flexDirection: 'row' }}>
                    {menus.map((item, index) => (
                        <TouchableOpacity key={index}>
                            <Text style={{ color: 'white', marginHorizontal: 10 }}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={signOut}>
                        <Text style={{ color: 'red', marginHorizontal: 10 }}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Auctions */}
            <View style={{ flex: 1, padding: 10 }}>
                <Button
                    mode="text"
                    style={{ width: 'auto', padding: 10, backgroundColor: '#321a5c', marginBottom: 10 }}
                    onPress={() => setShowModalCreateAuction(true)}
                >
                    <Text style={{ color: 'white' }}>Adicionar um novo leilão</Text>
                </Button>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Leilões ativos:</Text>
                <TableAuctions auctions={allAuctions} />
            </View>

            {/* Create Auction Modal */}
            <Modal
                visible={showModalCreateAuction}
                dismissable={false}
            >
                <CreateAuction
                    setNewAuctionCreated={setNewAuctionCreatedStatus}
                    onHide={() => setShowModalCreateAuction(false)}
                />
            </Modal>
        </View>
    );
};

export default Dashboard;
