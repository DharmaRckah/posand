import React from 'react';
import {StyleSheet, View, Text, Dimensions} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Colors} from '../constant/Colors';

const {width} = Dimensions.get('window');

const CustomDropdown = ({
  data,
  value,
  labelField,
  valueField,
  searchPlaceholder,
  onChange,
  placeholder,
  label,
  myStyles,
  onChangeFrom
}) => {
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item[labelField]}</Text>
        {item[valueField] === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <>
      <Text
        style={{
          color: Colors.primary,
          textTransform: 'uppercase',
          fontWeight: '400',
          marginTop: 10,
        }}>
        {label}
      </Text>
      <Dropdown
        style={[styles.dropdown, myStyles]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField={labelField}
        valueField={valueField}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onChange={item => {
          if (onChange) {
            onChange(item[valueField]);
          }
          if (onChangeFrom) {
            onChangeFrom(item);
          }
        }}
        renderItem={renderItem}
        placeholder={placeholder}
      />
      <View
        style={{
          borderWidth: 1,
          borderColor: Colors.borderColor,
        }}></View>
    </>
  );
};

// Set default values using JavaScript default parameters
CustomDropdown.defaultProps = {
  data: [],
  labelField: 'label',
  valueField: 'value',
  searchPlaceholder: 'Search',
  placeholder: 'Select',
  label: 'Label',
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdown: {
    height: 60,
    borderRadius: 12,
    width: '100%',
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    color: Colors.textColor,
    paddingHorizontal: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
