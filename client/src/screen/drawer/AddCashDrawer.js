import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '../../component/CustomHeader';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const {height} = Dimensions.get('window');

const AddCashDrawer = ({navigation, route}) => {
  const items = route.params ? route.params.items : null;
  console.log('cash items ', items);

  const [cashInput, setCashInput] = useState({
    date: moment().format('YYYY-MM-DD'),
    openingCash: '',
    cashIn: '',
    cashOut: '',
    closingCash: '',
  });

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnChangeText = (text, name) => {
    setCashInput(prevState => ({...prevState, [name]: text}));
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setCashInput(prevState => ({
      ...prevState,
      date: moment(currentDate).format('YYYY-MM-DD'),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('AsyncUser');
      if (!token) {
        throw new Error('User token not found');
      }

      const openingCash = parseFloat(cashInput.openingCash) || 0;
      const cashIn = parseFloat(cashInput.cashIn) || 0;
      const cashOut = parseFloat(cashInput.cashOut) || 0;
      const closingCash = parseFloat(cashInput.closingCash) || 0;

      const newClosingCash = openingCash + cashIn - cashOut;

      console.log("newClosingCash : ", newClosingCash)
      const dt = {
        date: cashInput.date,
        openingCash,
        cashIn,
        cashOut,
        closingCash: newClosingCash,
      };

      if (items) {
        // Update cash drawer
        await axios.put(
          `http://10.0.2.2:5000/api/v1/cashDrawer/updateCashDrawer/${items._id}`,
          dt,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        ToastAndroid.show('Cash drawer updated successfully', ToastAndroid.SHORT);
      } else {
        // Create cash drawer
        if (closingCash === newClosingCash) {
          await axios.post(
            'http://10.0.2.2:5000/api/v1/cashDrawer/createCashDrawer',
            dt,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          ToastAndroid.show('Cash drawer created successfully', ToastAndroid.SHORT);
          navigation.navigate('CashDrawerList');
          setCashInput({
            date: moment().format('YYYY-MM-DD'),
            openingCash: '',
            cashIn: '',
            cashOut: '',
            closingCash: '',
          });
        } else {
          Alert.alert('Closing balance does not match calculated value');
        }
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Error creating/updating cash drawer', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items) {
      setCashInput({
        date: moment(items.date).format('YYYY-MM-DD'),
        openingCash: items.openingCash.toString(),
        cashIn: items.cashIn.toString(),
        cashOut: items.cashOut.toString(),
        closingCash: items.closingCash.toString(),
      });
      setDate(new Date(items.date));
    }
  }, [items]);

  return (
    <>
      <CustomHeader
        title={items ? 'Update Cash Drawer' : 'Add Cash Drawer'}
        onPressArrow={() => navigation.goBack()}
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <ScrollView style={{height, flexGrow: 1}}>
        <View style={styles.container}>
          <CustomInput
            label="Date"
            onChangeText={text => handleOnChangeText(text, 'date')}
            value={cashInput.date}
            rightIconName={
              <TouchableOpacity onPress={() => setShow(!show)}>
                <AntDesign name="calendar" color={'#000'} size={24} />
              </TouchableOpacity>
            }
          />
          <CustomInput
            label="Opening Cash"
            onChangeText={text => handleOnChangeText(text, 'openingCash')}
            value={cashInput.openingCash}
            keyboardType="numeric"
          />
          <CustomInput
            label="Cash In"
            onChangeText={text => handleOnChangeText(text, 'cashIn')}
            value={cashInput.cashIn}
            keyboardType="numeric"
          />
          <CustomInput
            label="Cash Out"
            onChangeText={text => handleOnChangeText(text, 'cashOut')}
            value={cashInput.cashOut}
            keyboardType="numeric"
          />
          <CustomInput
            label="Closing Cash"
            onChangeText={text => handleOnChangeText(text, 'closingCash')}
            value={cashInput.closingCash}
            editable={false} // Make closing cash field non-editable
            keyboardType="numeric"
          />
          <CustomButton
            title={items ? 'Update' : 'Save'}
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
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

export default AddCashDrawer;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.backColor,
    height,
  },
});
