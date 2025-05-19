import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Text, Button } from 'react-native-paper';
import * as LocalAuthentication from "expo-local-authentication";

const AuthScreen = ({ onAuthSuccess }) => {
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
    <>
      <StatusBar backgroundColor="transparent" translucent />  
      <View style={styles.container}>
        <Text style={styles.title} variant="headlineSmall">Authentication Required</Text>
        {authFailed && <Button mode="contained"  onPress={authenticate}> Try again </Button>}
      </View>
    </>
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
    marginBottom: 20,
  },
});

export default AuthScreen;
