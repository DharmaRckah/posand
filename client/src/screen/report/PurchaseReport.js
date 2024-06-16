import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../component/CustomHeader';
import CustomDropdown from '../../component/CustomDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../constant/Colors';
import { DrawerActions } from '@react-navigation/native';

const monthData = [
  {label: 'January', value: 'January'},
  {label: 'Fbruary', value: 'Fbruary'},
  {label: 'March', value: 'March'},
  {label: 'April', value: 'April'},
  {label: 'May', value: 'May'},
  {label: 'June', value: 'June'},
  {label: 'July', value: 'July'},
  {label: 'August', value: 'August'},
  {label: 'September', value: 'September'},
  {label: 'Octomber', value: 'Octomber'},
  {label: 'Navember', value: 'Navember'},
  {label: 'Desember', value: 'Desember'},
];
const PurchaseReport = ({navigation}) => {
  const [selectMonth, setSelectMonth] = useState(null);
  return (
    <View style={styles.container}>
      <CustomHeader
        title="Purchase Report"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <View style={styles.content}>
        <CustomDropdown
          data={monthData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={selectMonth}
          onChange={item => {
            setSelectMonth(item);
          }}
          label={false}
          placeholder={
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <MaterialIcons name="add-business" color={'#ffffff'} size={24} />
              <Text style={{fontWeight: '500', paddingLeft: 10}}>
                Select Month
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default PurchaseReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backColor,
  },
  content: {
    flex: 1,
    padding: 10,
  },
});
