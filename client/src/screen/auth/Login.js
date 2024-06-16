import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/UserSlice';
import {OtpInput} from 'react-native-otp-entry';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [emailFor, setEmailFor] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPass, setForgotPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadFor, setLoadFor] = useState(false);
  const [loadSub, setLoadSub] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [otp, setOtp] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    console.log(email, password);
    try {
      const res = await axios.post('http://10.0.2.2:5000/api/v1/auth/login', {
        email,
        password,
      });
      console.log('login res', res);
      setLoading(false);
      if (res?.data?.AccessToken) {
        await AsyncStorage.setItem('AsyncUser', res?.data?.AccessToken);
        dispatch(
          setUser({
            token: res?.data?.AccessToken,
            userInfo: res.data.user,
          }),
        );
        console.log('login token check ', res?.data?.AccessToken)
        console.log("login user check ", res?.data?.user)
        navigation.navigate('Dashboard');
      }

      ToastAndroid.show('Login Successfully', ToastAndroid.SHORT);
      console.log('Email:', email);
      console.log('Password:', password);
      setEmail('');
      setPassword('');
      // navigation.replace('Dashboard');
      navigation.navigate('Dashboard');
    } catch (error) {
      ToastAndroid.show('Login failed. Please try again.', ToastAndroid.SHORT);
      console.error('Login error:', error);
    }
  };

  const handleForget = async () => {
    try {
      setLoadFor(true);
      const resFor = await axios.post(
        'http://10.0.2.2:5000/api/v1/auth/forget',
        {email: emailFor},
      );
      console.log('resFor ', resFor);
      ToastAndroid.show('OTP sent successfully!', ToastAndroid.SHORT);
      setLoadFor(false);
    } catch (error) {
      console.log('forget error ', error);
      ToastAndroid.show(
        'Failed to send OTP. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };

  const forgetData = {
    email: emailFor,
    otp: otp,
    password: newPassword,
    confirmPassword: newPassword1,
  };

  const forgetVerify = async () => {
    try {
      setLoadSub(true);
      const res = await axios.post(
        'http://10.0.2.2:5000/api/v1/auth/resetPassword',
        forgetData,
      );
      // console.log('res resetPassword ', res);
      setLoadSub(false);
      setForgotPass(!forgotPass);
      ToastAndroid.show('Password reset successful!', ToastAndroid.SHORT);
    } catch (error) {
      console.error(error);
      ToastAndroid.show(
        'Failed to reset password. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <Text
          style={styles.title}
          onPress={() => navigation.navigate('RegisterCompany')}>
          Login
        </Text>
        <CustomInput
          label="Email"
          placeholder="Enter your email"
          iconName="mail-outline"
          onChangeText={e => setEmail(e)}
          value={email}
          keyboardType="email-address"
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          iconName="lock-closed-outline"
          secureTextEntry
          onChangeText={p => setPassword(p)}
          value={password}
        />
        <TouchableOpacity onPress={() => setForgotPass(!forgotPass)}>
          <Text
            style={{
              textAlign: 'right',
              padding: 10,
              textTransform: 'capitalize',
              fontWeight: '700',
              fontSize: 20,
              color: Colors.primary,
            }}>
            forgot password
          </Text>
        </TouchableOpacity>
        <CustomButton
          title={
            loading ? (
              <ActivityIndicator size={'small'} color={'#ffffff'} />
            ) : (
              'Login'
            )
          }
          onPress={handleLogin}
        />
        <CustomButton
          title="Not Registered? Sign Up"
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
        />
      </View>
      {forgotPass && (
        <View style={styles.otpContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 20,
            }}>
            <Text></Text>
            <View>
              <Text style={styles.otpText}>forgot password</Text>
            </View>

            <TouchableOpacity onPress={() => setForgotPass(!forgotPass)}>
              <AntDesign name="close" size={20} color={'#ffffffff'} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={{
              backgroundColor: Colors.innerBack,
              margin: 20,
              borderRadius: 10,
            }}>
            <View style={{paddingHorizontal: 40}}>
              <CustomInput
                label="Email"
                placeholder="Enter your email"
                iconName="mail-outline"
                onChangeText={e => setEmailFor(e)}
                value={emailFor}
                keyboardType="email-address"
              />
              <View style={{width: 150}}>
                <CustomButton
                  title={
                    loadFor ? (
                      <ActivityIndicator
                        style={{textAlign: 'right'}}
                        size={'small'}
                        color={'#ffff'}
                      />
                    ) : (
                      'Send Otp'
                    )
                  }
                  onPress={handleForget}
                />
              </View>

              <View>
                <OtpInput
                  numberOfDigits={4}
                  focusColor={Colors.primary}
                  focusStickBlinkingDuration={500}
                  onTextChange={text => setOtp(text)}
                  onFilled={text => console.log(`OTP is ${text}`)}
                  textInputProps={{
                    accessibilityLabel: 'One-Time Password',
                  }}
                  theme={{
                    containerStyle: {width: '100%'},
                    pinCodeContainerStyle: {width: width / 7},
                  }}
                />
              </View>

              <CustomInput
                label="New Password"
                placeholder="New password"
                iconName="lock-closed-outline"
                secureTextEntry
                onChangeText={setNewPassword}
                value={newPassword}
              />
              <CustomInput
                label="New Confirm Password"
                placeholder="New Confirm password"
                iconName="lock-closed-outline"
                secureTextEntry
                onChangeText={setNewPassword1}
                value={newPassword1}
              />
              <CustomButton title={loadSub? <ActivityIndicator size={'small'} color={'#ffffff'}/> :'Submit'} onPress={forgetVerify} />
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.backColor,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: Colors.secondary,
  },
  otpContainer: {
    backgroundColor: Colors.secondary,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
  },
  otpText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
});
