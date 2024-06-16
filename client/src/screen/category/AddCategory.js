import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import DocumentPicker from 'react-native-document-picker';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';
import {DrawerActions} from '@react-navigation/native';

const {height} = Dimensions.get('window');
const AddCategory = ({navigation, route}) => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const category = route.params ? route.params.items : null;

  console.log('category ', category);
  useEffect(() => {
    if (category) {
      setName(category?.name);
      setImageUri({uri: `http://10.0.2.2:5000/${category.img}`});
    }
  }, [category]);

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

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Category name is required.');
      return;
    }

    if (!imageUri) {
      Alert.alert('No Image', 'Please pick an image first.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('img', {
        uri: imageUri.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      let response;
      if (category) {
        // Update existing category
        response = await axios.put(
          `http://10.0.2.2:5000/api/v1/category/updateCategory/${category._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      } else {
        // Create new category
        response = await axios.post(
          'http://10.0.2.2:5000/api/v1/category/add-category',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }

      console.log('Image uploaded successfully:', response.data);
      Alert.alert('Success', 'Category saved successfully.');
      navigation.navigate('CategoryList');
      setImageUri(null);
      setName('');
    } catch (error) {
      console.error(
        'Error uploading image:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Upload Error', 'Failed to save category.');
    } finally {
      setUploading(false);
    }
  };

  console.log('iiiiiii ', imageUri)
  return (
    <>
      <CustomHeader
        title={category ? 'Update Category' : 'Add Category'}
        onPressArrow={() => navigation.goBack()}
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <ScrollView style={{height: height, flexGrow: 1}}>
        <View style={styles.container}>
          <CustomInput
            label="Category Name"
            placeholder="Enter category name"
            onChangeText={setName}
            value={name}
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
              {imageUri ? imageUri?.uri : 'Upload Image'}
            </Text>
          </TouchableOpacity>
          {uploading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          ) : (
            <CustomButton
              title={category ? 'Update' : 'Submit'}
              onPress={handleSubmit}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default AddCategory;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.backColor,
    height:height
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
});
