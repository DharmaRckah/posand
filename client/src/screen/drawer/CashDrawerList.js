import React, {useEffect, useState, useRef, useCallback, memo} from 'react';
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
import moment from 'moment';

const CashDrawerList = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cashDrawer, setCashDrawer] = useState([]);
  const flatListRef = useRef();

  useEffect(() => {
    cashDrawerListHandler();
  }, []);

  const cashDrawerListHandler = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://10.0.2.2:5000/api/v1/cashDrawer/getCashDrawer',
      );
      console.log("response of cash drawer : ", response?.data?.data)
      setCashDrawer(response.data.data);
    } catch (error) {
      console.error('Error fetching cashDrawer:', error);
      ToastAndroid.show('Error fetching cashDrawer', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = useCallback(async (id) => {
    try {
      await axios.delete(
        `http://10.0.2.2:5000/api/v1/cashDrawer/deleteCashDrawer/${id}`,
      );
      ToastAndroid.show('CashDrawer deleted successfully', ToastAndroid.SHORT);
      setCashDrawer(prevState => prevState.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete cashDrawer:', error);
      ToastAndroid.show('Failed to delete cashDrawer', ToastAndroid.SHORT);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cashDrawerListHandler();
    setRefreshing(false);
  }, []);

  const renderCashDrawerItem = (({item}) => (
    <View style={styles.cashDrawerContainer}>
      <View style={[styles.textContainer, {backgroundColor: Colors.borderColor, padding: 5}]}>
        <Text style={styles.cashDrawerName}>
          {moment(item.date).format('DD-MM-YYYY')}
        </Text>
        <TouchableOpacity onPress={() => deleteHandler(item._id)}>
          <AntDesign name="delete" color="red" size={20} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{borderRadius: 5, padding: 10}}
        onPress={() => navigation.navigate('AddCashDrawer', {items: item})}>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Opening balance</Text>
          <Text style={styles.textValue}>{item.openingCash}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Cash in</Text>
          <Text style={styles.textValue}>{item.cashIn}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Cash out</Text>
          <Text style={styles.textValue}>{item.cashOut}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Closing balance</Text>
          <Text style={styles.textValue}>{item.closingCash}</Text>
        </View>
      </TouchableOpacity>
    </View>
  ));

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
        title="Cash Drawer List"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <FlatList
        data={cashDrawer}
        renderItem={renderCashDrawerItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text>No cashDrawer found.</Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        getItemLayout={(data, index) => (
          { length: 100, offset: 100 * index, index }
        )}
        style={{marginBottom:70}}
      />
      <TouchableOpacity
        style={styles.floating}
        onPress={() => navigation.navigate('AddCashDrawer')}>
        <AntDesign name="plus" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default CashDrawerList;

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
  cashDrawerContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  cashDrawerName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  floating: {
    borderWidth: 1,
    borderColor: '#3b5998',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3b5998',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textTitle: {
    textTransform: 'uppercase',
  },
  textValue: {
    color: 'green',
  },
});
