import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import useDynamicColors from "../commons/useDynamicColors";
import { SafeAreaView, StatusBar } from "react-native";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SplashScreen = ({ setAnimationDone }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);

  const { width: screenWidth } = Dimensions.get("window");
  const startOffset = -screenWidth * 4; // Start far left
  const centerOffset = 0; // Center of the screen
  const endOffset = screenWidth * 4; // Far right

  const path1Opacity = useRef(new Animated.Value(0)).current;
  const path1Translate = useRef(new Animated.Value(startOffset)).current;

  const path2Opacity = useRef(new Animated.Value(0)).current;
  const path2Translate = useRef(new Animated.Value(startOffset)).current;

  const path3Opacity = useRef(new Animated.Value(0)).current;
  const path3Translate = useRef(new Animated.Value(startOffset)).current;

  useEffect(() => {
    const createPathAnimation = (pathTranslate, pathOpacity) => {
      return Animated.sequence([
        Animated.timing(pathOpacity, {
          toValue: 1,
          duration: 100,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pathTranslate, {
          toValue: centerOffset,
          duration: 1000,
          easing: Easing.inOut(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(pathTranslate, {
          toValue: endOffset,
          duration: 500,
          easing: Easing.in(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(pathOpacity, {
          toValue: 0,
          duration: 0,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);
    };

    const path1Animation = createPathAnimation(path1Translate, path1Opacity);
    const path2Animation = createPathAnimation(path2Translate, path2Opacity);
    const path3Animation = createPathAnimation(path3Translate, path3Opacity);

    Animated.stagger(5, [path1Animation, path2Animation, path3Animation]).start(
      () => {
        setTimeout(() => {
          setAnimationDone(true);
        }, 200);
      }
    );
  }, []);

  const animatedStyle3 = {
    transform: [{ translateX: path1Translate }],
    opacity: path1Opacity,
  };
  const animatedStyle2 = {
    transform: [{ translateX: path2Translate }],
    opacity: path2Opacity,
  };
  const animatedStyle1 = {
    transform: [{ translateX: path3Translate }],
    opacity: path3Opacity,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={allColors.barStyle}
      />
      <View style={styles.container}>
        <Animated.View
          style={{
            width: "100%",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Svg
            width="600"
            height="200"
            viewBox="0 0 1024 1024"
            fill="red"
            xmlns="http://www.w3.org/2000/svg"
          >
            <AnimatedPath
              d="M522.5 224C598.485 224 671.357 254.185 725.086 307.914C778.815 361.643 809 434.515 809 510.5C809 586.484 778.815 659.357 725.086 713.086C671.357 766.815 598.485 797 522.5 797L522.5 510.5L522.5 224Z"
              fill={allColors.splashScreenIcon3}
              style={[animatedStyle3]}
            />
            <AnimatedPath
              d="M520.488 355C544.665 368.97 565.536 393.018 580.536 424.188C595.536 455.358 604.011 492.291 604.919 530.445C605.826 568.599 599.126 606.311 585.644 638.944C572.161 671.577 545.332 699.584 521.878 716L521.878 687.406L512.003 661.59C528.49 650.051 542.322 631.682 551.799 608.744C561.277 585.806 565.986 559.297 565.348 532.477C564.71 505.658 558.753 479.697 548.209 457.787C537.665 435.877 522.994 418.973 506 409.153L520.488 355Z"
              fill={allColors.splashScreenIcon2}
              style={[animatedStyle2]}
            />
            <AnimatedPath
              d="M325 266C393.161 266 458.53 293.077 506.726 341.274C554.923 389.47 582 454.839 582 523C582 591.161 554.923 656.53 506.726 704.726C458.53 752.923 393.161 780 325 780L325 523L325 266Z"
              fill={allColors.splashScreenIcon1}
              style={[animatedStyle1]}
            />
          </Svg>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = allColors =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: allColors.backgroundColorPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
});

export default SplashScreen;
