import React, {useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors } from '../constant/Colors';
const Footer = ({navigation}) => {
  const [homeScreen, setHomeScreen] = useState(false);
  const [todoScreen, setTodoScreen] = useState(false);
  const [userScreen, setUserScreen] = useState(false);

  const handleHome = () => {
    setHomeScreen(true);
    setTodoScreen(false);
    setUserScreen(false);
    navigation.navigate('Home');
  };

  const handleTodo = () => {
    setHomeScreen(false);
    setTodoScreen(true);
    setUserScreen(false);
    navigation.navigate('List');
  };

  const handleUser = () => {
    setHomeScreen(false);
    setTodoScreen(false);
    setUserScreen(true);
    navigation.navigate('User');
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        onPress={handleHome}
        style={[styles.iconContainer, homeScreen && styles.commonStyle]}>
        <AntDesign
          name="home"
          size={24}
          color={homeScreen ? Colors.primary : Colors.backGround}
        />
        <Text
          style={[
            styles.iconText,
            {color: homeScreen ? Colors.primary : Colors.backGround},
          ]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleTodo}
        style={[styles.iconContainer, todoScreen && styles.commonStyle]}>
        <AntDesign
          name="book"
          size={24}
          color={todoScreen ? Colors.primary : Colors.backGround}
        />
        <Text
          style={[
            styles.iconText,
            {color: todoScreen ? Colors.primary : Colors.backGround},
          ]}>
          List
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleUser}
        style={[styles.iconContainer, userScreen && styles.commonStyle]}>
        <AntDesign
          name="user"
          size={24}
          color={userScreen ? Colors.primary : Colors.backGround}
        />
        <Text
          style={[
            styles.iconText,
            {color: userScreen ? Colors.primary : Colors.backGround},
          ]}>
          User
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    backgroundColor: Colors.secondary,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
    paddingBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  iconContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  iconText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  commonStyle: {
    borderTopColor: Colors.primary,
    borderTopWidth: 4,
    marginTop: -7,
    overflow: 'hidden',
  },
});

export default Footer;