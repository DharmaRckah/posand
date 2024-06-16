import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  Button,
  Alert,
  Modal,
} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import {Colors} from '../../constant/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNPrint from 'react-native-print';
import PayMentMode from './PayMentMode';

const {height} = Dimensions.get('window');
const GstReceipt = () => {
  // Sample product data
  const products = [
    {id: 1, name: 'Product 1', price: 100, gstRate: 18},
    {id: 2, name: 'Product 2', price: 150, gstRate: 12},
    {id: 3, name: 'Product 3', price: 200, gstRate: 5},
    {id: 4, name: 'Product 4', price: 250, gstRate: 18},
    {id: 5, name: 'Product 5', price: 300, gstRate: 12},
    {id: 6, name: 'Product 6', price: 350, gstRate: 5},
  ];

  // Calculate total amount and total GST
  const totalAmount = products.reduce((acc, product) => acc + product.price, 0);
  const totalGST = products.reduce(
    (acc, product) => acc + (product.price * product.gstRate) / 100,
    0,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [lableText, setLableText] = useState('cash');

  // Render each product row
  const renderProductItem = ({item}) => (
    <>
      <View style={styles.productItem}>
        <Text style={styles.productText}>{item.name}</Text>
        <Text style={styles.productText}>{item.price}</Text>
        <Text style={styles.productText}>{item.gstRate}%</Text>
      </View>
    </>
  );

  // Function to print the receipt
  const printReceipt = async () => {
    const receiptContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 16px; }
              .header { text-align: center; margin-bottom: 16px; }
              .info { margin-bottom: 16px; }
              .info div { margin-bottom: 4px; }
              .product-list { margin-bottom: 16px; }
              .product-item { display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding: 8px 0; }
              .total-section { margin-top: 16px; border-top: 1px solid #ccc; padding-top: 8px; }
              .total-text { text-align: right; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Business Name</h2>
              <p>Address: Bhopal, Madhya Pradesh</p>
            </div>
            <div class="info">
              <div>Contact: 6265229371</div>
              <div>GSTIN: GHSD854769486600NK</div>
              <div>Date: 06/07/2024</div>
              <div>Invoice: 768</div>
            </div>
            <div class="product-list">
              ${products
                .map(
                  product => `
                <div class="product-item">
                  <span>${product.name}</span>
                  <span>Price: $${product.price}</span>
                  <span>GST Rate: ${product.gstRate}%</span>
                </div>
              `,
                )
                .join('')}
            </div>
            <div class="total-section">
              <div class="total-text">Sub Total: $${totalAmount.toFixed(
                2,
              )}</div>
              <div class="total-text">Output CGST: $${(totalGST / 2).toFixed(
                2,
              )}</div>
              <div class="total-text">Output SGST: $${(totalGST / 2).toFixed(
                2,
              )}</div>
              <div class="total-text">Net Total: $${(
                totalAmount + totalGST
              ).toFixed(2)}</div>
            </div>
            <div>
              <h4>Payment Method</h4>
              <div>Cash</div>
              <div>Online</div>
              <div>Card</div>
            </div>
          </body>
        </html>
      `;

    await RNPrint.print({
      html: receiptContent,
    });
  };

  const handlePaymentMethod = lable => {
    setModalOpen(!modalOpen);
    setLableText(lable);
  };

  return (
    <>
      <CustomHeader
        onPressArrow={false}
        leftText={<AntDesign name="dashboard" size={30} color={'#ffffff'} />}
        righttext={
          <Text style={{color: 'orange', textTransform: 'uppercase'}}>
            manasvi
          </Text>
        }
        title={'Business Name'}
        onPressMenu={false}
      />
      <View style={styles.container}>
        <Text style={styles.headerText}>Address: Bhopal, Madhya Pradesh</Text>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.titleText}>Contact</Text>
            <Text style={styles.valueText}>6265229371</Text>
          </View>
          <View>
            <Text style={styles.titleText}>GSTIN</Text>
            <Text style={styles.valueText}>GHSD854769486600NK</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.titleText}>Date</Text>
            <Text style={styles.valueText}>06/07/2024</Text>
          </View>
          <View>
            <Text style={styles.titleText}>Invoice</Text>
            <Text style={styles.valueText}>768</Text>
          </View>
        </View>
        <Text style={styles.sectionHeader}>Products</Text>
        <View
          style={[styles.productItem, {backgroundColor: Colors.borderColor}]}>
          <Text style={styles.productText}>Name</Text>
          <Text style={styles.productText}>Price</Text>
          <Text style={styles.productText}>GST Rate</Text>
        </View>
        <View style={{height: height / 7}}>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={item => item.id.toString()}
            style={styles.productList}
          />
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            Sub Total: {totalAmount.toFixed(2)}
          </Text>
          <Text style={styles.totalText}>
            Output CGST: {(totalGST / 2).toFixed(2)}
          </Text>
          <Text style={styles.totalText}>
            Output SGST: {(totalGST / 2).toFixed(2)}
          </Text>
          <Text style={styles.totalText}>
            Net Total: {(totalAmount + totalGST).toFixed(2)}
          </Text>
        </View>
        <Text style={styles.paymentHeader}>Payment Method</Text>
        <View style={styles.paymentMethods}>
          <TouchableOpacity onPress={() => handlePaymentMethod('cash')}>
            <Text style={[styles.paymentText, {backgroundColor: 'orange'}]}>
              Cash
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlePaymentMethod('online')}>
            <Text style={[styles.paymentText, {backgroundColor: 'green'}]}>
              Online
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlePaymentMethod('card')}>
            <Text
              style={[styles.paymentText, {backgroundColor: Colors.secondary}]}>
              Card
            </Text>
          </TouchableOpacity>
          <Button title="Print Receipt" onPress={printReceipt} />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalOpen}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalOpen(!modalOpen);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <PayMentMode
              lableText={lableText}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'lightgrey',
    padding: 5,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 14,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  productList: {
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  productText: {
    fontSize: 14,
    width: height / 4.7,
    paddingHorizontal: 5,
  },
  totalSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  paymentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  paymentText: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    color: '#ffffff',
    fontWeight: '500',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default GstReceipt;
