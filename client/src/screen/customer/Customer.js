import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomHeader from '../../component/CustomHeader';
import {Colors} from '../../constant/Colors';

const Customer = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/customer/');
      console.log('Customer data:', response?.data?.data);
      setCustomer(response?.data?.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      ToastAndroid.show('Error fetching customer', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteCustomer = async id => {
    try {
      await axios.delete(`http://10.0.2.2:5000/api/v1/customer/${id}`);
      ToastAndroid.show('Customer deleted successfully', ToastAndroid.SHORT);
      // After successful deletion, re-fetch the customer list
      fetchCustomer();
    } catch (error) {
      console.log('Error deleting customer:', error);
      ToastAndroid.show('Failed to delete Customer', ToastAndroid.SHORT);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomer();
  };

  const renderCustomerItem = ({item}) => (
    <View style={styles.customerContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddCustomer', {items: item})}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: Colors.borderColor,
            padding:2
          }}>
          <Text style={styles.customerName}>{item.accountName}</Text>
          <TouchableOpacity onPress={() => deleteCustomer(item._id)} style={{}}>
            <AntDesign name="delete" color={'red'} size={20} />
          </TouchableOpacity>
        </View>
        <View style={{padding: 10}}>
          <Text style={styles.customerDetail}>Bank Name: {item.bankName}</Text>
          <Text style={styles.customerDetail}>Address: {item.address}</Text>
          <Text style={styles.customerDetail}>IFSC Code: {item.ifscCode}</Text>
          <Text style={styles.customerDetail}>
            Opening Balance: {item.openingBalance}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loader}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Customer"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <FlatList
        data={customer}
        renderItem={renderCustomerItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text>No customer found.</Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      />
      <TouchableOpacity
        style={styles.floating}
        onPress={() => {
          navigation.navigate('AddCustomer');
        }}>
        <AntDesign name="plus" size={20} color={'#ffffff'} />
      </TouchableOpacity>
    </View>
  );
};

export default Customer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backColor,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loader: {
    marginVertical: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    // padding: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customerDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  floating: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
