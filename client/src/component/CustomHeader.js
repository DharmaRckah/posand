import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {Colors} from '../constant/Colors';

const CustomHeader = ({title, onPressArrow, onPressMenu, leftText, righttext}) => {
  return (
    <View style={styles.header}>
      <StatusBar backgroundColor={Colors.secondary} />
      {onPressArrow ? (
        <TouchableOpacity onPress={onPressArrow}>
          <Feather
            name="arrow-left-circle"
            color={"#ffffffff"}
            size={24}
          />
        </TouchableOpacity>
      ) : (
        <Text>{leftText}</Text>
      )}
      <Text style={styles.headerText}>{title}</Text>
      {onPressMenu ? (
        <TouchableOpacity onPress={onPressMenu}>
          <Feather
            name="arrow-right-circle"
            color={'#ffffffff'}
            size={24}
          />
        </TouchableOpacity>
      ) : (
        <Text>{righttext} </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 80, // Set height to 56 units
    backgroundColor: Colors.secondary,
    justifyContent: 'space-between',
    alignItems: 'center', // Center content vertically
    paddingHorizontal: 20,
    flexDirection: 'row',
    paddingTop: 20,
  },
  headerText: {
    color: Colors.btnText,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
