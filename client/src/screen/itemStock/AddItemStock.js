// import React, {useState, useEffect, useCallback, useMemo} from 'react';
// import {
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   Text,
//   Image,
//   Button,
//   Alert,
//   ToastAndroid,
//   ActivityIndicator,
//   FlatList,
// } from 'react-native';
// import {DrawerActions} from '@react-navigation/native';
// import CustomHeader from '../../component/CustomHeader';
// import CustomInput from '../../component/CustomInput';
// import CustomButton from '../../component/CustomButton';
// import {Colors} from '../../constant/Colors';
// import DocumentPicker from 'react-native-document-picker';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import CustomDropdown from '../../component/CustomDropdown';
// import axios from 'axios';

// const {height, width} = Dimensions.get('window');
// const batchEnable = [
//   {label: 'YES', value: 'YES'},
//   {label: 'NO', value: 'NO'},
// ];

// const expiryEnable = [
//   {label: 'YES', value: 'YES'},
//   {label: 'NO', value: 'NO'},
// ];

// const typeTex = [
//   {label: 'Exempted', value: 'Exempted'},
//   {label: 'Nil Rated', value: 'Nil Rated'},
//   {label: 'Non GST', value: 'Non GST'},
//   {label: 'Taxable', value: 'Taxable'},
// ];

// const AddItemStock = ({navigation, route}) => {
//   const stockid = route?.param;
//   const [stockInput, setStockInput] = useState({
//     productName: '',
//     productCode: '',
//     category: null,
//     unit: null,
//     enableBatch: null,
//     batchNumber: '',
//     enableExpiry: null,
//     expiryDate: '',
//     manufacturer: '',
//     hsnCode: '',
//     taxType: null,
//     gstRate: '',
//     purchasePriceExcludeGst: '',
//     purchasePriceInclusiveGst: '',
//     mrp: '',
//     salePriceExcludeGst: '',
//     salePriceInclusiveGst: '',
//     discountPercent: '',
//     discountAmount: '',
//     wholesalePrice: '',
//     retailPrice: '',
//     stockDetail: [],
//     productFeatures: '',
//     description: '',
//     serialNumber: '',
//     barCode: '',
//     minimumStock: '',
//     maximumStock: '',
//   });
//   const [table, setTable] = useState([
//     {
//       quantity: '',
//       unit: null,
//       rate: '',
//       amount: '',
//     },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [show, setShow] = useState(false);
//   const [date, setDate] = useState(new Date());
//   const [screenToggle, setScreenToggle] = useState(1);
//   const [imageUri, setImageUri] = useState(null);
//   const [selectBatch, setSelectBatch] = useState(null);
//   const [selectExpiry, setSelectExpiry] = useState(null);
//   const [gstType, setGstType] = useState(null);
//   const [myCategory, setMyCategory] = useState([]);
//   const [myUnit, setMyUnit] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null)
//   const [selectedUnit, setSelectedUnit] = useState(null)

//   const uploadImage = async imageUri => {
//     const formData = new FormData();
//     formData.append('image', {
//       uri: imageUri.uri,
//       type: imageUri.type,
//       name: imageUri.fileName,
//     });

//     try {
//       const response = await axios.post(
//         'http://10.0.2.2:5000/api/v1/upload-image',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );
//       return response.data.imagePath;
//     } catch (error) {
//       console.error('Error uploading image:', error.message);
//       throw new Error('Failed to upload image');
//     }
//   };

//   useEffect(() => {
//     fetchCategory();
//     fetchUnit();
//   }, []);

//   const fetchCategory = async () => {
//     try {
//       const response = await axios.get('http://10.0.2.2:5000/api/v1/item/');
//       setMyCategory(response?.data?.items);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       ToastAndroid.show('Error fetching categories', ToastAndroid.SHORT);
//     }
//   };

