import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

const AuthScreen = ({ onAuthSuccess }) => {
    console.log("AuthScreen rendered ================");
  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to continue",
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: true,
    });

    if (result.success) {
        onAuthSuccess();
    } else {
      setAuthFailed(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Required</Text>
      {authFailed && <Button title="Try Again" onPress={authenticate} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default AuthScreen;
