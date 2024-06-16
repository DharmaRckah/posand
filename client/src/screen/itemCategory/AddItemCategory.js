import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import CustomHeader from '../../component/CustomHeader';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';
import CustomDropdown from '../../component/CustomDropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const {height} = Dimensions.get('window');

const taxTypeData = [
  {label: 'Exempted', value: 'Exempted'},
  {label: 'Nil Rated', value: 'Nil Rated'},
  {label: 'Non GST', value: 'Non GST'},
  {label: 'Taxable', value: 'Taxable'},
];

const AddItemCategory = ({navigation, route}) => {
  const items = route?.param;
  console.log('items : ', items);
  const [selectType, setSelectType] = useState(null);
  const [itemInput, setItemInput] = useState({
    name: '',
    hsnCode: '',
    taxType: '',
    gstRate: null,
  });
  const [loading, setLoading] = useState(false);

  console.log('selecttype : ', selectType);
  const handleOnChangeText = (text, name) => {
    setItemInput(prevState => ({...prevState, [name]: text}));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('AsyncUser');

      let dt = {
        ...itemInput,
        taxType: selectType,
      };
      console.log('dt ==== : ', dt);
      if (items) {
        // Update item category
        await axios.put(`http://10.0.2.2:5000/api/v1/item/${items._id}`, dt, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        ToastAndroid.show(
          'item Category updated successfully',
          ToastAndroid.SHORT,
        );
      } else {
        // create item category
        await axios.post('http://10.0.2.2:5000/api/v1/item/', dt, {
          headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        ToastAndroid.show(
          'item Category created successfully',
          ToastAndroid.SHORT,
        );
        navigation.navigate('ItemCategory');
        setItemInput({
          name: '',
          hsnCode: '',
          taxType: '',
          gstRate: '',
        });
        setSelectType(null)
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show(
        'Error creating/updating item Category',
        ToastAndroid.SHORT,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items) {
      setCashInput({
        name: items?.name,
        hsnCode: items?.hsnCode,
        taxType: items?.taxType,
        gstRate: items?.gstRate,
      });
    }
  }, [items]);

  return (
    <>
      <CustomHeader
        title={items ? 'Update item Category' : 'Add Item Category'}
        onPressArrow={() => navigation.goBack()}
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <ScrollView style={{height, flexGrow: 1}}>
        <View style={styles.container}>
          <CustomInput
            label="Name"
            onChangeText={text => handleOnChangeText(text, 'name')}
            value={itemInput.name}
          />
          <CustomInput
            label="HSN Code"
            onChangeText={text => handleOnChangeText(text, 'hsnCode')}
            value={itemInput.hsnCode}
          />
          <CustomDropdown
            data={taxTypeData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            searchPlaceholder="Search..."
            value={selectType}
            onChange={item => {
              console.log(item)
              setSelectType(item);
            }}
            label={'registration type'}
            placeholder={false}
          />
          <CustomInput
            label="GST Rate"
            onChangeText={text => handleOnChangeText(text, 'gstRate')}
            value={itemInput.gstRate}
          />
          <CustomButton
            title={items ? 'Update' : 'Save'}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default AddItemCategory;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.backColor,
    height,
  },
});
