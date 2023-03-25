import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedEntryScreen = props => {
  const fadeAnim = useSharedValue(0.9);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, {
      duration: 350,
      easing: Easing.bezier(0.42, 0, 0.58, 1),
    });
  }, [fadeAnim]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fadeAnim.value }],
    };
  });

  return (
    <Animated.View style={[animatedStyle, { flex: 1 }]}>
      {props.children}
    </Animated.View>
  );
};

export default AnimatedEntryScreen;
