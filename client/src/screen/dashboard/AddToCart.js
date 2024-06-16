import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../constant/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { DrawerActions } from '@react-navigation/native';
import { decrement, increment, removeFromCart } from '../../redux/ProductSlice';

const AddToCart = ({ navigation }) => {
  const cartItems = useSelector(state => state.product.cart);
  const total = useSelector(state => state.product.total);
  const dispatch = useDispatch();

  return (
    <>
      <CustomHeader
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
        title={'Cart List'}
        onPressArrow={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <ScrollView>
          {cartItems.map((item, index) => (
            <View style={styles.cartItem} key={item.id}>
              <Text>{item.name}</Text>
              <Text>Rs. {item.price}</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => dispatch(increment(index))}>
                  <Text style={styles.counterButton}>+</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.countButton}
                  onPress={() => dispatch(decrement(index))}>
                  <Text style={styles.counterButton}>-</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => dispatch(removeFromCart({ id: item.id }))}>
                <Ionicons name="trash-bin-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <Text
          style={{
            paddingVertical: 20,
            fontWeight: '500',
            fontSize: 25,
            color: Colors.textColor,
          }}>
          Total Price: Rs. {total}
        </Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("GstReciept")}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: Colors.backColor,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#ffff',
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  checkoutButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  counterButton: {
    fontSize: 32,
    textAlign: 'center',
    marginTop: -8,
    color: '#ffffff',
  },
  quantity: {
    fontSize: 24,
    marginHorizontal: 20,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  countButton: {
    width: 30,
    height: 30,
    backgroundColor: Colors.secondary,
    borderRadius: 5,
  },
});

export default AddToCart;