//   const fetchUnit = async () => {
//     try {
//       const response = await axios.get('http://10.0.2.2:5000/api/v1/unit/');
//       setMyUnit(response?.data?.data);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       ToastAndroid.show('Error fetching categories', ToastAndroid.SHORT);
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     try {
//       let imagePath = null;
//       if (imageUri) {
//         imagePath = await uploadImage(imageUri);
//       }

//       // const data = {
//       //   productPhoto: imagePath,
//       //   unit: myUnit,
//       //   category: myCategory,
//       //   enableBatch: selectBatch,
//       //   enableExpiry: selectExpiry,
//       //   taxType: gstType,
//       //   ...stockInput,
//       //   stockDetail: table.map(row => ({
//       //     ...row,
//       //     unit: unitMal,
//       //   })),
//       // };

//       const data = {
//         // productName: 'Sample Product',
//         // productCode: 'SP123',
//         ...stockInput,
//         category: 'Example Item',
//         unit: 'nameee',
//         enableBatch: selectBatch,
//         // batchNumber: 'BN001',
//         enableExpiry: selectExpiry,
//         // expiryDate: '2025-12-31',
//         // manufacturer: 'Sample Manufacturer',
//         // hsnCode: '123456',
//         // taxType: 'GST',
//         // gstRate: 18,
//         // purchasePriceExcludeGst: 100,
//         // purchasePriceInclusiveGst: 118,
//         // mrp: 150,
//         // salePriceExcludeGst: 130,
//         // salePriceInclusiveGst: 153.4,
//         // discountPercent: 10,
//         // discountAmount: 13,
//         // wholesalePrice: 120,
//         // retailPrice: 140,
//         stockDetail: [
//           {
//             ...table,
//             // quantity: 2,
//             unit: selectedUnit,
//             // rate: 254,
//             // amount: 258,
//           },
//         ],
//         // productFeatures: 'Feature1, Feature2',
//         // description: 'Sample product description',
//         // serialNumber: 'SN123456',
//         // barCode: '012345678912',
//         // minimumStock: 10,
//         // maximumStock: 100,
//         productPhoto: imagePath,
//       };

//       console.log('data of form : ', data);

//       const url = stockid
//         ? `http://10.0.2.2:5000/api/v1/stock/${stockid._id}`
//         : 'http://10.0.2.2:5000/api/v1/stock/';
//       const method = stockid ? 'put' : 'post';
//       const message = stockid
//         ? 'Stock updated successfully'
//         : 'Stock created successfully';

//         console.log("stock url : ", url)
//         console.log("stock message : ", message)
//         console.log("stock method : ", method)
//       await axios[method](url, data, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       Alert.alert('Success', message);
//       navigation.navigate('ItemStock');
//       resetForm();
//     } catch (error) {
//       console.error('Error handling stock:', error.message);
//       Alert.alert('Error', 'Failed to handle stock');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setStockInput({
//       productName: '',
//       productCode: '',
//       category: null,
//       unit: null,
//       enableBatch: null,
//       batchNumber: '',
//       enableExpiry: null,
//       expiryDate: '',
//       manufacturer: '',
//       hsnCode: '',
//       taxType: null,
//       gstRate: '',
//       purchasePriceExcludeGst: '',
//       purchasePriceInclusiveGst: '',
//       mrp: '',
//       salePriceExcludeGst: '',
//       salePriceInclusiveGst: '',
//       discountPercent: '',
//       discountAmount: '',
//       wholesalePrice: '',
//       retailPrice: '',
//       stockDetail: [],
//       productFeatures: '',
//       description: '',
//       serialNumber: '',
//       barCode: '',
//       minimumStock: '',
//       maximumStock: '',
//     });
//     setTable([
//       {
//         quantity: '',
//         unit: null,
//         rate: '',
//         amount: '',
//       },
//     ]);
//   };

//   const handleOnchangeText = (text, name) => {
//     setStockInput(prevState => ({...prevState, [name]: text}));
//   };

//   const pickImage = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.images],
//       });
//       const source = {
//         uri: res[0].uri,
//         type: res[0].type,
//         fileName: res[0].name,
//       };
//       setImageUri(source);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log('User cancelled image picker');
//       } else {
//         console.error('DocumentPicker Error: ', err);
//         Alert.alert('Error', 'Error picking image.');
//       }
//     }
//   };

//   const handleSubmitNext = useCallback(() => {
//     setScreenToggle(2);
//   }, []);

//   const handleToggle = useCallback(t => {
//     setScreenToggle(t);
//   }, []);

//   const onChangeDate = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(Platform.OS === 'ios');
//     setDate(currentDate);
//     setStockInput(prevState => ({
//       ...prevState,
//       expiryDate: currentDate.toDateString(),
//     }));
//   };

//   const handleTableChange = (index, field, value) => {
//     const newTable = table.map((row, i) =>
//       i === index ? {...row, [field]: value} : row,
//     );
//     setTable(newTable);
//   };

//   const handleAddRow = () => {
//     setTable([
//       ...table,
//       {
//         quantity: '',
//         unit: null,
//         rate: '',
//         amount: '',
//       },
//     ]);
//   };

//   const removeTableRow = index => {
//     setTable(table.filter((_, i) => i !== index));
//   };

//   const renderItem = ({item, index}) => (
//     <View style={styles.tableRow}>
//       <CustomInput
//         label="Quantity"
//         value={item.quantity}
//         onChangeText={text => handleTableChange(index, 'quantity', text)}
//       />
//       <CustomInput value={myUnit} />
//       <CustomInput
//         label="Rate"
//         value={item.rate}
//         onChangeText={text => handleTableChange(index, 'rate', text)}
//       />
//       <CustomInput
//         label="Amount"
//         value={item.amount}
//         onChangeText={text => handleTableChange(index, 'amount', text)}
//       />
//       <TouchableOpacity onPress={() => removeTableRow(index)}>
//         <AntDesign name="delete" size={25} color={Colors.primary} />
//       </TouchableOpacity>
//     </View>
//   );

//   const calculateGST = useCallback(() => {
//     const gstRate = parseFloat(stockInput.gstRate) || 0;
//     const purchasePriceExcludeGst =
//       parseFloat(stockInput.purchasePriceExcludeGst) || 0;
//     const purchasePriceInclusiveGst =
//       purchasePriceExcludeGst + (purchasePriceExcludeGst * gstRate) / 100;
//     const salePriceExcludeGst = parseFloat(stockInput.salePriceExcludeGst) || 0;
//     const salePriceInclusiveGst =
//       salePriceExcludeGst + (salePriceExcludeGst * gstRate) / 100;

//     setStockInput(prevState => ({
//       ...prevState,
//       purchasePriceInclusiveGst: purchasePriceInclusiveGst.toFixed(2),
//       salePriceInclusiveGst: salePriceInclusiveGst.toFixed(2),
//     }));
//   }, [
//     stockInput.gstRate,
//     stockInput.purchasePriceExcludeGst,
//     stockInput.salePriceExcludeGst,
//   ]);

//   useEffect(() => {
//     calculateGST();
//   }, [calculateGST]);

//   console.log("category data : ", myCategory)
//   return (
//     <>
//       <CustomHeader
//         title={stockid ? 'Update Stock' : 'Add Stock'}
//         onPressArrow={() => navigation.goBack()}
//         onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
//       />
//       <View style={styles.toggleContainer}>
//         <TouchableOpacity
//           onPress={() => handleToggle(1)}
//           style={[
//             styles.textBack,
//             screenToggle === 1 ? styles.activeToggle : '',
//           ]}
//         >
//           <Text
//             style={[
//               styles.toggleText,
//               screenToggle === 1 ? styles.activeToggleText : '',
//             ]}
//           >
//             Product Info
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => handleToggle(2)}
//           style={[
//             styles.textBack,
//             screenToggle === 2 ? styles.activeToggle : '',
//           ]}
//         >
//           <Text
//             style={[
//               styles.toggleText,
//               screenToggle === 2 ? styles.activeToggleText : '',
//             ]}
//           >
//             Price Details
//           </Text>
//         </TouchableOpacity>
//       </View>
//       {screenToggle === 1 && (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <View style={styles.container}>
//             <CustomInput
//               label="Name"
//               onChangeText={text => handleOnchangeText(text, 'productName')}
//               value={stockInput.productName}
//             />
//             <CustomInput
//               label="Product Code"
//               onChangeText={text => handleOnchangeText(text, 'productCode')}
//               value={stockInput.productCode}
//             />
//             <CustomDropdown
//               data={myCategory}
//               search
//               maxHeight={300}
//               labelField="name"
//               valueField="name"
//               searchPlaceholder="Search..."
//               value={selectedCategory}
//               onChangeForm={item => {
//                 console.log("selectedCategory : ", item?.name)
//                 setSelectedCategory(item?.name);
//               }}
//               label={'Category'}
//               placeholder={false}
//             />
//             <CustomDropdown
//               data={myUnit}
//               search
//               maxHeight={300}
//               labelField="formalName"
//               valueField="formalName"
//               searchPlaceholder="Search..."
//               value={selectedUnit}
//               onChangeForm={item => {
//                 console.log("selectedUnit : ", item?.formalName)
//                 setSelectedUnit(item?.formalName);
//               }}
//               label={'Unit'}
//               placeholder={false}
//             />
//             <CustomDropdown
//               data={batchEnable}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               searchPlaceholder="Search..."
//               value={selectBatch}
//               onChangeForm={item => {
//                 console.log("selectBatch : ", item)
//                 setSelectBatch(item?.label);
//               }}
//               label={'Enable Batch'}
//               placeholder={false}
//             />
//               <CustomInput
//                 label="Batch Number"
//                 onChangeText={text => handleOnchangeText(text, 'batchNumber')}
//                 value={stockInput.batchNumber}
//               />
//             <CustomDropdown
//               data={expiryEnable}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               searchPlaceholder="Search..."
//               value={selectExpiry}
//               onChangeForm={item => {
//                 console.log("expiryEnable : ", item)
//                 setSelectExpiry(item?.label);
//               }}
//               label={'Enable Expiry'}
//               placeholder={false}
//             />
            
