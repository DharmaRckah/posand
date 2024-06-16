import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, View} from 'react-native';

import SplashScreen from './src/screen/SplashScreen';
import RegisterCompany from './src/screen/company/RegisterCompany';
import Dashboard from './src/screen/dashboard/Dashboard';
import Home from './src/screen/Home';
import Login from './src/screen/auth/Login';
import Register from './src/screen/auth/Register';
import DetailProduct from './src/screen/dashboard/DetailProduct';
import AddToCart from './src/screen/dashboard/AddToCart';
import CustomDrawerContent from './src/component/CustomDrawerContent';
import {Colors} from './src/constant/Colors';
import {setUser} from './src/redux/UserSlice';
import AddCategory from './src/screen/category/AddCategory';
import CategoryList from './src/screen/category/CategoryList';
import AddCashDrawer from './src/screen/drawer/AddCashDrawer';
import CashDrawerList from './src/screen/drawer/CashDrawerList';
import ItemCategory from './src/screen/itemCategory/ItemCategory';
import ItemUnit from './src/screen/itemUnit/ItemUnit';
import ItemStock from './src/screen/itemStock/ItemStock';
import Sales from './src/screen/sales/Sales';
import Purchase from './src/screen/purchase/Purchase';
import Customer from './src/screen/customer/Customer';
import Supplier from './src/screen/supplier/Supplier';
import AddCustomer from './src/screen/customer/AddCustomer';
import AddItemCategory from './src/screen/itemCategory/AddItemCategory';
import AddItemStock from './src/screen/itemStock/AddItemStock';
import AddItemUnit from './src/screen/itemUnit/AddItemUnit';
import AddPurchase from './src/screen/purchase/AddPurchase';
import AddSales from './src/screen/sales/AddSales';
import AddSupplier from './src/screen/supplier/AddSupplier';
import PosReport from './src/screen/report/PosReport';
import SalesReport from './src/screen/report/SalesReport';
import PurchaseReport from './src/screen/report/PurchaseReport';
import SupplierReport from './src/screen/report/SupplierReport';
import GstReciept from './src/screen/dashboard/GstReciept';
import CompanyList from './src/screen/company/CompanyList';
import SalesView from './src/screen/sales/SalesView';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    initialRouteName="Dashboard"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="DetailProduct" component={DetailProduct} />
    <Stack.Screen name="AddToCart" component={AddToCart} />
    <Stack.Screen name="AddCashDrawer" component={AddCashDrawer} />
    <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
  </Stack.Navigator>
);

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerPosition: 'right',
      headerShown: false,
      drawerStyle: {
        backgroundColor: '#f6f6f6',
      },
    }}>
    <Drawer.Screen name="Dashboard" component={Dashboard} />
    {/* <Drawer.Screen name="AppStack" component={AppStack} /> */}

    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="DetailProduct" component={DetailProduct} />
    <Stack.Screen name="AddToCart" component={AddToCart} />

    <Drawer.Screen name="AddCategory" component={AddCategory} />
    <Drawer.Screen name="CategoryList" component={CategoryList} />
    <Drawer.Screen name="RegisterCompany" component={RegisterCompany} />
    <Drawer.Screen name="CashDrawerList" component={CashDrawerList} />

    <Stack.Screen name="AddCashDrawer" component={AddCashDrawer} />
    <Stack.Screen name="AddCustomer" component={AddCustomer} />
    <Stack.Screen name="AddItemCategory" component={AddItemCategory} />
    <Stack.Screen name="AddItemStock" component={AddItemStock} />
    <Stack.Screen name="AddItemUnit" component={AddItemUnit} />
    <Stack.Screen name="AddPurchase" component={AddPurchase} />
    <Stack.Screen name="AddSales" component={AddSales} />
    <Stack.Screen name="AddSupplier" component={AddSupplier} />
    <Stack.Screen name="GstReciept" component={GstReciept} />
    <Stack.Screen name="CompanyList" component={CompanyList} />
    <Stack.Screen name="SalesView" component={SalesView} />

    <Drawer.Screen name="ItemCategory" component={ItemCategory} />
    <Drawer.Screen name="ItemUnit" component={ItemUnit} />
    <Drawer.Screen name="ItemStock" component={ItemStock} />
    <Drawer.Screen name="Sales" component={Sales} />
    <Drawer.Screen name="Purchase" component={Purchase} />
    <Drawer.Screen name="Customer" component={Customer} />
    <Drawer.Screen name="Supplier" component={Supplier} />

    <Drawer.Screen name="PosReport" component={PosReport} />
    <Drawer.Screen name="SalesReport" component={SalesReport} />
    <Drawer.Screen name="PurchaseReport" component={PurchaseReport} />
    <Drawer.Screen name="SupplierReport" component={SupplierReport} />

    {/* report */}
  </Drawer.Navigator>
);

const App = () => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.user.token);
  console.log('  App Token : ', userToken);
  const [loading, setLoading] = useState(true);
  const [myToken, setMyToken] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('AsyncUser');
        if (token) {
          dispatch(setUser(token));
          setMyToken(token);
        }
      } catch (error) {
        console.error('Failed to load token from storage', error);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken || myToken ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;
