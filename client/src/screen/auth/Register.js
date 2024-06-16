import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';
import CustomDropdown from '../../component/CustomDropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {OtpInput} from 'react-native-otp-entry';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {width, height} = Dimensions.get('window');
const DataType = [
  {label: 'Generat Store', value: 'Generat Store'},
  {label: 'Medical', value: 'Medical'},
  {label: 'Toy Shop', value: 'Toy Shop'},
];

const Register = ({navigation}) => {
  const [form, setForm] = useState({
    businessName: '',
    userName: '',
    address: '',
    contact: '',
    email: '',
    password: '',
    businessType: null,
  });
  const [busiType, setbusiType] = useState(null);
  const [otpModel, setOtpModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const handleInputChange = (name, value) => {
    setForm({...form, [name]: value});
  };

  const handleSubmit = async () => {
    setLoading(true);
    let formData = {
      businessName: form.businessName,
      userName: form.userName,
      address: form.address,
      contact: form.contact,
      email: form.email,
      password: form.password,
      businessType: busiType,
    };
    //console.log('form Data : ', formData);
    // Validation check
    if (
      !form.businessName ||
      !form.userName ||
      !form.address ||
      !form.contact ||
      !form.email ||
      !form.password ||
      !busiType
    ) {
      ToastAndroid(
        'Validation Error',
        'All fields are required.',
        ToastAndroid.SHORT,
      );
      return;
    }
    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/api/v1/auth/register',
        formData,
      );

      setLoading(false);
      if (form.email === response?.data?.user?.email) {
        ToastAndroid.showWithGravity(
          response?.data?.email,
          'this email is already exist',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
      setOtpModel(true);

      const {data} = response;
      const {email} = data.data;

      console.log('em', email);

      ToastAndroid.showWithGravity(
        response?.data?.massage,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } catch (error) {
      console.log('Error:', error);
      ToastAndroid.showWithGravity(
        'Registration Error',
        'There was an error registering your account. Please try again.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  // console.log('otp', otp);

  const handleOtpVerification = async () => {
    if (!otp) {
      ToastAndroid.showWithGravity(
        'Validation Error: All fields are required.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/api/v1/auth/verification',
        {otp},
      );
      // console.log('otp res : ', response);
      setOtpModel(false);
      navigation.navigate('Login');
      ToastAndroid.showWithGravity(
        'Verification Successful',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } catch (error) {
      console.error('otp error ', error);
      setError(error.message || 'Something went wrong');
      ToastAndroid.showWithGravity(
        'Verification Failed',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <StatusBar translucent={true} backgroundColor={'transparent'} />
          <Text style={styles.header}>Register</Text>
          <CustomInput
            label="Business Name"
            placeholder="Enter your business name"
            iconName="business-outline"
            value={form.businessName}
            onChangeText={text => handleInputChange('businessName', text)}
          />
          <CustomInput
            label="User Name"
            placeholder="Enter your user name"
            iconName="person-outline"
            value={form.userName}
            onChangeText={text => handleInputChange('userName', text)}
          />
          <CustomInput
            label="Address"
            placeholder="Enter your address"
            iconName="home-outline"
            value={form.address}
            onChangeText={text => handleInputChange('address', text)}
          />
          <CustomInput
            label="Contact"
            placeholder="Enter your contact"
            iconName="call-outline"
            value={form.contact}
            onChangeText={text => handleInputChange('contact', text)}
            keyboardType="phone-pad"
          />
          <CustomInput
            label="Email"
            placeholder="Enter your email"
            iconName="mail"
            value={form.email}
            onChangeText={text => handleInputChange('email', text)}
            keyboardType="email-address"
          />
          <CustomInput
            label="Password"
            placeholder="Enter your password"
            iconName="lock-closed-outline"
            value={form.password}
            onChangeText={text => handleInputChange('password', text)}
            secureTextEntry={true}
          />
          <CustomDropdown
            data={DataType}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            searchPlaceholder="Search..."
            value={busiType}
            onChange={item => {
              setbusiType(item);
            }}
            label={'Business Type'}
            placeholder={
              <View
                style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                <MaterialIcons
                  name="add-business"
                  color={'#ffffff'}
                  size={24}
                />
                <Text style={{fontWeight: '500', paddingLeft: 10}}>
                  Select Business Type
                </Text>
              </View>
            }
          />
          <CustomButton
            title={
              loading ? (
                <ActivityIndicator size={'small'} color={'#ffffff'} />
              ) : (
                'Register'
              )
            }
            onPress={handleSubmit}
          />
          <CustomButton
            title="Already have an account? Login"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          />
        </ScrollView>
      </View>
      {otpModel && (
        <View style={styles.otpContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 20,
            }}>
            <Text></Text>
            <View>
              <Text style={styles.otpText}>Enter OTP</Text>
            </View>

            <TouchableOpacity onPress={() => setOtpModel(!otpModel)}>
              <AntDesign name="close" size={20} color={'#ffffffff'} />
            </TouchableOpacity>
          </View>

          <OtpInput
            numberOfDigits={4}
            focusColor="green"
            focusStickBlinkingDuration={500}
            onTextChange={text => setOtp(text)}
            onFilled={text => console.log(`OTP is ${text}`)}
            textInputProps={{
              accessibilityLabel: 'One-Time Password',
            }}
            theme={{
              containerStyle: {width: width, padding: 30},
              pinCodeContainerStyle: {width: width / 6},
              pinCodeTextStyle: styles.pinCodeText,
              focusStickStyle: styles.focusStick,
              focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            }}
          />
          <CustomButton
            onPress={handleOtpVerification}
            title={loading ? 'Verifying...' : 'Verify OTP'}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.backColor,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginVertical: 30,
  },
  loginButton: {
    backgroundColor: Colors.secondary,
    marginTop: 10,
  },
  otpContainer: {
    backgroundColor: Colors.secondary,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 20,
  },
  otpText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: '#000',
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});

export default Register;
