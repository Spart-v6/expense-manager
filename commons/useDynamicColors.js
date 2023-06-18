import { useState, useEffect } from "react";
import { PlatformColor, useColorScheme } from "react-native";

const useDynamicColors = () => {
  const colorScheme = useColorScheme();
  const [colors, setColors] = useState({
    backgroundColorPrimary: PlatformColor('@android:color/system_neutral2_900'),
    backgroundColorLessPrimary: PlatformColor('@android:color/system_neutral2_800'),
    backgroundColorSecondary: PlatformColor('@android:color/system_accent1_700'),
    backgroundColorTertiary: PlatformColor('@android:color/system_neutral2_600'),
    backgroundColorQuaternary: PlatformColor('@android:color/system_accent2_200'),
    backgroundColorQuinary: PlatformColor('@android:color/system_neutral2_200'),

    backgroundColorCard: PlatformColor('@android:color/system_accent2_700'),
    bottomTabColor: PlatformColor('@android:color/system_neutral2_800'),
    textColorPrimary: PlatformColor('@android:color/system_accent1_200'),
    textColorSecondary: PlatformColor('@android:color/system_accent2_50'),
    textColorTertiary: PlatformColor('@android:color/system_neutral1_900'),
    textColorFour: PlatformColor('@android:color/system_accent1_800'),
    textColorFive: PlatformColor('@android:color/system_accent1_50'),
    textSelectionColor: PlatformColor('@android:color/system_accent1_500'),
    iconColor : PlatformColor('@android:color/system_neutral1_100'),
    tabBtnColor: PlatformColor('@android:color/system_neutral1_100'),
    calendarTopColor: PlatformColor('@android:color/system_neutral1_100'),
    selectedDateColor: PlatformColor('@android:color/system_neutral1_100'),
    selectedDateTextColor: PlatformColor('@android:color/system_neutral1_100'),

    warningColor : "#EF9A9A",
    successColor : "#8BC34A",
    errorColor: "#d32f2f",
    barStyle: "light-content",
    universalColor: "#F5F5F5",
  });

  useEffect(() => {
    const updateColors = () => {
      const dynamicColors = {
        backgroundColorPrimary: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_neutral2_900"
            : "@android:color/system_accent2_50"
        ),
        backgroundColorLessPrimary: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_neutral2_800"
            : "@android:color/system_accent2_100"
        ),
        backgroundColorSecondary: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_700"
            : "@android:color/system_accent1_100"
        ),
        backgroundColorTertiary: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_neutral2_600"
            : "@android:color/system_neutral1_300"  // changed from 100 
        ),
        backgroundColorQuaternary: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent2_200"
            : "@android:color/system_neutral1_200"
        ),
        backgroundColorQuinary: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_neutral2_200"
            : "@android:color/system_neutral1_100"
        ),

        backgroundColorCard: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent2_700"
            : "@android:color/system_neutral2_100"
        ),
        bottomTabColor: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_neutral2_800"
            : "@android:color/system_neutral1_50"
        ),
        textColorPrimary: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_200"
            : "@android:color/system_neutral1_700"
        ),
        textColorSecondary: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent2_50"
            : "@android:color/system_accent1_800"
        ),
        textColorTertiary: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_neutral1_900"
            : "@android:color/system_neutral1_500"
        ),
        textColorFour: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_800"
            : "@android:color/system_accent3_700"
        ),
        textColorFive: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_50"
            : "@android:color/system_accent2_600"
        ),
        textSelectionColor: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_500"
            : "@android:color/system_accent2_200"
        ),
        iconColor: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_neutral1_100"
            : "@android:color/system_neutral1_50"
        ),
        calendarTopColor: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_900"
            : "@android:color/system_accent1_600"
        ),
        selectedDateColor: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_300"
            : "@android:color/system_accent1_600"
        ),
        selectedDateTextColor: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_700"
            : "@android:color/system_accent1_100"
        ),
        warningColor : colorScheme === "dark" ? "#EF9A9A" : "red",
        successColor : colorScheme === "dark" ? "#8BC34A" : "green",
        errorColor: "#d32f2f",
        barStyle: colorScheme === "dark" ? "light-content" : "dark-content",
        universalColor: colorScheme === "dark" ? "#F5F5F5" : "#333333",
        tabBtnColor: PlatformColor(
          colorScheme === "dark"  
            ? "@android:color/system_neutral1_500"
            : "@android:color/system_accent2_200"
        ),


        // new
        backgroundColorDatesSelected: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_700"
            : "@android:color/system_accent1_200"
        ),
        backgroundColorDates: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_neutral1_800"
            : "@android:color/system_neutral1_100"
        ),
        rippleColor: colorScheme === "dark" ? "rgba(255, 255, 255, .50)" : "rgba(0, 0, 0, .30)" ,
        innerTextFieldColor: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_100"
            : "@android:color/system_accent2_100"
        ),
        addBtnColors: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_300"
            : "@android:color/system_accent1_600"
        ),
        defaultHomeRecurrCard: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent1_700"
            : "@android:color/system_accent1_200"
        ),
        defaultAccSplitRecCard: PlatformColor(
          colorScheme === "dark"
            ? "@android:color/system_accent2_800"
            : "@android:color/system_accent3_100"
        ),
        receiveGreenBg: colorScheme === "dark" ? "#4CAF50" : "#00E676" ,
        payRedBg: colorScheme === "dark" ? "#F44336" : "#FF1744",
      };

      setColors(dynamicColors);
    };

    updateColors();
  }, [colorScheme]);

  return colors;
};

export default useDynamicColors;
