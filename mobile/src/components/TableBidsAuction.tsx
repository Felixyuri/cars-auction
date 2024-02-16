import { ScrollView, View } from "react-native";
import { DataTable, Text } from "react-native-paper";

const TableBidsAuction = ({ bids }: any) => {
    return (
        <>
            {bids?.length === 0 ? (
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#5b2d9c', opacity: 0.2 }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff' }}>Sem dados</Text>
                </View>
            ) : (
                <ScrollView horizontal>
                    <View style={{ flexDirection: 'row' }}>
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title style={{ width: 100 }}>Nome</DataTable.Title>
                                    <DataTable.Title style={{ width: 100 }}>Oferta</DataTable.Title>
                                </DataTable.Header>

                                {bids?.map((bid: any) => (
                                    <DataTable.Row key={bid.id}>
                                        <DataTable.Cell style={{ width: 100 }}>{bid?.user?.name}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100 }}>{bid?.amount}</DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                            </DataTable>
                        </ScrollView>
                    </View>
                </ScrollView>
            )}
        </>
    )
}

export default TableBidsAuction;