//               <CustomInput
//                 label="Expiry Date"
//                 onChangeText={text => handleOnchangeText(text, 'expiryDate')}
//                 value={stockInput.expiryDate}
//                 rightIconName={
//                   <TouchableOpacity onPress={() => setShow(!show)}>
//                     <AntDesign name="calendar" color={'#000'} size={24} />
//                   </TouchableOpacity>
//                 }
//               />
            
//             <CustomInput
//               label="Manufacturer"
//               onChangeText={text => handleOnchangeText(text, 'manufacturer')}
//               value={stockInput.manufacturer}
//             />
//             <CustomInput
//               label="HSN Code"
//               onChangeText={text => handleOnchangeText(text, 'hsnCode')}
//               value={stockInput.hsnCode}
//             />
//             <CustomDropdown
//               data={typeTex}
//               search
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               searchPlaceholder="Search..."
//               value={gstType}
//               onChangeForm={item => {
//                 console.log("type tex : ", item)
//                 setGstType(item?.label);
//               }}
//               label={'GST Type'}
//               placeholder={false}
//             />
//             <CustomInput
//               label="GST Rate"
//               onChangeText={text => handleOnchangeText(text, 'gstRate')}
//               value={stockInput.gstRate}
//             />
//             <View style={{flexDirection: 'row', width: width / 2}}>
//               <TouchableOpacity
//                 onPress={pickImage}
//                 style={styles.uploadContainer}
//               >
//                 <AntDesign name="cloudupload" color={'#000'} size={24} />
//                 <Text style={styles.uploadText}>Upload Image</Text>
//               </TouchableOpacity>
//               {imageUri && (
//                 <Image
//                   source={{uri: imageUri.uri}}
//                   style={{width: 50, height: 50}}
//                 />
//               )}
//             </View>
//             <CustomButton
//               title={'Next'}
//               onPress={handleSubmitNext}
//               buttonStyle={styles.customButton}
//             />
//           </View>
//         </ScrollView>
//       )}
//       {screenToggle === 2 && (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <View style={styles.container}>
//             <CustomInput
//               label="Purchase Price (Excl. GST)"
//               onChangeText={text =>
//                 handleOnchangeText(text, 'purchasePriceExcludeGst')
//               }
//               value={stockInput.purchasePriceExcludeGst}
//             />
//             <CustomInput
//               label="Purchase Price (Incl. GST)"
//               onChangeText={text =>
//                 handleOnchangeText(text, 'purchasePriceInclusiveGst')
//               }
//               value={stockInput.purchasePriceInclusiveGst}
//             />
//             <CustomInput
//               label="MRP"
//               onChangeText={text => handleOnchangeText(text, 'mrp')}
//               value={stockInput.mrp}
//             />
//             <CustomInput
//               label="Sale Price (Excl. GST)"
//               onChangeText={text =>
//                 handleOnchangeText(text, 'salePriceExcludeGst')
//               }
//               value={stockInput.salePriceExcludeGst}
//             />
//             <CustomInput
//               label="Sale Price (Incl. GST)"
//               onChangeText={text =>
//                 handleOnchangeText(text, 'salePriceInclusiveGst')
//               }
//               value={stockInput.salePriceInclusiveGst}
//             />
//             <CustomInput
//               label="Discount Percent"
//               onChangeText={text => handleOnchangeText(text, 'discountPercent')}
//               value={stockInput.discountPercent}
//             />
//             <CustomInput
//               label="Discount Amount"
//               onChangeText={text => handleOnchangeText(text, 'discountAmount')}
//               value={stockInput.discountAmount}
//             />
//             <CustomInput
//               label="Wholesale Price"
//               onChangeText={text => handleOnchangeText(text, 'wholesalePrice')}
//               value={stockInput.wholesalePrice}
//             />
//             <CustomInput
//               label="Retail Price"
//               onChangeText={text => handleOnchangeText(text, 'retailPrice')}
//               value={stockInput.retailPrice}
//             />
//             <CustomInput
//               label="Product Features"
//               onChangeText={text => handleOnchangeText(text, 'productFeatures')}
//               value={stockInput.productFeatures}
//             />
//             <CustomInput
//               label="Description"
//               onChangeText={text => handleOnchangeText(text, 'description')}
//               value={stockInput.description}
//             />
//             <CustomInput
//               label="Serial Number"
//               onChangeText={text => handleOnchangeText(text, 'serialNumber')}
//               value={stockInput.serialNumber}
//             />
//             <CustomInput
//               label="Bar Code"
//               onChangeText={text => handleOnchangeText(text, 'barCode')}
//               value={stockInput.barCode}
//             />
//             <CustomInput
//               label="Minimum Stock"
//               onChangeText={text => handleOnchangeText(text, 'minimumStock')}
//               value={stockInput.minimumStock}
//             />
//             <CustomInput
//               label="Maximum Stock"
//               onChangeText={text => handleOnchangeText(text, 'maximumStock')}
//               value={stockInput.maximumStock}
//             />
//             <Text style={styles.subtitle}>Stock Details</Text>

