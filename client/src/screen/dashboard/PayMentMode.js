import {StyleSheet, Text, TextInput, View, TouchableOpacity, Button} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RazorpayCheckout from 'react-native-razorpay';

const PayMentMode = ({ lableText, modalOpen, setModalOpen }) => {
  const handleRazorpayPayment = () => {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://your-logo-url.com',
      currency: 'INR',
      key: 'your_api_key', // Your API key
      amount: '5000', // Amount in paise
      name: 'Razorpay Payment',
      prefill: {
        email: 'example@example.com',
        contact: '1234567890',
        name: 'John Doe'
      },
      theme: { color: '#F37254' }
    }
    RazorpayCheckout.open(options).then((data) => {
      // handle success
      alert(`Success: ${data.razorpay_payment_id}`);
    }).catch((error) => {
      // handle failure
      alert(`Error: ${error.code} | ${error.description}`);
    });
  }

  const renderPaymentContent = () => {
    switch (lableText) {
      case 'cash':
        return (
          <View>
            <Text style={styles.label}>Billing Address</Text>
            <TextInput style={styles.input} placeholder="Enter Address" />
            <Text style={styles.label}>User Information</Text>
            <TextInput style={styles.input} placeholder="Enter Name" />
            <TextInput style={styles.input} placeholder="Enter Contact" />
          </View>
        );
      case 'online':
        return (
          <View>
            <Button title="Pay with Razorpay" onPress={handleRazorpayPayment} />
          </View>
        );
      case 'card':
        return (
          <View>
            <Text style={styles.label}>Credit Card Information</Text>
            <TextInput style={styles.input} placeholder="Card Number" keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="MM/YY" keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="CVV" keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Cardholder Name" />
          </View>
        );
      default:
        return null;
    }
  }

  return (
    <View style={modalOpen ? styles.container : styles.hidden}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setModalOpen(!modalOpen)}>
        <Icon name="close" size={30} color="#000" />
      </TouchableOpacity>
      {renderPaymentContent()}
    </View>
  );
};

export default PayMentMode;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  hidden: {
    display: 'none',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
});
