import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constant/Colors';

const CustomInput = ({
  placeholder,
  iconName,
  onChangeText,
  value,
  secureTextEntry = false, // Default parameter
  keyboardType = 'default', // Default parameter
  label,
  rightIconName,
  // error
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

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
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}>
        <Icon name={iconName} size={20} style={styles.icon} />
        <TextInput
          placeholder={placeholder}
          secureTextEntry={!showPassword && secureTextEntry}
          onChangeText={onChangeText}
          value={value}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          cursorColor={Colors.textColor}
        />
        {rightIconName}

        {secureTextEntry && (
          <TouchableOpacity onPress={toggleShowPassword}>
            <Icon
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color={'#000'}
            />
          </TouchableOpacity>
        )}
        {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.borderColor,
    borderRadius: 8,
    // paddingHorizontal: 12,
    // paddingVertical: 5,
    marginBottom: 5,
  },
  inputContainerFocused: {
    borderColor: Colors.textColor,
  },
  icon: {
    marginRight: 10,
    color: Colors.textColor,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textColor,
  },
  // errorText: {
  //   color: 'red',
  //   fontSize: 12,
  //   marginTop: 4,
  // },
});

export default CustomInput;
