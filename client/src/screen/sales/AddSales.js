import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
  Modal,
  Pressable,
} from 'react-native';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomHeader from '../../component/CustomHeader';
import CustomInput from '../../component/CustomInput';
import CustomButton from '../../component/CustomButton';
import {Colors} from '../../constant/Colors';
import CustomDropdown from '../../component/CustomDropdown';
import {Dropdown} from 'react-native-element-dropdown';
import RNPrint from 'react-native-print';
import moment from 'moment';

const AddSales = ({route}) => {
  const salesId = route?.params?.items;
  const navigation = useNavigation();

  const [discountModal, setDiscountModal] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [company, setCompany] = useState([]);
  const [stock, setStock] = useState([]);
  const [salesInput, setSalesInput] = useState({
    billingBy: null,
    address: '',
    contact: '',
    gstIn: '',
    billingTo: null,
    addressTo: '',
    contactTo: '',
    date: '',
    invoiceNo: '',
  });
  const [table, setTable] = useState([
    {
      barCode: '',
      productName: '',
      batchNo: '',
      expiry: '',
      qty: '',
      rate: '',
      amount: '',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [discountInput, setDiscountInput] = useState([
    {
      charges: '',
      discount: '',
    },
  ]);

  const handleDiscountOnchange = (index, field, value) => {
    const newDiscountInput = discountInput.map((item, i) =>
      i === index ? {...item, [field]: value} : item,
    );
    setDiscountInput(newDiscountInput);
  };

  const renderDiscountItem = ({item, index}) => (
    <View key={index} style={styles.modalRow}>
      <CustomInput
        placeholder="Charges"
        value={item.charges}
        onChangeText={text => handleDiscountOnchange(index, 'charges', text)}
        error={errors[`discount${index}charges`]}
      />
      <CustomInput
        placeholder="Discount"
        value={item.discount}
        onChangeText={text => handleDiscountOnchange(index, 'discount', text)}
        error={errors[`discount${index}discount`]}
      />
      {index !== 0 && (
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={() => handleRemoveDiscountRow(index)}
        >
          <AntDesign name="delete" size={20} color={'red'} />
        </TouchableOpacity>
      )}
    </View>
  );

  const handleAddDiscountRow = () => {
    setDiscountInput([
      ...discountInput,
      {
        charges: '',
        discount: '',
      },
    ]);
  };

  const handleRemoveDiscountRow = index => {
    const newDiscountInput = discountInput.filter((_, i) => i !== index);
    setDiscountInput(newDiscountInput);
  };

  useEffect(() => {
    if (salesId) {
      setSalesInput({
        billingBy: salesId?.billingBy || '',
        address: salesId?.address || '',
        contact: salesId?.contact || '',
        gstIn: salesId?.gstIn || '',
        billingTo: salesId?.billingTo || '',
        addressTo: salesId?.addressTo || '',
        contactTo: salesId?.contactTo || '',
        date: salesId?.date || '',
        invoiceNo: salesId?.invoiceNo || '',
      });
      setTable(
        salesId?.table || [
          {
            barCode: '',
            productName: '',
            batchNo: '',
            expiry: '',
            qty: '',
            rate: '',
            amount: '',
          },
        ],
      );
    }
  }, [salesId]);

  useEffect(() => {
    fetchCustomer();
    fetchCompany();
    fetchStock();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/customer/');
      setCustomer(response.data.data);
    } catch (error) {
      ToastAndroid.show('Error fetching customer', ToastAndroid.SHORT);
    }
  };

  const fetchCompany = async () => {
    try {
      const response = await axios.get(
        'http://10.0.2.2:5000/api/v1/company/getCompany',
      );
      setCompany(response.data.data);
    } catch (error) {
      ToastAndroid.show('Error fetching company', ToastAndroid.SHORT);
    }
  };

  const fetchStock = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/api/v1/stock');
      setStock(response.data.stocks);
    } catch (error) {
      ToastAndroid.show('Error fetching stock ', ToastAndroid.SHORT);
    }
  };

  const handleInputChange = (name, value) => {
    setSalesInput(prevState => ({...prevState, [name]: value}));
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
        barCode: '',
        productName: '',
        batchNo: '',
        expiry: '',
        qty: '',
        rate: '',
        amount: '',
      },
    ]);
  };

  const handleRemoveRow = index => {
    const newTable = table.filter((_, i) => i !== index);
    setTable(newTable);
  };

  // const validate = () => {
  //   let valid = true;
  //   let errors = {};

  //   Object.keys(salesInput).forEach(key => {
  //     if (!salesInput[key]) {
  //       errors[key] = 'This field is required';
  //       valid = false;
  //     }
  //   });

  //   if (table.length === 0) {
  //     errors.table = 'At least one table entry is required';
  //     valid = false;
  //   } else {
  //     table.forEach((row, index) => {
  //       Object.keys(row).forEach(key => {
  //         if (!row[key]) {
  //           errors[`table${index}${key}`] = 'This field is required';
  //           valid = false;
  //         }
  //       });
  //     });
  //   }

  //   setErrors(errors);
  //   return valid;
  // };

  const handleSubmit = async () => {
    // setLoading(true);

    const data = {
      ...salesInput,
      billingBy: selectedCompany,
      billingTo: selectedCustomer,
      table,
    };

    console.log('d', data);
    try {
      if (salesId) {
        await axios.put(
          `http://10.0.2.2:5000/api/v1/sales/${salesId._id}`,
          data,
        );
        Alert.alert('Success', 'Sale updated successfully');
      } else {
        // Create new sales entry
        await axios.post('http://10.0.2.2:5000/api/v1/sales/', data);
        Alert.alert('Success', 'Sale created successfully');
      }
      navigation.navigate('Sales');
      setSalesInput({
        billingBy: null,
        address: '',
        contact: '',
        gstIn: '',
        billingTo: null,
        addressTo: '',
        contactTo: '',
        date: '',
        invoiceNo: '',
      });
      setTable([
        {
          barCode: null,
          productName: '',
          batchNo: '',
          expiry: '',
          qty: '',
          rate: '',
          amount: '',
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setSalesInput(prevState => ({
      ...prevState,
      date: currentDate.toDateString(),
    }));
  };

  useEffect(() => {
    const selectedCompanyObj = company.find(
      c => c.businessName === selectedCompany,
    );
    if (selectedCompanyObj) {
      setSalesInput(prevState => ({
        ...prevState,
        address: selectedCompanyObj.address,
        contact: selectedCompanyObj.contact,
      }));
    }
  }, [selectedCompany, company]);

  useEffect(() => {
    const selectedCustomerObj = customer.find(
      c => c.customerName === selectedCustomer,
    );
    if (selectedCustomerObj) {
      setSalesInput(prevState => ({
        ...prevState,
        addressTo: selectedCustomerObj.address,
        contactTo: selectedCustomerObj.contact,
      }));
    }
  }, [selectedCustomer, customer]);

  const renderItem = ({item, index}) => (
    // console.log(item)
    <View key={index} style={styles.tableRow}>
      <CustomDropdown
        data={stock}
        search
        maxHeight={300}
        labelField="barCode"
        valueField="barCode"
        searchPlaceholder="Search..."
        value={item.barCode}
        onChangeFrom={selectedItem => {
          handleTableChange(index, 'barCode', selectedItem.barCode);
          setSelectedStock(selectedItem.barCode);
        }}
        label="BarCode"
        placeholder={false}
      />
      <CustomInput
        placeholder="Product Name"
        value={item.productName}
        onChangeText={text => handleTableChange(index, 'productName', text)}
        error={errors[`table${index}productName`]}
      />
      <CustomInput
        placeholder="Batch No"
        value={item.batchNo}
        onChangeText={text => handleTableChange(index, 'batchNo', text)}
        error={errors[`table${index}batchNo`]}
      />
      <CustomInput
        placeholder="Expiry"
        value={item.expiry}
        onChangeText={text => handleTableChange(index, 'expiry', text)}
        error={errors[`table${index}expiry`]}
      />
      <CustomInput
        placeholder="Quantity"
        value={item.qty}
        onChangeText={text => handleTableChange(index, 'qty', text)}
        error={errors[`table${index}qty`]}
      />
      <CustomInput
        placeholder="Rate"
        value={item.rate}
        onChangeText={text => handleTableChange(index, 'rate', text)}
        error={errors[`table${index}rate`]}
      />
      <CustomInput
        placeholder="Amount"
        value={item.amount}
        onChangeText={text => handleTableChange(index, 'amount', text)}
        error={errors[`table${index}amount`]}
      />
      <TouchableOpacity onPress={() => handleRemoveRow(index)}>
        <Text style={styles.removeButton}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const selectedStockObj = stock.find(s => s.barCode === selectedStock);
    if (selectedStockObj) {
      const newTable = table.map((item, index) =>
        index === table.length - 1
          ? {
              ...item,
              barCode: selectedStockObj.barCode,
              productName: selectedStockObj.productName,
              batchNo: selectedStockObj.batchNumber,
              expiry: moment(selectedStockObj.expiryDate).format('DD-MM-YYYY'),
              // rate: selectedStockObj.gstRate,
              // amount: selectedStockObj.mrp,
            }
          : item,
      );
      // console.log("selectedStockObj " , selectedStockObj?.mrp)
      setTable(newTable);
    }
  }, [selectedStock, stock]);

  const handlePrint = async () => {
    const discountRows = discountInput
      .map(
        (item, index) =>
          `<tr key=${index}>
             <td>${index + 1}</td>
             <td>${item.charges}</td>
             <td>${item.discount}</td>
           </tr>`,
      )
      .join('');

    const tableRows = table
      .map(
        (item, index) =>
          `<tr key=${index}>
             <td>${index + 1}</td>
             <td>${item.description}</td>
             <td>${item.quantity}</td>
             <td>${item.rate}</td>
             <td>${item.amount}</td>
           </tr>`,
      )
      .join('');

    const htmlContent = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .header, .totalContainer {
              margin-bottom: 20px;
            }
            .subtitle {
              font-size: 18px;
              font-weight: bold;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h2>${salesId ? 'Update Sales' : 'Add Sales'}</h2>
          <div class="header">
            <p><strong>Billing By:</strong> ${selectedCompany}</p>
            <p><strong>Address:</strong> ${salesInput.address}</p>
            <p><strong>Contact:</strong> ${salesInput.contact}</p>
            <p><strong>GSTIN:</strong> ${salesInput.gstIn}</p>
            <p><strong>Billing To:</strong> ${selectedCustomer}</p>
            <p><strong>Billing Address:</strong> ${salesInput.addressTo}</p>
            <p><strong>Billing Contact:</strong> ${salesInput.contactTo}</p>
            <p><strong>Date:</strong> ${salesInput.date}</p>
            <p><strong>Invoice No:</strong> ${salesInput.invoiceNo}</p>
          </div>
          <h3 class="subtitle">Table Entries</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <h3 class="subtitle">Discount Details</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Charges</th>
                <th>Discount</th>
              </tr>
            </thead>
            <tbody>
              ${discountRows}
            </tbody>
          </table>
          <div class="totalContainer">
            <p><strong>SUB TOTAL:</strong> Sub Total</p>
            <p><strong>CGST:</strong> CGST Total</p>
            <p><strong>SGST:</strong> SGST Total</p>
            <p><strong>TOTAL:</strong> Total</p>
          </div>
        </body>
      </html>
    `;

    try {
      await RNPrint.print({html: htmlContent});
    } catch (error) {
      console.error('Failed to print', error);
    }
  };

  const calculateSubTotal = () => {
    // Calculate the sum of all item amounts
    const itemTotal = table.reduce((acc, item) => {
      const amount = parseFloat(item.amount) || 0;
      const qty = parseFloat(item.qty) || 0;
      return acc + amount * qty;
    }, 0);

    // Calculate the total extra charges and discounts
    const extraCharge = discountInput.reduce((acc, discount) => {
      const charges = parseFloat(discount.charges) || 0;
      const discountAmount = parseFloat(discount.discount) || 0;
      return acc + charges - discountAmount;
    }, 0);

    // Calculate the final subtotal
    const subtotal = itemTotal + extraCharge;

    return subtotal.toFixed(2);
  };

  const subtotal = calculateSubTotal();

  const GST_PERCENTAGE = 18;

  // const GST_PERCENTAGE = parseFloat(table?.rate);


  const calculateGst = () => {
    const itemTotal = table.reduce((acc, item) => {
      const amount = parseFloat(item.amount) || 0;
      const qty = parseFloat(item.qty) || 0;
      const itemSubtotal = amount * qty;
      const gstAmount = itemSubtotal * (GST_PERCENTAGE / 100);
      return acc + itemSubtotal + gstAmount;
    }, 0);

    const extraCharge = discountInput.reduce((acc, discount) => {
      const charges = parseFloat(discount.charges) || 0;
      const discountAmount = parseFloat(discount.discount) || 0;
      return acc + charges - discountAmount;
    }, 0);

    const subtotal = itemTotal + extraCharge;

    return subtotal.toFixed(2);
  };


  const calculateTotal = () => {
    const subTotal = parseFloat(calculateSubTotal()) || 0;
    const extraCharges = parseFloat(calculateExtraCharges()) || 0;
    const total = subTotal + extraCharges;
  
    return total.toFixed(2);
  };

  const calculateExtraCharges = () => {
    const extraCharge = discountInput.reduce((acc, discount) => {
      const charges = parseFloat(discount.charges) || 0;
      const discountAmount = parseFloat(discount.discount) || 0;
      return acc + charges - discountAmount;
    }, 0);
  
    return extraCharge.toFixed(2);
  };

  return (
    <>
      <CustomHeader
        title={salesId ? 'Update Sales' : 'Add Sales'}
        onPressArrow={() => navigation.navigate('Sales')}
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <CustomDropdown
            data={company}
            search
            maxHeight={300}
            labelField="businessName"
            valueField="businessName"
            searchPlaceholder="Search..."
            value={selectedCompany}
            onChange={item => {
              setSelectedCompany(item?.businessName);
            }}
            label="Billing By"
            placeholder={false}
          />

          <CustomInput
            label="Address"
            value={salesInput.address}
            onChangeText={text => handleInputChange('address', text)}
            error={errors.address}
          />
          <CustomInput
            label="Contact"
            value={salesInput.contact}
            onChangeText={text => handleInputChange('contact', text)}
            error={errors.contact}
          />
          <CustomInput
            label="GSTIN"
            value={salesInput.gstIn}
            onChangeText={text => handleInputChange('gstIn', text)}
            error={errors.gstIn}
          />

          <CustomDropdown
            data={customer}
            search
            maxHeight={300}
            labelField="customerName"
            valueField="customerName"
            searchPlaceholder="Search..."
            value={selectedCustomer}
            onChange={item => {
              setSelectedCustomer(item?.customerName);
            }}
            label="Billing To"
            placeholder={false}
          />

          <CustomInput
            label="Billing Address"
            value={salesInput.addressTo}
            onChangeText={text => handleInputChange('addressTo', text)}
            error={errors.addressTo}
          />
          <CustomInput
            label="Billing Contact"
            value={salesInput.contactTo}
            onChangeText={text => handleInputChange('contactTo', text)}
            error={errors.contactTo}
          />
          <CustomInput
            label="Date"
            value={salesInput.date}
            rightIconName={
              <TouchableOpacity onPress={() => setShow(!show)}>
                <AntDesign name="calendar" color={'#000'} size={24} />
              </TouchableOpacity>
            }
            error={errors.date}
          />
          <CustomInput
            label="Invoice No"
            value={salesInput.invoiceNo}
            onChangeText={text => handleInputChange('invoiceNo', text)}
            error={errors.invoiceNo}
          />

          <Text style={styles.subtitle}>Table Entries</Text>
          {errors.table && <Text style={styles.errorText}>{errors.table}</Text>}

          <FlatList
            data={table}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={{marginBottom: 20}}
            horizontal
          />
          <CustomButton title="Add Row" onPress={handleAddRow} />
          <CustomButton
            title="Add Charges / Discount"
            onPress={() => setDiscountModal(!discountModal)}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <CustomButton
              title={salesId ? 'Update' : 'Submit'}
              onPress={handleSubmit}
            />
          )}
        </View>
      </ScrollView>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour
          display="default"
          onChange={onChangeDate}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={discountModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setDiscountModal(!discountModal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
            >
              <Text style={styles.textStyle}>Add Discount</Text>
              <Pressable onPress={() => setDiscountModal(!discountModal)}>
                <AntDesign name={'closecircle'} size={25} color="#000000" />
              </Pressable>
            </View>

            <FlatList
              data={discountInput}
              renderItem={renderDiscountItem}
              keyExtractor={(_, index) => index.toString()}
              horizontal
            />
            <CustomButton title="Add Row" onPress={handleAddDiscountRow} />

            <View
              style={{
                backgroundColor: Colors.innerBack,
                padding: 10,
                borderRadius: 5,
              }}
            >
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
              >
                <Text style={styles.textStyle}>SUB TOTAL</Text>
                <Text>{subtotal}</Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
              >
                <Text style={styles.textStyle}>GST</Text>
                <Text>{calculateGst()}</Text>
              </View>
              {/* <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
              >
                <Text style={styles.textStyle}>SGST</Text>
                <Text>Sub Total</Text>
              </View> */}
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}
              >
                <Text style={styles.textStyle}>TOTAL</Text>
                <Text>{calculateTotal()}</Text>
              </View>
            </View>
            <CustomButton title="Print" onPress={handlePrint} />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  removeButton: {
    color: 'red',
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  tableRow: {
    marginBottom: 15,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddSales;