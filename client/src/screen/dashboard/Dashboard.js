import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../component/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { Colors } from '../../constant/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectIsInCart } from '../../redux/ProductSlice';
import axios from 'axios';

const Dashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const totalCartItems = useSelector(state => state.product.totalCartItems);
  const cartItems = useSelector(state => state.product.cart);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleAddToCart = item => {
    dispatch(
      addToCart({ id: item._id, name: item.batchNo, price: parseFloat(item.mrp) }),
    );
  };

  const renderItem = ({ item }) => {
    const isInCart = selectIsInCart({ product: { cart: cartItems } }, item._id);
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('DetailProduct', item)}
          style={styles.touchableContainer}>
          <Image
            source={item.productPhoto ? require('../../assets/user.png') : require('../../assets/img/contactless.jpg')}
            style={styles.itemImage}
          />
          <Text style={styles.itemTitle}>{item.batchNo}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemDescription}>Rs. {item.mrp}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleAddToCart(item)}
          style={[styles.button, isInCart && styles.buttonAdded]}>
          <Text style={styles.buttonText}>
            {isInCart ? 'Added' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title={'Dashboard'}
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <FlatList
        data={stockData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('AddToCart')}>
        <View>
          <Text style={styles.cartCountText}>{totalCartItems}</Text>
          <AntDesign name="shoppingcart" size={25} color={'#ffffff'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backColor,
  },
  listContent: {
    margin: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: '49%',
  },
  touchableContainer: {
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  itemDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonAdded: {
    backgroundColor: '#28a745', // Green color for 'Added'
  },
  buttonText: {
    color: '#fff',
  },
  cartButton: {
    position: 'absolute',
    top: 25,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartCountText: {
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'green',
    textAlign: 'center',
    borderRadius: 50,
    color: '#ffff',
    borderWidth: 1,
  },
});
