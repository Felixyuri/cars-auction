import React, { useState } from 'react';
import { Modal, Button, TextInput, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateBid = ({ onHide, auctionId, getAllBidsFromAuction, auctionDetails }: any) => {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data: any) => {
        const userInfos = await getUser();

        data.userId = userInfos.id;
        data.auctionId = auctionId;
        data.amount = Number(data.amount);

        await api.post('auction/bid', data)
            .then(async () => {
                await getAllBidsFromAuction(auctionId);
            })
            .catch(({ response }: any) => {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao enviar o lance',
                    text2: response?.data?.message,
                    visibilityTime: 4000,
                });
            })
    };

    const getUser = async () => {
        const user = await AsyncStorage.getItem('user');
        if (!user) return;
        let userInfos = JSON.parse(user);

        await api.get(`auction/finduser/${userInfos.email}`)
            .then(({ data }) => {
                userInfos = data;
            })
            .catch(({ response }) => {
                Toast.show({
                    type: 'error',
                    text1: 'Erro ao buscar um usuário',
                    text2: response?.data?.message,
                    visibilityTime: 4000,
                });
            });

        return userInfos;
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ margin: 10, paddingTop: 50 }}>
                <View>
                    <Text style={{ marginLeft: 10, fontWeight: '500' }}>Modelo: {auctionDetails.model}</Text>
                    <Text style={{ marginLeft: 10, fontWeight: '500' }}>Marca: {auctionDetails.brand}</Text>
                    <Text style={{ marginLeft: 10, fontWeight: '500' }}>Ano: {auctionDetails.year}</Text>
                    <Text style={{ marginLeft: 10, fontWeight: '500' }}>Valor incial: {auctionDetails.startingBid}</Text>
                </View>

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.textInput}
                            label="Lance"
                            onBlur={onBlur}
                            keyboardType="numeric"
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.amount}
                        />
                    )}
                    name="amount"
                    rules={{ required: 'Lance é obrigatório' }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button
                        mode="contained"
                        onPress={() => onHide(false)}
                        disabled={isSubmitting}
                        style={{ width: 170, backgroundColor: '#cf2929', marginRight: 10 }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        style={{ width: 170 }}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </Button>
                </View>

                <View style={{ margin: 10, paddingTop: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Lances do leilão:</Text>
                </View>
                <Toast />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    textInput: {
        margin: 10,
    }
});

export default CreateBid;
