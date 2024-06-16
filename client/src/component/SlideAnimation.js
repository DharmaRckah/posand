import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const SlideAnimation = ({ children, visible }) => {
  const slideAnim = useRef(new Animated.Value(-300)).current; // Initial value for sliding from left

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.slideContainer,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  slideContainer: {
    overflow: 'hidden',
  },
});

export default SlideAnimation;
