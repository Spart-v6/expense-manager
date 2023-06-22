import { useState, useEffect } from "react";
import { PlatformColor, useColorScheme, Platform } from "react-native";

const getColor = (lightColor, darkColor, colorScheme, light2, dark2) => {
  if (Platform.Version > 30) {
    if (colorScheme === "dark") return PlatformColor(darkColor);
    else return PlatformColor(lightColor);
  } else {
    if (colorScheme === "dark") return dark2;
    else return light2;
  }
};

const useDynamicColors = () => {
  const colorScheme = useColorScheme();
  const [colors, setColors] = useState(() => {
    if (Platform.Version > 30) return {
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

      backgroundColorDatesSelected: PlatformColor("@android:color/system_accent1_700"),
      backgroundColorDates: PlatformColor("@android:color/system_neutral1_800"),
      rippleColor: "rgba(255, 255, 255, .50)",
      innerTextFieldColor: PlatformColor("@android:color/system_accent1_100"),
      addBtnColors: PlatformColor("@android:color/system_accent1_300"),
      defaultHomeRecurrCard: PlatformColor("@android:color/system_accent1_700"),
      defaultAccSplitRecCard: PlatformColor("@android:color/system_accent2_800"),
      receiveGreenBg: "#4CAF50",
      payRedBg: "#F44336",
    }
    else return {
      // API < 31
      backgroundColorPrimary: "#ff0000",
      backgroundColorLessPrimary: '#EF9A9A',
      backgroundColorSecondary: '#EF9A9A',
      backgroundColorTertiary: '#EF9A9A',
      backgroundColorQuaternary: '#EF9A9A',
      backgroundColorQuinary: '#EF9A9A',
      backgroundColorCard: '#EF9A9A',
      bottomTabColor: '#EF9A9A',
      textColorPrimary: '#EF9A9A',
      textColorSecondary: '#EF9A9A',
      textColorTertiary: '#EF9A9A',
      textColorFour: '#EF9A9A',
      textColorFive: '#EF9A9A',
      textSelectionColor: '#EF9A9A',
      iconColor : '#EF9A9A',
      tabBtnColor: '#EF9A9A',
      calendarTopColor: '#EF9A9A',
      selectedDateColor: '#EF9A9A',
      selectedDateTextColor: '#EF9A9A',

      warningColor : "#EF9A9A",
      successColor : "#8BC34A",
      errorColor: "#d32f2f",
      barStyle: "light-content",
      universalColor: "#F5F5F5",

      backgroundColorDatesSelected: '#EF9A9A',
      backgroundColorDates: '#EF9A9A',
      rippleColor: "rgba(255, 255, 255, .50)",
      innerTextFieldColor: '#EF9A9A',
      addBtnColors: '#EF9A9A',
      defaultHomeRecurrCard: '#EF9A9A',
      defaultAccSplitRecCard: '#EF9A9A',
      receiveGreenBg: "#4CAF50",
      payRedBg: "#F44336",
  }});

  useEffect(() => {
    const updateColors = () => {
      const dynamicColors = {
        backgroundColorPrimary: getColor("@android:color/system_accent2_50", "@android:color/system_neutral2_900", colorScheme, 
                                        "#bdc8ff", "#bdc8ff"),
        backgroundColorLessPrimary: getColor("@android:color/system_accent2_100", "@android:color/system_neutral2_800", colorScheme, 
                                            "#afb4cd", "#afb4cd"),
        backgroundColorSecondary: getColor("@android:color/system_accent1_100", "@android:color/system_accent1_700", colorScheme,
                                          "#bec4dd", "#bec4dd"),
        backgroundColorTertiary: getColor("@android:color/system_neutral1_300", "@android:color/system_neutral2_600", colorScheme),
        backgroundColorQuaternary: getColor("@android:color/system_neutral1_200", "@android:color/system_accent2_200", colorScheme),
        backgroundColorQuinary: getColor("@android:color/system_neutral1_100", "@android:color/system_neutral2_200", colorScheme),
        backgroundColorCard: getColor("@android:color/system_neutral2_100", "@android:color/system_accent2_700", colorScheme,
                              "#B0BEC5", "#B0BEC5"),
        bottomTabColor: getColor("@android:color/system_neutral1_50", "@android:color/system_neutral2_800", colorScheme),
        textColorPrimary: getColor("@android:color/system_neutral1_700", "@android:color/system_accent1_200", colorScheme, 
                                    "#424242", "#424242"),
        textColorSecondary: getColor("@android:color/system_accent1_800", "@android:color/system_accent2_50", colorScheme, 
                                      "#1A237E", "#1A237E"),
        textColorTertiary: getColor("@android:color/system_neutral1_500", "@android:color/system_neutral1_900", colorScheme),
        textColorFour: getColor("@android:color/system_accent3_700", "@android:color/system_accent1_800", colorScheme, 
                                "#424242", "#424242"),
        textColorFive: getColor("@android:color/system_accent2_600", "@android:color/system_accent1_50", colorScheme),
        textSelectionColor: getColor("@android:color/system_accent2_200", "@android:color/system_accent1_500", colorScheme, 
                                    "#3d798152", "#3d798152"),
        iconColor: getColor("@android:color/system_neutral1_50", "@android:color/system_neutral1_100", colorScheme),
        calendarTopColor: getColor("@android:color/system_accent1_600", "@android:color/system_accent1_900", colorScheme , 
                                    "#1976D2", "#1976D2"),
        selectedDateColor: getColor("@android:color/system_accent1_600", "@android:color/system_accent1_300", colorScheme, 
                                      "#1976D2", "#1976D2"),
        selectedDateTextColor: getColor("@android:color/system_accent1_100", "@android:color/system_accent1_700", colorScheme),
        warningColor : colorScheme === "dark" ? "#EF9A9A" : "red",
        successColor : colorScheme === "dark" ? "#8BC34A" : "green",
        errorColor: "#d32f2f",
        barStyle: colorScheme === "dark" ? "light-content" : "dark-content",
        universalColor: colorScheme === "dark" ? "#F5F5F5" : "#333333",
        tabBtnColor: getColor("@android:color/system_accent2_200", "@android:color/system_neutral1_500", colorScheme),

        // new
        backgroundColorDatesSelected: getColor("@android:color/system_accent1_200", "@android:color/system_accent1_700", colorScheme, 
                                              "#039BE5", "#039BE5"),
        backgroundColorDates: getColor("@android:color/system_neutral1_100", "@android:color/system_neutral1_800", colorScheme , 
                                      "#90A4AE", "#90A4AE"),
        rippleColor: colorScheme === "dark" ? "rgba(255, 255, 255, .50)" : "rgba(0, 0, 0, .30)" ,
        innerTextFieldColor: getColor("@android:color/system_accent2_100", "@android:color/system_accent1_100", colorScheme, 
                                    "#3d79813d", "#3d79813d"),
        addBtnColors: getColor("@android:color/system_accent1_600", "@android:color/system_accent1_300", colorScheme, 
                                "#1565C0","#1565C0"),
        defaultHomeRecurrCard: getColor("@android:color/system_accent1_200", "@android:color/system_accent1_700", colorScheme, 
                                        "#039BE5", "#039BE5"),
        defaultAccSplitRecCard: getColor("@android:color/system_accent3_100", "@android:color/system_accent2_800", colorScheme, 
                                          "#5eb4c0ba", "#5eb4c0ba"),
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
