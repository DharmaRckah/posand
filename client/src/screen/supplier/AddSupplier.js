import React, {useEffect, useState} from 'react';
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

const AddSupplier = ({navigation, route}) => {
  const supplierId = route?.params?.items;
  const [supplierInput, setsupplierInput] = useState({
    name: '',
    address: '',
    state: '',
    country: '',
    pinCode: '',
    contact: '',
    // gst details
    registrationType: '',
    gstIn: '',
    // bank details
    accountNo: '',
    accountName: '',
    ifscCode: '',
    bankName: '',
    // discount details
    itemCategory: '',
    discount: '',
  });
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [screenToggle, setScreenToggle] = useState(1);
  const [selectType, setSelectType] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [itemList, setItemList] = useState([]);

  const handleAddItem = () => {
    if (supplierInput.itemCategory && supplierInput.discount) {
      setItemList([...itemList, {...supplierInput}]);
      setsupplierInput({itemCategory: '', discount: ''});
    }
  };
  const handleOnchangeText = (text, name) => {
    setsupplierInput(prevState => ({...prevState, [name]: text}));
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
      const supplierData = {
        supplierName: supplierInput.supplierName,
        address: supplierInput.address,
        country: selectedCountry,
        state: selectedState,
        pinCode: supplierInput.pinCode,
        contact: parseInt(supplierInput.contact ,10),
        openingBalance: supplierInput.openingBalance,
        registrationType: selectType,
        gstIn: supplierInput.gstIn,
        itemCategory: supplierInput.itemCategory,
        discount: supplierInput.discount,
        accountNo: supplierInput.accountNo, 
        accountName: supplierInput.accountName,
        ifscCode: supplierInput.ifscCode,
        bankName: supplierInput.bankName,
      };

      console.log('supplierData : ', supplierData);
      if (supplierId) {
        // Update supplier
        const res = await axios.put(
          `http://10.0.2.2:5000/api/v1/supplier/${supplierId}`,
          supplierData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":'application/json'
            },
          },
        );
        console.log('supplier res : ', res)
        ToastAndroid.show('supplier updated successfully', ToastAndroid.SHORT);
      } else {
        // Create supplier
        await axios.post('http://10.0.2.2:5000/api/v1/supplier/', supplierData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        ToastAndroid.show('supplier created successfully', ToastAndroid.SHORT);
      }

      navigation.navigate('supplier');
      setsupplierInput({
        supplierName: '',
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
      ToastAndroid.show('Error creating/updating supplier', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      setsupplierInput({
        supplierName: supplierId.supplierName,
        address: supplierId.address,
        country: supplierId.country,
        state: supplierId.state,
        pinCode: supplierId.pinCode,
        contact: supplierId.contact,
        openingBalance: supplierId.openingBalance,
        registrationType: supplierId.registrationType,
        gstIn: supplierId.gstIn,
        itemCategory: supplierId.itemCategory,
        discount: supplierId.discount,
        accountNo: supplierId.accountNo,
        accountName: supplierId.accountName,
        ifscCode: supplierId.ifscCode,
        bankName: supplierId.bankName,
      });
    }
  }, [supplierId]);


  return ( 
    <>
      <CustomHeader
        title={supplierId ? 'Update Supplier' : 'Add Supplier'}
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
            supplier Info
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
              onChangeText={text => handleOnchangeText(text, 'name')}
              value={supplierInput.name}
            />
            <CustomInput
              label="Address"
              onChangeText={text => handleOnchangeText(text, 'address')}
              value={supplierInput.address}
            />
            {/* <CustomInput
              label="State"
              onChangeText={text => handleOnchangeText(text, 'state')}
              value={supplierInput.state}
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
              value={supplierInput.pinCode}
            />
            <CustomInput
              label="Contact"
              onChangeText={text => handleOnchangeText(text, 'contact')}
              value={supplierInput.contact}
            />
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
              value={supplierInput.gstIn}
            />
          </View>
        )}
        {screenToggle === 3 && (
          <View style={styles.container}>
            <CustomInput
              label="Account No"
              onChangeText={text => handleOnchangeText(text, 'accountNo')}
              value={supplierInput.accountNo}
            />
            <CustomInput
              label="Account Name"
              onChangeText={text => handleOnchangeText(text, 'accountName')}
              value={supplierInput.accountName}
            />
            <CustomInput
              label="IFSC Code"
              onChangeText={text => handleOnchangeText(text, 'ifscCode')}
              value={supplierInput.ifscCode}
            />
            <CustomInput
              label="Bank Name"
              onChangeText={text => handleOnchangeText(text, 'bankName')}
              value={supplierInput.bankName}
            />
          </View>
        )}
        {screenToggle === 4 && (
          <View style={styles.container}>
            <CustomInput
              label="Item Category"
              onChangeText={text => handleOnchangeText(text, 'itemCategory')}
              value={supplierInput.itemCategory}
            />
            <CustomInput
              label="Discount"
              onChangeText={text => handleOnchangeText(text, 'discount')}
              value={supplierInput.discount}
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
                  <Text style={{fontWeight:'500', textTransform:'capitalize', color:Colors.primary}}>{item.itemCategory}</Text>
                  <Text style={{fontWeight:'500', textTransform:'capitalize', color:Colors.primary}}>{item.discount}</Text>
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

export default AddSupplier;

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
