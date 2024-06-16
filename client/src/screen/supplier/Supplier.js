import React, {useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomHeader from '../../component/CustomHeader';
import {Colors} from '../../constant/Colors';

const Supplier = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSupplier();
  }, []);

  const fetchSupplier = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/supplier');
      console.log('Supplier data:', response?.data?.data);
      setSupplier(response?.data?.data);
    } catch (error) {
      console.error('Error fetching supplier:', error);
      ToastAndroid.show('Error fetching supplier', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSupplier = async id => {
    try {
      await axios.delete(`http://10.0.2.2:5000/api/v1/supplier/${id}`);
      ToastAndroid.show('Supplier deleted successfully', ToastAndroid.SHORT);
      setSupplier(prevSupplier => prevSupplier.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      ToastAndroid.show('Failed to delete supplier', ToastAndroid.SHORT);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSupplier().then(() => setRefreshing(false));
  }, [fetchSupplier]);

  const renderSupplierItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('AddCustomer', {items: item})}
        style={styles.categoryContainer}
      >
        <View
          style={[
            styles.rowContent,
            {backgroundColor: Colors.borderColor, padding: 5},
          ]}
        >
          <Text style={styles.categoryName}>{item.accountName}</Text>
          <TouchableOpacity onPress={() => deleteSupplier(item._id)}>
            <AntDesign name="delete" color={'red'} size={20} />
          </TouchableOpacity>
        </View>

        <View style={{padding: 8}}>
          <View style={styles.rowContent}>
            <Text style={styles.categoryName}>Bank Name</Text>
            <Text style={styles.cardText}>{item.bankName}</Text>
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.categoryName}>Address</Text>
            <Text style={styles.cardText}>{item.address}</Text>
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.categoryName}>IFSC Code</Text>
            <Text style={styles.cardText}>{item.ifscCode}</Text>
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.categoryName}>Opening Balance</Text>
            <Text style={styles.cardText}>{item.openingBalance}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  const renderFooter = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return null;
  }, [loading]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Supplier List"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <FlatList
        data={supplier}
        renderItem={renderSupplierItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text>No supplier found.</Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        numColumns={2}
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
        onPress={() => navigation.navigate('AddSupplier')}
      >
        <AntDesign name="plus" size={20} color={'#ffffff'} />
      </TouchableOpacity>
    </View>
  );
};

export default Supplier;

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
  categoryContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    margin: 5,
    // padding: 10,
    // alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  floating: {
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 70,
    backgroundColor: Colors.primary,
    borderRadius: 100,
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: 16,
  },
});
