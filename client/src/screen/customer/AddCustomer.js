import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '../../component/CustomHeader';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';
import CustomDropdown from '../../component/CustomDropdown';
import {CountryData} from '../company/CountryData';
import StateData from '../company/StateData';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');
const gstType = [
  {label: 'composition', value: 'composition'},
  {label: 'regular', value: 'regular'},
  {label: 'unregistered', value: 'unregistered'},
  {label: 'consumer', value: 'consumer'},
];

const countryData = CountryData;

const stateData = StateData;

const AddCustomer = ({navigation, route}) => {
  const customerId = route?.params?.items;
  console.log('customerId : ', customerId);
  const [customerInput, setCustomerInput] = useState({
    customerName: '',
    address: '',
    state: '',
    country: selectedCountry,
    pinCode: selectedState,
    contact: '',
    // gst details
    registrationType: selectType,
    gstIn: '',
    // bank details
    accountNo: '',
    accountName: '',
    ifscCode: '',
    bankName: '',
    // discount details
    itemCategory: '',
    discount: '',
    openingBalance: '',
  });
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [screenToggle, setScreenToggle] = useState(1);
  const [selectType, setSelectType] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddItem = () => {
    if (customerInput.itemCategory && customerInput.discount) {
      setItemList([...itemList, {...customerInput}]);
      setCustomerInput({itemCategory: '', discount: ''});
    }
  };
  const handleOnchangeText = (text, name) => {
    setCustomerInput(prevState => ({...prevState, [name]: text}));
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleToggle = t => {
    setScreenToggle(t);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('AsyncUser');
      const customerData = {
        customerName: customerInput.customerName,
        address: customerInput.address,
        country: selectedCountry,
        state: selectedState,
        pinCode: customerInput.pinCode,
        contact: parseInt(customerInput.contact ,10),
        openingBalance: customerInput.openingBalance,
        registrationType: selectType,
        gstIn: customerInput.gstIn,
        itemCategory: customerInput.itemCategory,
        discount: customerInput.discount,
        accountNo: customerInput.accountNo, 
        accountName: customerInput.accountName,
        ifscCode: customerInput.ifscCode,
        bankName: customerInput.bankName,
      };

      console.log('customerData : ', customerData);
      if (customerId) {
        // Update customer
        const res = await axios.put(
          `http://10.0.2.2:5000/api/v1/customer/${customerId}`,
          customerData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":'application/json'
            },
          },
        );
        console.log('customer res : ', res)
        ToastAndroid.show('Customer updated successfully', ToastAndroid.SHORT);
      } else {
        // Create customer
        await axios.post('http://10.0.2.2:5000/api/v1/customer/', customerData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        ToastAndroid.show('Customer created successfully', ToastAndroid.SHORT);
      }

      navigation.navigate('Customer');
      setCustomerInput({
        customerName: '',
        address: '',
        country: '',
        state: '',
        pinCode: '',
        contact: '',
        openingBalance: '',
        registrationType: '',
        gstIn: '',
        itemCategory: '',
        discount: '',
        accountNo: '',
        accountName: '',
        ifscCode: '',
        bankName: '',
      });
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Error creating/updating customer', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      setCustomerInput({
        customerName: customerId.customerName,
        address: customerId.address,
        country: customerId.country,
        state: customerId.state,
        pinCode: customerId.pinCode,
        contact: customerId.contact,
        openingBalance: customerId.openingBalance,
        registrationType: customerId.registrationType,
        gstIn: customerId.gstIn,
        itemCategory: customerId.itemCategory,
        discount: customerId.discount,
        accountNo: customerId.accountNo,
        accountName: customerId.accountName,
        ifscCode: customerId.ifscCode,
        bankName: customerId.bankName,
      });
    }
  }, [customerId]);

  return (
    <>
      <CustomHeader
        title={customerId ? 'Update Customer' : 'Add Customer'}
        onPressArrow={() => navigation.goBack()}
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => handleToggle(1)}
          style={[
            styles.textBack,
            screenToggle === 1 ? styles.activeToggle : '',
          ]}>
          <Text
            style={[
              styles.toggleText,
              screenToggle === 1 ? styles.activeToggleText : '',
            ]}>
            Customer Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleToggle(2)}
          style={[
            styles.textBack,
            screenToggle === 2 ? styles.activeToggle : '',
          ]}>
          <Text
            style={[
              styles.toggleText,
              screenToggle === 2 ? styles.activeToggleText : '',
            ]}>
            GST Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleToggle(3)}
          style={[
            styles.textBack,
            screenToggle === 3 ? styles.activeToggle : '',
          ]}>
          <Text
            style={[
              styles.toggleText,
              screenToggle === 3 ? styles.activeToggleText : '',
            ]}>
            Bank Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleToggle(4)}
          style={[
            styles.textBack,
            screenToggle === 4 ? styles.activeToggle : '',
          ]}>
          <Text
            style={[
              styles.toggleText,
              screenToggle === 4 ? styles.activeToggleText : '',
            ]}>
            Discount Details
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{height, flexGrow: 1}}>
        {screenToggle === 1 && (
          <View style={styles.container}>
            <CustomInput
              label="Name"
              onChangeText={text => handleOnchangeText(text, 'customerName')}
              value={customerInput.customerName}
            />
            <CustomInput
              label="Address"
              onChangeText={text => handleOnchangeText(text, 'address')}
              value={customerInput.address}
            />
            {/* <CustomInput
              label="State"
              onChangeText={text => handleOnchangeText(text, 'state')}
              value={customerInput.state}
            /> */}
            <CustomDropdown
              data={countryData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              searchPlaceholder="Search..."
              value={selectedCountry}
              onChange={item => {
                setSelectedCountry(item);
                setSelectedState(null);
              }}
              label={'Country'}
              placeholder={false}
            />
            <CustomDropdown
              data={selectedCountry ? stateData[selectedCountry] : []}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              searchPlaceholder="Search..."
              value={selectedState}
              onChange={item => {
                setSelectedState(item);
              }}
              label={'State'}
              placeholder={false}
            />
            <CustomInput
              label="Pin Code"
              onChangeText={text => handleOnchangeText(text, 'pinCode')}
              value={customerInput.pinCode}
            />
            <CustomInput
              label="Contact"
              onChangeText={text => handleOnchangeText(text, 'contact')}
              value={customerInput.contact}
            />
            <CustomButton title={'Next'} onPress={() => setScreenToggle(2)} />
          </View>
        )}
        {screenToggle === 2 && (
          <View style={styles.container}>
            <CustomDropdown
              data={gstType}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              searchPlaceholder="Search..."
              value={selectType}
              onChange={item => {
                setSelectType(item);
              }}
              label={'registration type'}
              placeholder={false}
            />
            <CustomInput
              label="GSTIN"
              onChangeText={text => handleOnchangeText(text, 'gstIn')}
              value={customerInput.gstIn}
            />
            <CustomButton title={'Next'} onPress={() => setScreenToggle(3)} />
          </View>
        )}
        {screenToggle === 3 && (
          <View style={styles.container}>
            <CustomInput
              label="Account No"
              onChangeText={text => handleOnchangeText(text, 'accountNo')}
              value={customerInput.accountNo}
            />
            <CustomInput
              label="Account Name"
              onChangeText={text => handleOnchangeText(text, 'accountName')}
              value={customerInput.accountName}
            />
            <CustomInput
              label="IFSC Code"
              onChangeText={text => handleOnchangeText(text, 'ifscCode')}
              value={customerInput.ifscCode}
            />
            <CustomInput
              label="Bank Name"
              onChangeText={text => handleOnchangeText(text, 'bankName')}
              value={customerInput.bankName}
            />
            <CustomButton title={'Next'} onPress={() => setScreenToggle(4)} />
          </View>
        )}
        {screenToggle === 4 && (
          <View style={styles.container}>
            <CustomInput
              label="Item Category"
              onChangeText={text => handleOnchangeText(text, 'itemCategory')}
              value={customerInput.itemCategory}
            />
            <CustomInput
              label="Discount"
              onChangeText={text => handleOnchangeText(text, 'discount')}
              value={customerInput.discount}
            />
            <CustomInput
              label="Opening Balance"
              onChangeText={text => handleOnchangeText(text, 'openingBalance')}
              value={customerInput.openingBalance}
            />
            <View style={{justifyContent: 'center'}}>
              <CustomButton title={'Add'} onPress={handleAddItem} />
            </View>

            <View>
              <View
                style={[
                  styles.itemRow,
                  {
                    backgroundColor: Colors.primary,
                  },
                ]}>
                <Text style={{color: '#ffffff'}}>Item Code</Text>
                <Text style={{color: '#ffffff'}}>Discount</Text>
              </View>
              {itemList.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text
                    style={{
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      color: Colors.primary,
                    }}>
                    {item.itemCategory}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      color: Colors.primary,
                    }}>
                    {item.discount}
                  </Text>
                </View>
              ))}
            </View>
            <CustomButton title="Save" onPress={handleSubmit} />
          </View>
        )}
      </ScrollView>
      {show && (
        <DateTimePicker
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: Colors.backColor,
    flex: 1,
    height: height,
  },
  toggleText: {
    color: Colors.btnText,
    fontWeight: '400',
    textTransform: 'uppercase',
    fontSize: 10,
    textAlign: 'center',
  },
  toggleContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 10,
    width: width,
    alignSelf: 'center',
    backgroundColor: Colors.backColor,
  },
  textBack: {
    paddingVertical: 10,
    flex: 1,
    borderRadius: 5,
  },
  activeToggle: {
    backgroundColor: Colors.primary,
  },
  activeToggleText: {
    color: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'pink',
    marginVertical: 5,
    padding: 10,
  },
});
