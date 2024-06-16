import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  ToastAndroid,
  ActivityIndicator,
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

const AddItemUnit = ({navigation, route}) => {
  const unitId = route?.params;
  const [loading, setLoading] = useState(false);
  const [selectType, setSelectType] = useState(null);
  const [itemInput, setItemInput] = useState({
    unitSymbol: '',
    formalName: '',
    code: '',
  });

  const handleOnChangeText = (text, name) => {
    setItemInput(prevState => ({...prevState, [name]: text}));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('AsyncUser');
      if (!token) {
        throw new Error('User token not found');
      }

      const {unitSymbol, formalName, code} = itemInput;
      const dt = {unitSymbol, formalName, code};

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (unitId) {
        await axios.put(
          `http://10.0.2.2:5000/api/v1/unit/${unitId.id}`,
          dt,
          config,
        );
        ToastAndroid.show('Unit updated successfully', ToastAndroid.SHORT);
      } else {
        await axios.post('http://10.0.2.2:5000/api/v1/unit/', dt, config);
        ToastAndroid.show('Unit created successfully', ToastAndroid.SHORT);
        navigation.navigate('ItemUnit');
        setItemInput({
          unitSymbol: '',
          formalName: '',
          code: '',
        });
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show('Error creating/updating unit', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unitId) {
      setItemInput({
        unitSymbol: unitId.unitSymbol,
        formalName: unitId.formalName,
        code: unitId.code,
      });
      setSelectType(unitId.code);
    }
  }, [unitId]);

  return (
    <>
      <CustomHeader
        title={'Add Item Unit'}
        onPressArrow={() => navigation.goBack()}
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <ScrollView style={{height, flexGrow: 1}}>
        <View style={styles.container}>
          <CustomInput
            label="Symbol"
            onChangeText={text => handleOnChangeText(text, 'unitSymbol')}
            value={itemInput.unitSymbol}
          />
          <CustomInput
            label="Formal Name"
            onChangeText={text => handleOnChangeText(text, 'formalName')}
            value={itemInput.formalName}
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
              setSelectType(item.value);
              handleOnChangeText(item.value, 'code');
            }}
            label={'Registration Type'}
            placeholder={false}
          />
          {loading ? (
            <ActivityIndicator size={'small'} color={'#ffff'} />
          ) : (
            <CustomButton
              title={unitId ? 'Update' : 'Save'}
              onPress={handleSubmit}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default AddItemUnit;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.backColor,
    height,
  },
});
