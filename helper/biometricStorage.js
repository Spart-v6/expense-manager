import * as SecureStore from "expo-secure-store";

const BIOMETRIC_KEY = "biometric_enabled";

export const setBiometricPreference = async (value) => {
  await SecureStore.setItemAsync(BIOMETRIC_KEY, value ? "true" : "false");
};

export const getBiometricPreference = async () => {
  const value = await SecureStore.getItemAsync(BIOMETRIC_KEY);
  return value === "true";
};
