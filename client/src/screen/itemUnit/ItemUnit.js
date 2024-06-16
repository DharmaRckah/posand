import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomHeader from '../../component/CustomHeader';
import {Colors} from '../../constant/Colors';

const ItemUnit = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [unitData, setunitData] = useState([]);

  useEffect(() => {
    fetchunitData();
  }, []);

  const fetchunitData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://10.0.2.2:5000/api/v1/unit',
      );
      // console.log('image : ', response?.data?.data);
      setunitData(response?.data?.data);
    } catch (error) {
      console.error('Error fetching unitData:', error);
      ToastAndroid.show('Error fetching unitData', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const deleteUnit = async id => {
    try {
      await axios.delete(
        `http://10.0.2.2:5000/api/v1/unit/${id}`,
      );
      ToastAndroid.show('Category deleted successfully', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Failed to delete category', ToastAndroid.SHORT);
    }
  };
  const renderUnitItems = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ItemUnit', {items: item})}
      style={styles.categoryContainer}>
      <TouchableOpacity onPress={() => deleteUnit(item._id)}>
        <AntDesign name="delete" color={'red'} size={20} />
      </TouchableOpacity>
       <Text style={styles.categoryName}>{item.unitSymbol}</Text>
       <Text style={styles.categoryName}>{item.formalName}</Text>
       <Text style={styles.categoryName}>{item.code}</Text>
    </TouchableOpacity>
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
        title="Item Unit"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <FlatList
        data={unitData}
        renderItem={renderUnitItems}
        keyExtractor={item => item.id} // Ensure the key is a string
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text>No unitData found.</Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        numColumns={2}
      />
      <TouchableOpacity
        style={styles.floating}
        onPress={() => {
          navigation.navigate('AddItemUnit');
        }}>
        <AntDesign name="plus" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default ItemUnit;

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
    padding: 10,
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoryImage: {
    width: 100, // Adjusted size for better visibility
    height: 100, // Adjusted size for better visibility
    borderRadius: 10,
    marginBottom: 10,
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
    backgroundColor: '#ffffffff',
    borderRadius: 100,
  },
});
