import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';
import CustomDropdown from '../../component/CustomDropdown';
import {CountryData} from './CountryData';
import StateData from './StateData';
import {DrawerActions} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

const {width, height} = Dimensions.get('window');

const data = [
  {label: 'YES', value: 'YES'},
  {label: 'NO', value: 'NO'},
];

const RegistrationType = [
  {label: 'REGULAR', value: 'REGULAR'},
  {label: 'COMPOSITION', value: 'COMPOSITION'},
];

const countryData = CountryData;

const stateData = StateData;

const RegisterCompany = ({navigation, route}) => {

  const [screenToggle, setScreenToggle] = useState(1);
  const [value, setValue] = useState(null);
  const [registerType, setRegisterType] = useState(null);
  const [inputs, setInputs] = useState({
    businessName: '',
    address: '',
    pinCode: '',
    contact: '',
    email: '',
    website: '',
    financialYear: '',
    taxRate: '',
    calculateTaxBaseOn: '',
    gstIn: '',
  });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    if (route.params) {
      const company = route.params;
      setInputs({
        businessName: company.businessName,
        address: company.address,
        pinCode: company.pinCode,
        contact: company.contact,
        email: company.email,
        website: company.website,
        financialYear: company.financialYear,
        taxRate: company.taxRate,
        calculateTaxBaseOn: company.calculateTaxBaseOn,
        gstIn: company.gstIn,
      });
      // setSelectedCountry(countryData.find(c => c.value === company.country));
      // setSelectedState(stateData[company.country].find(s => s.value === company.state));
      // setValue(data.find(d => d.value === company.enableGst));
      // setRegisterType(RegistrationType.find(r => r.value === company.registrationType));
      setImageUri({ uri: `http://10.0.2.2:5000/${company.companyLogo}` });
      setCompanyId(company._id);
    }
  }, [route.params]);

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const source = {uri: res[0].uri};
      setImageUri(source);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled image picker');
      } else {
        console.error('DocumentPicker Error: ', err);
        Alert.alert('Error', 'Error picking image.');
      }
    }
  };

  const handleInputChange = (name, value) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    if (!validateInputs()) {
      console.log('Form validation failed.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      if (imageUri && !imageUri.uri.includes('10.0.2.2:5000')) {
        formData.append('companyLogo', {
          uri: imageUri.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      }
      formData.append('businessName', inputs.businessName);
      formData.append('address', inputs.address);
      formData.append('state', selectedState ? selectedState.value : '');
      formData.append('country', selectedCountry ? selectedCountry.value : '');
      formData.append('pinCode', inputs.pinCode);
      formData.append('contact', inputs.contact);
      formData.append('email', inputs.email);
      formData.append('website', inputs.website);
      formData.append('financialYear', inputs.financialYear);
      formData.append('bookFrom', '123456780');
      formData.append('enableGst', value ? value.value : '');
      formData.append('s_state', selectedState ? selectedState.value : '');
      formData.append(
        'registrationType',
        registerType ? registerType.value : '',
      );
      formData.append('taxRate', inputs.taxRate);
      formData.append('calculateTaxBaseOn', inputs.calculateTaxBaseOn);
      formData.append('gstIn', inputs.gstIn);

      console.log('company formData : ', formData);

      let response;
      if (companyId) {
        response = await axios.put(
          `http://10.0.2.2:5000/api/v1/company/updateCompany/${companyId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      } else {
        response = await axios.post(
          'http://10.0.2.2:5000/api/v1/company/createCom',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }

      console.log('Form submitted successfully:', response.data);
      Alert.alert('Success', `Company ${companyId ? 'updated' : 'registered'} successfully.`);
      navigation.navigate('Dashboard');
      resetForm();
    } catch (error) {
      console.error(
        'Error submitting form:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Submission Error', `Failed to ${companyId ? 'update' : 'register'} company.`);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setImageUri(null);
    setInputs({
      businessName: '',
      address: '',
      pinCode: '',
      contact: '',
      email: '',
      website: '',
      financialYear: '',
      taxRate: '',
      calculateTaxBaseOn: '',
      gstIn: '',
    });
    setSelectedCountry(null);
    setSelectedState(null);
    setValue(null);
    setRegisterType(null);
    setCompanyId(null);
  };

  const validateInputs = () => {
    // Implement your validation logic here
    return true;
  };

  const handleToggle = t => {
    setScreenToggle(t);
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.backColor}}>
      <CustomHeader
        title={route.params ? 'Update Company' :'Create Company'}
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => handleToggle(1)}
          style={[
            styles.textBack,
            screenToggle === 1 ? {backgroundColor: Colors.primary} : '',
          ]}>
          <Text
            style={[
              styles.toggleText,
              screenToggle === 2 ? {color: Colors.primary} : '',
            ]}>
            Business Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleToggle(2)}
          style={[
            styles.textBack,
            screenToggle === 2 ? {backgroundColor: Colors.primary} : '',
          ]}>
          <Text
            style={[
              styles.toggleText,
              screenToggle === 1 ? {color: Colors.primary} : '',
            ]}>
            Statutory Details
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{padding: 10, marginBottom: 20}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{}}>
          <ScrollView>
            {screenToggle === 1 ? (
              <View style={{marginBottom: 200}}>
                <CustomInput
                  label="Business Name"
                  onChangeText={text => handleInputChange('businessName', text)}
                  value={inputs.businessName}
                />
                {imageUri && <Image source={imageUri} style={styles.image} />}
                <TouchableOpacity onPress={pickImage}>
                  <Text
                    style={{
                      borderBottomWidth: 2,
                      borderBottomColor: Colors.borderColor,
                      paddingBottom: 20,
                      paddingLeft: 15,
                      paddingTop: 10,
                    }}>
                    {imageUri ? imageUri.uri : 'Upload Image'}
                  </Text>
                </TouchableOpacity>
                <CustomInput
                  label="Address"
                  onChangeText={text => handleInputChange('address', text)}
                  value={inputs.address}
                />
                <CustomDropdown
                  data={countryData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  searchPlaceholder="Search..."
                  value={selectedCountry}
                  onChange={item => {
                    handleInputChange('country', item);
                    setSelectedCountry(item);
                    setSelectedState(null);
                  }}
                  label={'Country'}
                  placeholder={false}
                />
                <CustomDropdown
                  data={selectedCountry ? stateData[selectedCountry.value] : []}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  searchPlaceholder="Search..."
                  value={selectedState}
                  onChange={item => {
                    handleInputChange('state', item);
                    setSelectedState(item);
                  }}
                  label={'State'}
                  placeholder={false}
                />
                <CustomInput
                  label="Pin Code"
                  onChangeText={text => handleInputChange('pinCode', text)}
                  value={inputs.pinCode}
                  keyboardType="numeric"
                />
                <CustomInput
                  label="Contact Number"
                  onChangeText={text => handleInputChange('contact', text)}
                  value={inputs.contact}
                  keyboardType="phone-pad"
                />
                <CustomInput
                  label="Email"
                  onChangeText={text => handleInputChange('email', text)}
                  value={inputs.email}
                  keyboardType="email-address"
                />
                <CustomInput
                  label="Website"
                  onChangeText={text => handleInputChange('website', text)}
                  value={inputs.website}
                />
                <CustomInput
                  label="Financial Year"
                  onChangeText={text =>
                    handleInputChange('financialYear', text)
                  }
                  value={inputs.financialYear}
                />
                <CustomButton
                  title={'Save & Next ➡️'}
                  onPress={() => handleToggle(2)}
                />
              </View>
            ) : (
              <View style={{marginBottom: 200}}>
                <CustomDropdown
                  data={data}
                  value={value}
                  onChange={item => {
                    setValue(item);
                    handleInputChange('enableGst', item);
                  }}
                  valueField={'value'}
                  labelField={'label'}
                  searchPlaceholder={'Search...'}
                  placeholder={false}
                  label="Enable GST"
                />
                {value === 'YES' && (
                  <CustomDropdown
                    data={RegistrationType}
                    value={registerType}
                    onChange={item => {
                      setRegisterType(item);
                      handleInputChange('registrationType', item);
                    }}
                    valueField={'value'}
                    labelField={'label'}
                    searchPlaceholder={'Search...'}
                    placeholder={false}
                    label="Registration Type"
                  />
                )}
                <CustomInput
                  label="Tax Rate"
                  onChangeText={text => handleInputChange('taxRate', text)}
                  value={inputs.taxRate}
                />
                {value && value.value === 'YES' && (
                  <CustomInput
                    label="Calculate Tax"
                    onChangeText={text =>
                      handleInputChange('calculateTaxBaseOn', text)
                    }
                    value={inputs.calculateTaxBaseOn}
                  />
                )}
                <CustomInput
                  label="GSTIN"
                  onChangeText={text => handleInputChange('gstIn', text)}
                  value={inputs.gstIn}
                />
                <CustomButton title={route.params ? "Update" : "Create"} onPress={handleFormSubmit} />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default RegisterCompany;

const styles = StyleSheet.create({
  toggleText: {
    color: Colors.btnText,
    fontWeight: '400',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
  },
  toggleContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 10,
    width: '100%',
  },
  textBack: {
    padding: 10,
    width: '50%',
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
