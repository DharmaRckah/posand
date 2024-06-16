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
import CustomHeader from '../../component/CustomHeader';
import {DrawerActions} from '@react-navigation/native';
import axios from 'axios';
import {Colors} from '../../constant/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CategoryList = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://10.0.2.2:5000/api/v1/category/get-category',
      );
      console.log('image : ', response?.data?.categories);
      setCategories(response?.data?.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      ToastAndroid.show('Error fetching categories', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const deleteCat = async id => {
    try {
      await axios.delete(
        `http://10.0.2.2:5000/api/v1/category/deleteCategory/${id}`,
      );
      ToastAndroid.show('Category deleted successfully', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Failed to delete category', ToastAndroid.SHORT);
    }
  };
  const renderCategoryItem = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddCategory', {items: item})}
      style={styles.categoryContainer}>
      <TouchableOpacity onPress={()=>deleteCat(item._id)}>
        <AntDesign name="delete" color={'red'} size={20} />
      </TouchableOpacity>
      <Image
        source={{uri: `http://10.0.2.2:5000/${item.img}`}}
        style={styles.categoryImage}
      />
      <Text style={styles.categoryName}>{item.name}</Text>
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
        title="Category List"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id} // Ensure the key is a string
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text>No categories found.</Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        numColumns={2}
      />
    </View>
  );
};

export default CategoryList;

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
});



// Netinfo


// import React, {useEffect, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ActivityIndicator,
//   FlatList,
//   ToastAndroid,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import CustomHeader from '../../component/CustomHeader';
// import {DrawerActions} from '@react-navigation/native';
// import axios from 'axios';
// import {Colors} from '../../constant/Colors';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import NetInfo from "@react-native-community/netinfo";

// const CategoryList = ({navigation}) => {
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [isConnected, setIsConnected] = useState(true);

//   useEffect(() => {
//     // Subscribe to network state updates
//     const unsubscribe = NetInfo.addEventListener(state => {
//       setIsConnected(state.isConnected);
//       console.log("Connection type", state.type);
//       console.log("Is connected?", state.isConnected);
//     });

//     // Check initial network status
//     NetInfo.fetch().then(state => {
//       setIsConnected(state.isConnected);
//     });

//     return () => {
//       // Unsubscribe to network state updates
//       unsubscribe();
//     };
//   }, []);


//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         'http://10.0.2.2:5000/api/v1/category/get-category',
//       );
//       console.log('image : ', response?.data?.categories);
//       setCategories(response?.data?.categories);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       ToastAndroid.show('Error fetching categories', ToastAndroid.SHORT);
//     } finally {
//       setLoading(false);
//     }
//   };

  // const deleteCat = async id => {
  //   try {
  //     await axios.delete(
  //       `http://10.0.2.2:5000/api/v1/category/deleteCategory/${id}`,
  //     );
  //     ToastAndroid.show('Category deleted successfully', ToastAndroid.SHORT);
  //     navigation.goBack();
  //   } catch (error) {
  //     console.log(error);
  //     ToastAndroid.show('Failed to delete category', ToastAndroid.SHORT);
  //   }
  // };
//   const renderCategoryItem = ({item}) => (
//     <TouchableOpacity
//       onPress={() => navigation.navigate('AddCategory', {items: item})}
//       style={styles.categoryContainer}>
//       <TouchableOpacity onPress={deleteCat(item._id)}>
//         <AntDesign name="delete" color={'red'} size={20} />
//       </TouchableOpacity>
//       <Image
//         source={{uri: `http://10.0.2.2:5000/${item.img}`}}
//         style={styles.categoryImage}
//       />
//       <Text style={styles.categoryName}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const renderFooter = () => {
//     if (loading) {
//       return (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       );
//     }
//     return null;
//   };

//   return (
//     <View style={styles.container}>
//       <CustomHeader
//         title="Category List"
//         onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
//       />
//       <FlatList
//         data={categories}
//         renderItem={renderCategoryItem}
//         keyExtractor={item => item.id} // Ensure the key is a string
//         ListEmptyComponent={() => (
//           <View style={styles.noDataContainer}>
//             <Text>No categories found.</Text>
//           </View>
//         )}
//         ListFooterComponent={renderFooter}
//         contentContainerStyle={styles.content}
//         numColumns={2}
//       />
//     </View>
//   );
// };

// export default CategoryList;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.backColor,
//   },
//   content: {
//     flexGrow: 1,
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   loaderContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   noDataContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   categoryContainer: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 5,
//     margin: 5,
//     padding: 10,
//     alignItems: 'center',
//   },
//   categoryName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   categoryImage: {
//     width: 100, // Adjusted size for better visibility
//     height: 100, // Adjusted size for better visibility
//     borderRadius: 10,
//     marginBottom: 10,
//   },
// });
