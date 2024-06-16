import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '../../component/CustomHeader';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';

const {height} = Dimensions.get('window');

const AddPurchase = ({navigation}) => {
  const [salesInput, setSalesInput] = useState({
    billingBy: '',
    address: '',
    contact: '',
    gstin: '',
    billingTo: '',
    billingAddress: '',
    billingContact: '',
    date: '',
    invoiceNo: '',
    openingCash: '',
    cashIn: '',
    cashOut: '',
    closingCash: '',
  });
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleOnChangeText = (text, name) => {
    setSalesInput(prevState => ({...prevState, [name]: text}));
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setSalesInput(prevState => ({
      ...prevState,
      date: currentDate.toDateString(),
    }));
  };

  const handleSubmit = () => {
    // Validate form data here
    const {
      billingBy,
      address,
      contact,
      gstin,
      billingTo,
      billingAddress,
      billingContact,
      date,
      invoiceNo,
      openingCash,
      cashIn,
      cashOut,
      closingCash,
    } = salesInput;

    if (
      !billingBy ||
      !address ||
      !contact ||
      !gstin ||
      !billingTo ||
      !billingAddress ||
      !billingContact ||
      !date ||
      !invoiceNo ||
      !openingCash ||
      !cashIn ||
      !cashOut ||
      !closingCash
    ) {
      Alert.alert('Validation Error', 'Please fill all the fields.');
      return;
    }

    // Submit form data to the server or handle it accordingly
    console.log('Form Submitted', salesInput);
    Alert.alert('Success', 'Sales data saved successfully.');

    // Optionally, reset form after submission
    setSalesInput({
      billingBy: '',
      address: '',
      contact: '',
      gstin: '',
      billingTo: '',
      billingAddress: '',
      billingContact: '',
      date: '',
      invoiceNo: '',
      openingCash: '',
      cashIn: '',
      cashOut: '',
      closingCash: '',
    });
    setDate(new Date());
  };

  return (
    <>
      <CustomHeader
        title={'Add Purchase'}
        onPressArrow={() => navigation.goBack()}
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <CustomInput
            label="Billing By"
            onChangeText={text => handleOnChangeText(text, 'billingBy')}
            value={salesInput.billingBy}
          />
          <CustomInput
            label="Address"
            onChangeText={text => handleOnChangeText(text, 'address')}
            value={salesInput.address}
          />
          <CustomInput
            label="Contact"
            onChangeText={text => handleOnChangeText(text, 'contact')}
            value={salesInput.contact}
          />
          <CustomInput
            label="GSTIN"
            onChangeText={text => handleOnChangeText(text, 'gstin')}
            value={salesInput.gstin}
          />
          <CustomInput
            label="Billing To"
            onChangeText={text => handleOnChangeText(text, 'billingTo')}
            value={salesInput.billingTo}
          />
          <CustomInput
            label="Billing Address"
            onChangeText={text => handleOnChangeText(text, 'billingAddress')}
            value={salesInput.billingAddress}
          />
          <CustomInput
            label="Billing Contact"
            onChangeText={text => handleOnChangeText(text, 'billingContact')}
            value={salesInput.billingContact}
          />
          <CustomInput
            label="Date"
            onChangeText={text => handleOnChangeText(text, 'date')}
            value={salesInput.date}
            rightIconName={
              <TouchableOpacity onPress={() => setShow(!show)}>
                <AntDesign name="calendar" color={'#000'} size={24} />
              </TouchableOpacity>
            }
          />
          <CustomInput
            label="Invoice No"
            onChangeText={text => handleOnChangeText(text, 'invoiceNo')}
            value={salesInput.invoiceNo}
          />

          <CustomButton title={'Save'} onPress={handleSubmit} />
        </View>
      </ScrollView>
      {show && (
        <DateTimePicker
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}
    </>
  );
};

export default AddPurchase;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.backColor,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