//             <FlatList
//               data={table}
//               renderItem={renderItem}
//               keyExtractor={(item, index) => index.toString()}
//               style={{marginBottom: 20}}
//               horizontal
//             />
//             <CustomButton title="Add Row" onPress={handleAddRow} />

//             {loading ? (
//               <ActivityIndicator size="large" color="#0000ff" />
//             ) : (
//               <CustomButton
//                 title={'Submit'}
//                 onPress={handleSubmit}
//                 buttonStyle={styles.customButton}
//               />
//             )}
//           </View>
//         </ScrollView>
//       )}
//       {show && (
//         <DateTimePicker
//           testID="dateTimePicker"
//           value={date}
//           mode={'date'}
//           display="default"
//           onChange={onChangeDate}
//         />
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     paddingBottom: 150,
//   },
//   container: {
//     padding: 20,
//     paddingBottom: 50,
//   },
//   toggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//   },
//   textBack: {
//     backgroundColor: Colors.backgroundColor,
//     width: width * 0.45,
//     padding: 10,
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   activeToggle: {
//     backgroundColor: Colors.primary,
//   },
//   toggleText: {
//     fontSize: 16,
//   },
//   activeToggleText: {
//     color: '#FFF',
//   },
//   uploadContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.backgroundColor,
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 10,
//     width: '100%',
//   },
//   uploadText: {
//     marginLeft: 10,
//   },
//   customButton: {
//     marginTop: 20,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   removeButton: {
//     color: 'red',
//     marginLeft: 8,
//   },
// });

// export default AddItemStock;



import React, {useState, useEffect, useCallback} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Button,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import CustomHeader from '../../component/CustomHeader';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';
import DocumentPicker from 'react-native-document-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDropdown from '../../component/CustomDropdown';
import axios from 'axios';

const {height, width} = Dimensions.get('window');
const batchEnable = [
  {label: 'YES', value: 'YES'},
  {label: 'NO', value: 'NO'},
];

const expiryEnable = [
  {label: 'YES', value: 'YES'},
  {label: 'NO', value: 'NO'},
];

const typeTex = [
  {label: 'Exempted', value: 'Exempted'},
  {label: 'Nil Rated', value: 'Nil Rated'},
  {label: 'Non GST', value: 'Non GST'},
  {label: 'Taxable', value: 'Taxable'},
];

const AddItemStock = ({navigation, route}) => {
  const stockid = route?.param;
  const [stockInput, setStockInput] = useState({
    productName: '',
    productCode: '',
    category: null,
    unit: null,
    enableBatch: null,
    batchNumber: '',
    enableExpiry: null,
    expiryDate: '',
    manufacturer: '',
    hsnCode: '',
    taxType: null,
    gstRate: '',
    purchasePriceExcludeGst: '',
    purchasePriceInclusiveGst: '',
    mrp: '',
    salePriceExcludeGst: '',
    salePriceInclusiveGst: '',
    discountPercent: '',
    discountAmount: '',
    wholesalePrice: '',
    retailPrice: '',
    stockDetail: [],
    productFeatures: '',
    description: '',
    serialNumber: '',
    barCode: '',
    minimumStock: '',
    maximumStock: '',
  });
  const [table, setTable] = useState([
    {
      quantity: '',
      unit: null,
      rate: '',
      amount: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [screenToggle, setScreenToggle] = useState(1);
  const [imageUri, setImageUri] = useState(null);
  const [selectBatch, setSelectBatch] = useState(null);
  const [selectExpiry, setSelectExpiry] = useState(null);
  const [gstType, setGstType] = useState(null);
  const [myCategory, setMyCategory] = useState([]);
  const [myUnit, setMyUnit] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const uploadImage = async imageUri => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri.uri,
      type: imageUri.type,
      name: imageUri.fileName,
    });

    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/api/v1/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data.imagePath;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw new Error('Failed to upload image');
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchUnit();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/item/');
      setMyCategory(response?.data?.items);
    } catch (error) {
      console.error('Error fetching categories:', error);
      ToastAndroid.show('Error fetching categories', ToastAndroid.SHORT);
    }
  };

  const fetchUnit = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/unit/');
      setMyUnit(response?.data?.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      ToastAndroid.show('Error fetching categories', ToastAndroid.SHORT);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      let imagePath = null;
      if (imageUri) {
        imagePath = await uploadImage(imageUri);
      }

      const data = {
        ...stockInput,
        category: 'Example Item',
        unit: 'nameee',
        enableBatch: selectBatch,
        enableExpiry: selectExpiry,
        stockDetail: [
          {
            ...table,
            unit: selectedUnit,
          },
        ],
        productPhoto: imagePath,
      };

      console.log('data of form : ', data);

      const url = stockid
        ? `http://10.0.2.2:5000/api/v1/stock/${stockid._id}`
        : 'http://10.0.2.2:5000/api/v1/stock/';
      const method = stockid ? 'put' : 'post';
      const message = stockid
        ? 'Stock updated successfully'
        : 'Stock created successfully';

      console.log('stock url : ', url);
      console.log('stock message : ', message);
      console.log('stock method : ', method);
      await axios[method](url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Success', message);
      navigation.navigate('ItemStock');
      resetForm();
    } catch (error) {
      console.error('Error handling stock:', error.message);
      Alert.alert('Error', 'Failed to handle stock');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStockInput({
      productName: '',
      productCode: '',
      category: null,
      unit: null,
      enableBatch: null,
      batchNumber: '',
      enableExpiry: null,
      expiryDate: '',
      manufacturer: '',
      hsnCode: '',
      taxType: null,
      gstRate: '',
      purchasePriceExcludeGst: '',
      purchasePriceInclusiveGst: '',
      mrp: '',
      salePriceExcludeGst: '',
      salePriceInclusiveGst: '',
      discountPercent: '',
      discountAmount: '',
      wholesalePrice: '',
      retailPrice: '',
      stockDetail: [],
      productFeatures: '',
      description: '',
      serialNumber: '',
      barCode: '',
      minimumStock: '',
      maximumStock: '',
    });
    setTable([
      {
        quantity: '',
        unit: null,
        rate: '',
        amount: '',
      },
    ]);
  };

  const handleOnchangeText = (text, name) => {
    setStockInput(prevState => ({...prevState, [name]: text}));
  };

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const source = {
        uri: res[0].uri,
        type: res[0].type,
        fileName: res[0].name,
      };
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

  const handleSubmitNext = useCallback(() => {
    setScreenToggle(2);
  }, []);

  const handleToggle = useCallback(t => {
    setScreenToggle(t);
  }, []);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setStockInput(prevState => ({
      ...prevState,
      expiryDate: currentDate.toDateString(),
    }));
  };

  const handleTableChange = (index, field, value) => {
    const newTable = table.map((row, i) =>
      i === index ? {...row, [field]: value} : row,
    );
    setTable(newTable);
  };

  const handleAddRow = () => {
    setTable([
      ...table,
      {
        quantity: '',
        unit: null,
        rate: '',
        amount: '',
      },
    ]);
  };

  const removeTableRow = index => {
    setTable(table.filter((_, i) => i !== index));
  };

  const calculateGST = () => {
    const gstRate = parseFloat(stockInput.gstRate) || 0;
    const purchasePrice = parseFloat(stockInput.purchasePriceExcludeGst) || 0;

    const gstAmount = (gstRate / 100) * purchasePrice;
    const purchasePriceInclusiveGst = purchasePrice + gstAmount;

    setStockInput(prevState => ({
      ...prevState,
      purchasePriceInclusiveGst: purchasePriceInclusiveGst.toFixed(2),
    }));
  };

  const calculateDiscountAmount = () => {
    const discountPercent = parseFloat(stockInput.discountPercent) || 0;
    const purchasePriceInclusiveGst = parseFloat(stockInput.purchasePriceInclusiveGst) || 0;

    const discountAmount = (discountPercent / 100) * purchasePriceInclusiveGst;

    setStockInput(prevState => ({
      ...prevState,
      discountAmount: discountAmount.toFixed(2),
    }));
  };

  useEffect(() => {
    calculateGST();
  }, [stockInput.gstRate, stockInput.purchasePriceExcludeGst]);

  useEffect(() => {
    calculateDiscountAmount();
  }, [stockInput.discountPercent, stockInput.purchasePriceInclusiveGst]);

  return (
    <View style={{flex: 1}}>
      <CustomHeader
        backIcon
        title="Add Stock"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <ScrollView
        style={{flex: 1, backgroundColor: Colors.white}}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={{paddingHorizontal: 16, marginTop: 16}}>
          <CustomInput
            label="Product Name"
            placeholder="Enter product name"
            value={stockInput.productName}
            onChangeText={text => handleOnchangeText(text, 'productName')}
          />
          <CustomInput
            label="Product Code"
            placeholder="Enter product code"
            value={stockInput.productCode}
            onChangeText={text => handleOnchangeText(text, 'productCode')}
          />
          {/* Add more input fields here */}
          <CustomDropdown
            label="Category"
            data={myCategory}
            value={selectedCategory}
            onSelect={item => setSelectedCategory(item)}
          />
          <CustomDropdown
            label="Unit"
            data={myUnit}
            value={selectedUnit}
            onSelect={item => setSelectedUnit(item)}
          />
          <CustomDropdown
            label="Enable Batch"
            data={batchEnable}
            value={selectBatch}
            onSelect={item => setSelectBatch(item)}
          />
          <CustomInput
            label="Batch Number"
            placeholder="Enter batch number"
            value={stockInput.batchNumber}
            onChangeText={text => handleOnchangeText(text, 'batchNumber')}
          />
          <CustomDropdown
            label="Enable Expiry"
            data={expiryEnable}
            value={selectExpiry}
            onSelect={item => setSelectExpiry(item)}
          />
          <View style={{marginBottom: 20}}>
            <Text style={styles.label}>Expiry Date</Text>
            <TouchableOpacity onPress={() => setShow(true)}>
              <View style={styles.datePicker}>
                <Text style={styles.dateText}>
                  {stockInput.expiryDate || 'Select date'}
                </Text>
                <AntDesign name="calendar" size={20} color={Colors.gray} />
              </View>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
          {/* Add more input fields here */}
          <CustomInput
            label="GST Rate"
            placeholder="Enter GST rate"
            value={stockInput.gstRate}
            onChangeText={text => handleOnchangeText(text, 'gstRate')}
            keyboardType="numeric"
          />
          <CustomInput
            label="Purchase Price (Exclude GST)"
            placeholder="Enter purchase price (exclude GST)"
            value={stockInput.purchasePriceExcludeGst}
            onChangeText={text => handleOnchangeText(text, 'purchasePriceExcludeGst')}
            keyboardType="numeric"
          />
          <CustomInput
            label="Purchase Price (Inclusive GST)"
            placeholder="Calculated purchase price (inclusive GST)"
            value={stockInput.purchasePriceInclusiveGst}
            editable={false}
            keyboardType="numeric"
          />
          <CustomInput
            label="Discount Percent"
            placeholder="Enter discount percent"
            value={stockInput.discountPercent}
            onChangeText={text => handleOnchangeText(text, 'discountPercent')}
            keyboardType="numeric"
          />
          <CustomInput
            label="Discount Amount"
            placeholder="Calculated discount amount"
            value={stockInput.discountAmount}
            editable={false}
            keyboardType="numeric"
          />
          {/* Add more input fields here */}
          <CustomButton
            title="Next"
            onPress={handleSubmitNext}
            style={{marginTop: 20}}
          />
          <CustomButton
            title="Submit"
            onPress={handleSubmit}
            style={{marginTop: 20}}
          />
          {loading && <ActivityIndicator size="large" color={Colors.primary} />}
        </View>
      </ScrollView>
    </View>
  );
};

export default AddItemStock;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 8,
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: Colors.black,
  },
});
