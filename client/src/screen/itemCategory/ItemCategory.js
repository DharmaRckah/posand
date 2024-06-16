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

const ItemCategory = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchItemCategories();
  }, []);

  const fetchItemCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/item/');
      console.log('Item categories:', response?.data?.items);
      setCategories(response?.data?.items);
    } catch (error) {
      console.error('Error fetching categories:', error);
      ToastAndroid.show('Error fetching categories', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteCategory = async id => {
    try {
      await axios.delete(`http://10.0.2.2:5000/api/v1/item/${id}`);
      ToastAndroid.show('Category deleted successfully', ToastAndroid.SHORT);
      // After successful deletion, re-fetch the category list
      fetchItemCategories();
    } catch (error) {
      console.log('Error deleting category:', error);
      ToastAndroid.show('Failed to delete category', ToastAndroid.SHORT);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchItemCategories();
  };

  const renderCategoryItem = ({item}) => (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddItemCategory', {items: item})}>
        <View
          style={{
            backgroundColor: Colors.borderColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            padding: 2,
          }}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <TouchableOpacity onPress={() => deleteCategory(item._id)} style={{}}>
            <AntDesign name="delete" color={'red'} size={20} />
          </TouchableOpacity>
        </View>

        <View style={{padding: 10}}>
          <Text style={styles.categoryName}>HSN Code: {item.hsnCode}</Text>
          <Text style={styles.categoryName}>Tax Type: {item.taxType}</Text>
          <Text style={styles.categoryName}>GST Rate: {item.gstRate}</Text>
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
        title="Item Category"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text>No categories found.</Text>
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
          navigation.navigate('AddItemCategory');
        }}>
        <AntDesign name="plus" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default ItemCategory;

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
  },
  categoryName: {
    fontSize: 18,
    // fontWeight: 'bold',
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
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
