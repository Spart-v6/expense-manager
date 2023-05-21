import { View, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import React from "react";
import allColors from "../commons/allColors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen1 = ({ navigation }) => {
  const [username, setUsername] = React.useState("");

  const [error, setError] = React.useState(false);
  const timeoutRef = React.useRef(null);

  const handleNext = async () => {
    try {
      const checkError = () => {
        if (username.length < 1) {
          return true;
        }
        return false;
      };
      if (checkError()) {
        setError(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setError(false), 2000);
        return;
      }

      await AsyncStorage.setItem("username", username);
      navigation.navigate("WelcomeScreen");
    } catch (error) {
      console.log("Error saving data to AsyncStorage:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 0.3, gap: 20}}>
        <StatusBar translucent backgroundColor={"transparent"} />
        <View style={styles.content}>
          <Text variant="displayMedium"> Welcome </Text>
          <Text variant="bodyMedium" style={{paddingLeft: 10}}>
            Empower Your Finances: Track, Split, Recur, and Master Your Expenses!
          </Text>
        </View>
        <View style={{gap: 10, margin: 20 }}>
          <TextInput
            label="Your name"
            style={{ backgroundColor: "transparent" }}
            value={username}
            underlineColor={error ? 'red' : allColors.textColorPrimary}
            activeUnderlineColor={error ? 'red' : allColors.textColorPrimary}
            onChangeText={(text) => setUsername(text)}
          />

          <Button
            onPress={handleNext}
            mode="contained"
            labelStyle={{ fontSize: 15 }}
            textColor={"black"}
            style={{
              borderColor: "transparent",
              backgroundColor: allColors.backgroundColorLessPrimary,
              borderRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              width: 150,
              alignSelf: "center"
            }}
          >
            <Text
              style={{
                color: allColors.textColorPrimary,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Next
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    marginTop: 20,
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default WelcomeScreen1;
