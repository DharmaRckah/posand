import React, { useEffect, useState, useCallback } from 'react';
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
import { DrawerActions } from '@react-navigation/native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomHeader from '../../component/CustomHeader';
import { Colors } from '../../constant/Colors';

const Sales = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/sales/');
      console.log('Sales data:', response?.data);
      setSales(response?.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
      ToastAndroid.show('Error fetching sales', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteSales = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:5000/api/v1/sales/${id}`);
      ToastAndroid.show('Sales deleted successfully', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.log('Error deleting sales:', error);
      ToastAndroid.show('Failed to delete sales', ToastAndroid.SHORT);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSales();
  }, []);

  const renderSalesItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddSales', { items: item })}
      style={styles.salesContainer}
    >
      <View style={styles.rowHeader}>
        <Text style={styles.salesName}>Invoice No: {item.invoiceNo}</Text>
        <TouchableOpacity onPress={() => deleteSales(item._id)}>
          <AntDesign name="delete" color={'red'} size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.salesDetail}>Billing By: {item.billingBy}</Text>
        <Text style={styles.salesDetail}>Billing To: {item.billingTo}</Text>
        <Text style={styles.salesDetail}>Date: {item.date}</Text>
        <Text style={styles.salesDetail}>GSTIN: {item.gstIn}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Sales List"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
        onPressArrow={() => navigation.goBack()}
      />
      <FlatList
        data={sales}
        renderItem={renderSalesItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text>No sales found.</Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      />
      <TouchableOpacity
        style={styles.floating}
        onPress={() => navigation.navigate('AddSales')}
      >
        <AntDesign name="plus" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default Sales;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backColor,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  salesContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    margin: 5,
  },
  salesName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  salesDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  floating: {
    borderWidth: 1,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 100,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.borderColor,
    padding: 5,
  },
  detailsContainer: {
    padding: 5,
  },
});
