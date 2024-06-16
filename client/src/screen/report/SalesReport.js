import { Dimensions, ScrollView, StyleSheet, Text, ToastAndroid, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../../component/CustomHeader';
import CustomDropdown from '../../component/CustomDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../constant/Colors';
import { DrawerActions } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import axios from 'axios';

const { height } = Dimensions.get('window');
const monthData = [
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'June' },
  { label: 'July', value: 'July' },
  { label: 'August', value: 'August' },
  { label: 'September', value: 'September' },
  { label: 'October', value: 'October' },
  { label: 'November', value: 'November' },
  { label: 'December', value: 'December' },
];

const SalesReport = ({ navigation }) => {
  const [selectMonth, setSelectMonth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/cashDrawer/getCashDrawer');
      // console.log('cash report data:', response?.data);
      setSales(response?.data?.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      ToastAndroid.show('Error fetching sales', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // console.log("sales report 123 : ", sales)
  const renderSalesItem = ({ item }) => (
    <DataTable.Row>
      <DataTable.Cell>{item.date}</DataTable.Cell>
      <DataTable.Cell>{item.customerName}</DataTable.Cell>
      <DataTable.Cell>{item.productName}</DataTable.Cell>
      <DataTable.Cell>{item.quantity}</DataTable.Cell>
    </DataTable.Row>
  );

  const getFilteredSales = () => {
    if (!selectMonth) return [];
    return sales.filter((item) => {
      const month = item.date.split('-')[1]; 
      return month === selectMonth.value;
    });
  };


  return (
    <View style={styles.container}>
      <CustomHeader
        title="Sales Report"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <CustomDropdown
        myStyles={{ borderWidth: 1, margin: 5, width: height / 1.7, marginTop: -20 }}
        data={monthData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        searchPlaceholder="Search..."
        value={selectMonth}
        onChange={item => {
          setSelectMonth(item);
        }}
        label={false}
        placeholder={
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
            <MaterialIcons name="add-business" color={'#000'} size={24} />
            <Text style={{ fontWeight: '500', paddingLeft: 10 }}>
              Select Month
            </Text>
          </View>
        }
      />
      <View style={styles.content}>
        <ScrollView style={styles.dataTableScroll}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Customer</DataTable.Title>
              <DataTable.Title>Product</DataTable.Title>
              <DataTable.Title>Quantity</DataTable.Title>
            </DataTable.Header>
            <FlatList
              data={sales}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSalesItem}
            />
            {/* <DataTable.Row>
              <DataTable.Cell>{selectMonth ? selectMonth : 'Select Month'}</DataTable.Cell>
              <DataTable.Cell>John Doe</DataTable.Cell>
              <DataTable.Cell>Product 1</DataTable.Cell>
              <DataTable.Cell>2</DataTable.Cell>
            </DataTable.Row> */}
          </DataTable>
        </ScrollView>
      </View>
    </View>
  );
};

export default SalesReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backColor,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  dataTableScroll: {
    height: height - 200,
    marginBottom: 20,
    backgroundColor: 'deepskyblue',
    borderRadius: 5,
  },
});
