import React from 'react';
import { Button, TextInput, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import api from '../api';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateAuction = ({ setNewAuctionCreated, onHide }: any) => {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data: any) => {
        const userInfos = await getUser();

        data.auctionStartDate = new Date().toISOString();
        data.startingBid = Number(data?.startingBid);
        data.year = Number(data?.year);

        if (userInfos) {
            await api.post('auction/create', { ...data, creatorId: userInfos.id })
                .then(({ data }) => {
                    setNewAuctionCreated(true);
                    onHide();
                    Toast.show({
                        type: 'success',
                        text1: 'Leilão criado com sucesso!',
                        visibilityTime: 4000,
                    });
                })
                .catch(({ response }) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Erro ao criar um leilão',
                        text2: response?.data?.message,
                        visibilityTime: 4000,
                    });
                });

        }
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
    }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View>
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.textInput}
                            label="Marca"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.brand}
                        />
                    )}
                    name="brand"
                    rules={{ required: 'Marca é obrigatória' }}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.textInput}
                            label="Modelo"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.model}
                        />
                    )}
                    name="model"
                    rules={{ required: 'Modelo é obrigatório' }}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.textInput}
                            label="Valor inicial"
                            keyboardType="numeric"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.startingBid}
                        />
                    )}
                    name="startingBid"
                    rules={{ required: 'Valor incial é obrigatório' }}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.textInput}
                            label="Ano"
                            onBlur={onBlur}
                            keyboardType="numeric"
                            onChangeText={onChange}
                            value={value}
                            error={!!errors.year}
                        />
                    )}
                    name="year"
                    rules={{ required: 'Ano é obrigatório' }}
                />

                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', margin: 10, alignItems: 'center' }}>
                            <Text>Data final do leilão:</Text>
                            <DateTimePicker
                                style={{ margin: 5 }}
                                testID="auctionEndDate"
                                value={value ? new Date(value) : new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    onBlur();
                                    onChange(selectedDate);
                                }}
                            />
                        </View>
                    )}
                    name="auctionEndDate"
                    rules={{ required: 'A data final é obrigatória' }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Button
                        mode="contained"
                        onPress={() => onHide()}
                        disabled={isSubmitting}
                        style={{ width: 200 }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        style={{ width: 200 }}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </Button>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    textInput: {
        margin: 10,
    }
});

export default CreateAuction;
