import React, { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";

const AnimatedEntryScreen = (props) => {
  const fadeAnim = useRef(new Animated.Value(0.91)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 310,
      easing: Easing.bezier(0.42, 0, 0.58, 1),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const animatedStyle = {
    transform: [{ scale: fadeAnim }],
  };

  return (
    <Animated.View style={[animatedStyle, { flex: 1 }]}>
      {props.children}
    </Animated.View>
  );
};

export default AnimatedEntryScreen;
