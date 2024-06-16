import React, {useEffect, useState, useCallback, memo} from 'react';
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

const ItemStock = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/stock/');
      console.log('stock data:', response?.data?.stocks);
      setStockData(response?.data?.stocks);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      ToastAndroid.show('Error fetching stock data', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/stock/');
      setStockData(response?.data?.stocks);
    } catch (error) {
      console.error('Error refreshing stock data:', error);
      ToastAndroid.show('Error refreshing stock data', ToastAndroid.SHORT);
    } finally {
      setRefreshing(false);
    }
  };

  const deleteStock = async id => {
    try {
      await axios.delete(`http://10.0.2.2:5000/api/v1/stock/${id}`);
      ToastAndroid.show('Stock deleted successfully', ToastAndroid.SHORT);
      setStockData(stockData.filter(stock => stock._id !== id)); // Update state to reflect deletion
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Failed to delete stock', ToastAndroid.SHORT);
    }
  };

  const renderStockItem = useCallback(
    ({item}) => (
      <StockItem
        item={item}
        onDelete={() => deleteStock(item._id)}
        navigation={navigation}
      />
    ),
    [stockData],
  );

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Stock List"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <FlatList
        data={stockData}
        renderItem={renderStockItem}
        keyExtractor={item => item._id.toString()} // Ensure the key is a string
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text>No stock data found.</Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        // numColumns={2}
        initialNumToRender={10}
        windowSize={21}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        style={styles.floating}
        onPress={() => navigation.navigate('AddItemStock')}>
        <AntDesign name="plus" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const StockItem = memo(({item, onDelete, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddStock', {items: item})}
      style={styles.stockContainer}>
      <View style={styles.stockHeader}>
        <Text style={styles.stockTitle}>{item.productName}</Text>
        <TouchableOpacity onPress={onDelete}>
          <AntDesign name="delete" color={'red'} size={20} />
        </TouchableOpacity>
      </View>
      <Image
        source={item.productPhoto ? require('../../assets/user.png') : require('../../assets/img/contactless.jpg')}
        style={styles.stockImage}
      />
      <View style={styles.stockDetails}>
        <Text style={styles.stockDetail}>
          <Text style={styles.stockLabel}>Unit:</Text> {item.unit}
        </Text>
        <Text style={styles.stockDetail}>
          <Text style={styles.stockLabel}>Category:</Text> {item.category}
        </Text>
        <Text style={styles.stockDetail}>
          <Text style={styles.stockLabel}>Code:</Text> {item.productCode}
        </Text>
        <Text style={styles.stockDetail}>
          <Text style={styles.stockLabel}>Features:</Text>{' '}
          {item.productFeatures}
        </Text>
        <Text style={styles.stockDetail}>
          <Text style={styles.stockLabel}>Max Stock:</Text> {item.maximumStock}
        </Text>
        <Text style={styles.stockDetail}>
          <Text style={styles.stockLabel}>Min Stock:</Text> {item.minimumStock}
        </Text>
        <Text style={styles.stockDetail}>
          <Text style={styles.stockLabel}>Description:</Text> {item.description}
        </Text>
        <Text style={styles.stockDetail}>
          <Text style={styles.stockLabel}>Manufacturer:</Text>{' '}
          {item.manufacturer}
        </Text>
        <Text style={styles.stockDetail}>
          <Text style={styles.stockLabel}>HSN Code:</Text> {item.hsnCode}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default ItemStock;

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
  stockContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  stockImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  stockDetails: {
    marginTop: 10,
  },
  stockDetail: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  stockLabel: {
    fontWeight: 'bold',
    color: Colors.primary,
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
});
