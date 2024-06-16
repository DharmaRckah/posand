import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../redux/UserSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../constant/Colors';
import {DrawerActions} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawerContent = props => {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user.userInfo);
  console.log('drawer user ', userInfo);
  const [isCategorySubmenu, setIsCategorySubmenu] = useState(false);
  const [isReportSubmenu, setisReportSubmenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    AsyncStorage.removeItem('AsyncUser');
    props.navigation.dispatch(DrawerActions.closeDrawer());
    // props.navigation.navigate("Login")
  };

  const toggleSettingsSubmenu = () => {
    setIsCategorySubmenu(!isCategorySubmenu);
  };

  const toggleReportsSubmenu = () => {
    setisReportSubmenu(!isReportSubmenu);
  };

  return (
    <>
      <StatusBar translucent backgroundColor={'transparent'} />
      <View style={styles.userInfoSection}>
        <View style={styles.userRow}>
          <Avatar.Image source={require('../assets/user.png')} size={50} />
          <View style={styles.userDetails}>
            <Title style={styles.title}>
              {userInfo ? userInfo.businessName : 'Business Name'}
            </Title>
            <Caption style={styles.caption}>
              {userInfo ? userInfo?.email : 'business@gmail.com'}
            </Caption>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
            <Caption style={styles.caption}>Following</Caption>
          </View>
          <View style={styles.section}>
            <Paragraph style={[styles.paragraph, styles.caption]}>
              100
            </Paragraph>
            <Caption style={styles.caption}>Followers</Caption>
          </View>
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="home-outline" color={Colors.secondary} size={size} />
            )}
            label="Dashboard"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('Dashboard')}
          />
          <TouchableOpacity onPress={toggleReportsSubmenu}>
            <View style={styles.drawerItem}>
              <MaterialIcons name="report" color={Colors.secondary} size={24} />
              <Text style={[styles.drawerLabel, {color: Colors.secondary}]}>
                Report
              </Text>
              <Icon
                name={isReportSubmenu ? 'chevron-up' : 'chevron-down'}
                color={Colors.secondary}
                size={24}
              />
            </View>
          </TouchableOpacity>
          {isReportSubmenu && (
            <View style={styles.submenu}>
              <DrawerItem
                label="POS Report"
                labelStyle={{color: Colors.secondary}}
                onPress={() => props.navigation.navigate('PosReport')}
              />
              <DrawerItem
                label="Sales Report"
                labelStyle={{color: Colors.secondary}}
                onPress={() => props.navigation.navigate('SalesReport')}
              />
              <DrawerItem
                label="Purchase Report"
                labelStyle={{color: Colors.secondary}}
                onPress={() => props.navigation.navigate('PurchaseReport')}
              />
              <DrawerItem
                label="Supplier Report"
                labelStyle={{color: Colors.secondary}}
                onPress={() => props.navigation.navigate('SupplierReport')}
              />
            </View>
          )}

          <DrawerItem
            icon={({color, size}) => (
              <Icon
                name="google-my-business"
                color={Colors.secondary}
                size={size}
              />
            )}
            label="Create Company"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('CompanyList')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="cash" color={Colors.secondary} size={size} />
            )}
            label="Cash Drawer"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('CashDrawerList')}
          />
          <DrawerItem
            icon={() => (
              <AntDesign
                name="customerservice"
                color={Colors.secondary}
                size={24}
              />
            )}
            label="Customer"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('Customer')}
          />
          <DrawerItem
            icon={() => (
              <MaterialIcons
                name="category"
                color={Colors.secondary}
                size={24}
              />
            )}
            label="Category"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('ItemCategory')}
          />
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="stocking"
                color={Colors.secondary}
                size={24}
              />
            )}
            label="Stock"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('ItemStock')}
          />
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="unity"
                color={Colors.secondary}
                size={24}
              />
            )}
            label="Unit"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('ItemUnit')}
          />
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="bicycle-penny-farthing"
                color={Colors.secondary}
                size={24}
              />
            )}
            label="Purchase"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('Purchase')}
          />
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="priority-low"
                color={Colors.secondary}
                size={24}
              />
            )}
            label="Sales"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('Sales')}
          />
          <DrawerItem
            icon={() => (
              <MaterialCommunityIcons
                name="format-text-wrapping-overflow"
                color={Colors.secondary}
                size={24}
              />
            )}
            label="Supplier"
            labelStyle={{color: Colors.secondary, marginLeft: -18}}
            onPress={() => props.navigation.navigate('Supplier')}
          />
          {/* <TouchableOpacity onPress={toggleSettingsSubmenu}>
            <View style={styles.drawerItem}>
              <MaterialIcons
                name="category"
                color={Colors.secondary}
                size={24}
              />
              <Text style={[styles.drawerLabel, {color: Colors.secondary}]}>
                Category
              </Text>
              <Icon
                name={isCategorySubmenu ? 'chevron-up' : 'chevron-down'}
                color={Colors.secondary}
                size={24}
              />
            </View>
          </TouchableOpacity> */}
          {/* {isCategorySubmenu && (
            <View style={styles.submenu}>
              <DrawerItem
                label="Category List"
                labelStyle={{color: Colors.secondary}}
                onPress={() => props.navigation.navigate('CategoryList')}
              />
              <DrawerItem
                label="Add Category"
                labelStyle={{color: Colors.secondary}}
                onPress={() => props.navigation.navigate('AddCategory')}
              />
            </View>
          )} */}
        </Drawer.Section>
      </DrawerContentScrollView>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="exit-to-app" size={24} color="#f50057" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingTop: 30,
    backgroundColor: Colors.backColor,
    paddingBottom: 15,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
    fontSize: 16,
  },
  drawerSection: {
    marginTop: -10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: '#6200ee',
    flex: 1,
  },
  submenu: {
    paddingLeft: 32,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.primary,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#f50057',
  },
});

export default CustomDrawerContent;
