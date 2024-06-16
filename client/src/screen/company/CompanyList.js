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

const CompanyList = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState([]);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://10.0.2.2:5000/api/v1/company/getCompany',
      );
      setCompany(response?.data?.data);
    } catch (error) {
      console.error('Error fetching company:', error);
      ToastAndroid.show('Error fetching company', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async id => {
    try {
      await axios.delete(
        `http://10.0.2.2:5000/api/v1/company/deleteCompany/${id}`,
      );
      ToastAndroid.show('Company deleted successfully', ToastAndroid.SHORT);
      fetchCompany(); // Refresh the company list after deletion
    } catch (error) {
      console.log(error);
      ToastAndroid.show('Failed to delete company', ToastAndroid.SHORT);
    }
  };

  const renderCompanyItem = ({item}) => (
    <TouchableOpacity style={styles.companyContainer} onPress={()=>navigation.navigate('RegisterCompany', item)}>
      <View style={{flexDirection:'row', justifyContent:'space-between', borderBottomWidth:2}}>
        <View>
          <Image
          source={{uri: `http://10.0.2.2:5000/${item.companyLogo}`}}
          style={styles.companyImage}
        />   
        </View>
       
        <View>
         <Text style={[styles.value, {textTransform:'uppercase'}]}>{item.businessName}</Text>   
        </View> 
        <TouchableOpacity
          onPress={() => deleteCompany(item._id)}
          style={{}}>
          <AntDesign name="delete" color={'red'} size={20} />
        </TouchableOpacity>
       
        
      </View>
      {/* <View style={styles.companyDetails}>
        <Text style={styles.title}>Business Name:</Text>
        <Text style={styles.value}>{item.businessName}</Text>
      </View> */}
      <View style={styles.companyDetails}>
        <Text style={styles.title}>Email:</Text>
        <Text style={styles.value}>{item.email}</Text>
      </View>
      <View style={styles.companyDetails}>
        <Text style={styles.title}>Address:</Text>
        <Text style={styles.value}>{item.address}</Text>
      </View>
      <View style={styles.companyDetails}>
        <Text style={styles.title}>Contact:</Text>
        <Text style={styles.value}>{item.contact}</Text>
      </View>
      <View style={styles.companyDetails}>
        <Text style={styles.title}>GSTIN:</Text>
        <Text style={styles.value}>{item.gstIn}</Text>
      </View>
      <View style={styles.companyDetails}>
        <Text style={styles.title}>Tax Rate:</Text>
        <Text style={styles.value}>{item.taxRate}</Text>
      </View>
      <View style={styles.companyDetails}>
        <Text style={styles.title}>Pin Code:</Text>
        <Text style={styles.value}>{item.pinCode}</Text>
      </View>
      {/* <View style={styles.companyDetails}>
        <Text style={styles.title}>Enable GST:</Text>
        <Text style={styles.value}>{item.enableGst}</Text>
      </View>
      <View style={styles.companyDetails}>
        <Text style={styles.title}>Country:</Text>
        <Text style={styles.value}>{item.country}</Text>
      </View>
      <View style={styles.companyDetails}>
        <Text style={styles.title}>State:</Text>
        <Text style={styles.value}>{item.state}</Text>
      </View>
      <View style={styles.companyDetails}>
        <Text style={styles.title}>S State:</Text>
        <Text style={styles.value}>{item.s_state}</Text>
      </View>
      <View style={styles.companyDetails}>
        <Text style={styles.title}>Registration Type:</Text>
        <Text style={styles.value}>{item.registrationType}</Text>
      </View> */}
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
        title="Company"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <FlatList
        data={company}
        renderItem={renderCompanyItem}
        keyExtractor={item => item._id.toString()} // Ensure the key is a string
        ListEmptyComponent={() => (
          <View style={styles.noDataContainer}>
            <Text>No company found.</Text>
          </View>
        )}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
      />
      <TouchableOpacity
        style={styles.floating}
        onPress={() => {
          navigation.navigate('RegisterCompany');
        }}>
        <AntDesign name="plus" size={30} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default CompanyList;

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
  companyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    elevation: 2,
    flex: 1,
  },
  companyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: Colors.primary,
  },
  value: {
    fontSize: 14,
    color: Colors.secondary,
  },
  companyImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginBottom: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
    elevation: 5,
  },
});
