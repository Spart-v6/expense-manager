import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useThemeContext } from "../context/ThemeContext";

const WelcomeScreen2 = ({ navigation }) => {
  const colorScheme = useColorScheme();
  // const { theme } = useMaterial3Theme();
    const { theme, initialized, themeColor } = useThemeContext(); 
  const [name, setName] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
              <LottieView
                source={require("../assets/user_2_cleaned.json")}
                autoPlay
                loop={false}
                style={{ width: 250, height: 250, marginBottom: 30 }}
                colorFilters={[
                    { keypath: "Medium", color: theme.dark.primaryContainer },
                    { keypath: "Dark", color: theme.dark.tertiaryContainer },
                    { keypath: "Light", color: theme.dark.primary }
                  ]}
              />

              <View style={{ width: "100%", padding: 24 }}>
                <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                  Your good name
                </Text>
                <TextInput
                  mode="flat"
                  style={{
                    backgroundColor: "transparent",
                    borderBottomWidth: 2,
                    borderColor: theme[colorScheme].primary,
                  }}
                  selectionColor={theme[colorScheme].primary}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  cursorColor={theme[colorScheme].primary}
                  placeholderTextColor={theme[colorScheme].onSurfaceVariant}
                  autoComplete="off"
                  textContentType="name"
                  value={name}
                  placeholder="Enter name"
                  onChangeText={(text) => setName(text)}
                />
              </View>
            </View>

            {/* Bottom Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 30, paddingBottom: 30 }}>
              <Button
                icon="chevron-right"
                mode="contained"
                onPress={() => navigation.navigate("Welcome3")}
                disabled={!name.trim()}
                contentStyle={{ height: 50 }}
                style={{width: "100%", borderRadius: 30}}
                labelStyle={{
                  fontSize: 16,
                }}
              >
                Next
              </Button>
            </View>

          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default WelcomeScreen2;
