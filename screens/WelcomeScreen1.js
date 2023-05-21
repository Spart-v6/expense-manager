import { View, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import React from "react";
import allColors from "../commons/allColors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen1 = ({ navigation }) => {
  const [username, setUsername] = React.useState("");

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem("username", username);
      navigation.navigate("WelcomeScreen");
    } catch (error) {
      console.log("Error saving data to AsyncStorage:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <View style={styles.content}>
        <Text variant="displayMedium"> Welcome </Text>
        <Text variant="bodySmall">
          Empower Your Finances: Track, Split, Recur, and Master Your Expenses!
        </Text>
      </View>
      <View style={{}}>
        <TextInput
          label="Your name"
          style={{ backgroundColor: "transparent" }}
          value={username}
          underlineColor={allColors.textColorPrimary}
          activeUnderlineColor={allColors.textColorPrimary}
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
            width: 200,
            alignSelf: "flex-end",
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
    marginTop: 80,
    marginBottom: 40,
    marginLeft: 20,
    marginRight: 20,
    alignItems: "flex-start",
  },
});

export default WelcomeScreen1;
