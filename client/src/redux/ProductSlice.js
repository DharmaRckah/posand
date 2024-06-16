import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  totalCartItems: 0,
  total: 0,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    increment: (state, action) => {
      const index = action.payload;
      const order = state.cart[index];
      if (order) {
        order.quantity += 1;
        order.total = order.quantity * order.price;
      }
      state.total = state.cart.reduce((sum, item) => sum + item.total, 0);
      state.totalCartItems = state.cart.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
    },
    decrement: (state, action) => {
      const index = action.payload;
      const order = state.cart[index];
      if (order && order.quantity > 1) {
        order.quantity -= 1;
        order.total = order.quantity * order.price;
      }
      state.total = state.cart.reduce((sum, item) => sum + item.total, 0);
      state.totalCartItems = state.cart.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
    },
    addToCart: (state, action) => {
      const {id, name, price} = action.payload;
      const existingItem = state.cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.total = existingItem.quantity * existingItem.price;
      } else {
        const newItem = {id, name, price, quantity: 1, total: price};
        state.cart.push(newItem);
      }
      state.total = state.cart.reduce((sum, item) => sum + item.total, 0);
      state.totalCartItems = state.cart.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
    },
    removeFromCart: (state, action) => {
      const {id} = action.payload;
      const index = state.cart.findIndex(item => item.id === id);
      if (index !== -1) {
        state.cart.splice(index, 1);
      }
      state.total = state.cart.reduce((sum, item) => sum + item.total, 0);
      state.totalCartItems = state.cart.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
    },
  },
});

export const {increment, decrement, addToCart, removeFromCart} =
  productSlice.actions;

export default productSlice.reducer;

// Selector to check if a product is in the cart
export const selectIsInCart = (state, productId) => {
  return state.product.cart.some(item => item.id === productId);
};
