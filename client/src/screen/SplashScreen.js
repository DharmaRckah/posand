import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Colors } from '../constant/Colors';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 1500);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => {
      clearTimeout(timer);
    };
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/img/contactless.jpg')}
        style={styles.backgroundImage}>
        <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
          Point Of Sales
        </Animated.Text>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color:Colors.primary,
    fontSize: 27,
    fontWeight: 'bold',
  },
});
