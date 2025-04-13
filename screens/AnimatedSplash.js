import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import * as SplashScreen from "expo-splash-screen";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

const AnimatedSplash = ({ onAnimationDone }) => {
  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterial3Theme();

  const styles = makeStyles(theme, colorScheme);
  const { width: screenWidth } = Dimensions.get("screen");

  const startOffset = -screenWidth * 1.2;
  const centerOffset = 0;
  const endOffset = screenWidth * 1.2;

  const path1Translate = useRef(new Animated.Value(startOffset)).current;
  const path2Translate = useRef(new Animated.Value(startOffset)).current;
  const path3Translate = useRef(new Animated.Value(startOffset)).current;

  useEffect(() => {
    const createPathAnimation = (animValue, delay = 0) =>
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animValue, {
          toValue: centerOffset,
          duration: 600,
          easing: Easing.in(Easing.bezier(0.2, 0.8, 0.2, 1)),
          useNativeDriver: true,
        }),
        Animated.delay(600),
        Animated.timing(animValue, {
          toValue: endOffset,
          duration: 600,
          easing: Easing.in(Easing.back(1)),
          useNativeDriver: true,
        }),
      ]);

    Animated.parallel([
      createPathAnimation(path1Translate, 0),
      createPathAnimation(path2Translate, 40),
      createPathAnimation(path3Translate, 40),
    ]).start(() => {
      setTimeout(() => {
        handleFinish();
      }, 200);
    });

    const handleFinish = async () => {
      await SplashScreen.hideAsync();
      onAnimationDone();
    };
  }, []);

  const animatedStyle1 = {
    transform: [{ translateX: path1Translate }],
    position: "absolute",
  };
  const animatedStyle2 = {
    transform: [{ translateX: path2Translate }],
    position: "absolute",
  };
  const animatedStyle3 = {
    transform: [{ translateX: path3Translate }],
    position: "absolute",
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <View style={styles.container}>
        <Animated.View style={animatedStyle1}>
          <Svg width={300} height={300} viewBox="0 0 1024 1024">
            <Path
              d="M522.5 224C598.485 224 671.357 254.185 725.086 307.914C778.815 361.643 809 434.515 809 510.5C809 586.484 778.815 659.357 725.086 713.086C671.357 766.815 598.485 797 522.5 797L522.5 510.5L522.5 224Z"
              fill={theme.dark.secondaryContainer }
            />
          </Svg>
        </Animated.View>

        <Animated.View style={animatedStyle2}>
          <Svg width={300} height={300} viewBox="0 0 1024 1024">
            <Path
              d="M520.488 355C544.665 368.97 565.536 393.018 580.536 424.188C595.536 455.358 604.011 492.291 604.919 530.445C605.826 568.599 599.126 606.311 585.644 638.944C572.161 671.577 545.332 699.584 521.878 716L521.878 687.406L512.003 661.59C528.49 650.051 542.322 631.682 551.799 608.744C561.277 585.806 565.986 559.297 565.348 532.477C564.71 505.658 558.753 479.697 548.209 457.787C537.665 435.877 522.994 418.973 506 409.153L520.488 355Z"
              fill={theme.dark.onSecondary}
            />
          </Svg>
        </Animated.View>

        <Animated.View style={animatedStyle3}>
          <Svg width={300} height={300} viewBox="0 0 1024 1024">
            <Path
              d="M325 266C393.161 266 458.53 293.077 506.726 341.274C554.923 389.47 582 454.839 582 523C582 591.161 554.923 656.53 506.726 704.726C458.53 752.923 393.161 780 325 780L325 523L325 266Z"
              fill={theme.dark.tertiary}
            />
          </Svg>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme, colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme[colorScheme].background,
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default AnimatedSplash;
