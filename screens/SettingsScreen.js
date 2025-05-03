import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemeContext } from "../context/ThemeContext";
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog, Portal, Text, Switch, Button } from 'react-native-paper';
import { setBiometricPreference, getBiometricPreference } from '../helper/biometricStorage';

const SettingsScreen = ({ navigation }) => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  const { theme, setThemeColor, resetThemeColor } = useThemeContext();
  const systemColorScheme = useColorScheme();

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const [lockAppEnabled, setLockAppEnabled] = React.useState(false);
  const [lockImmediately, setLockImmediately] = React.useState(false);

  const themeColors = ['#FF1744', '#F50057', '#D500F9', '#2979FF', '#00B0FF', '#C6FF00', '#FFC400', '#FF3D00'];

  const settingsItems = [
    { title: 'Change name', icon: 'person-outline', onPress: () => {} },
    { title: 'Currency Change', icon: 'cash-outline', onPress: () => {} },
    {
      title: 'Lock App',
      icon: 'lock-closed-outline',
      toggleLock: true,
      value: isBiometricEnabled,
      onToggle: handleAuthToggle,
    },
    // {
    //   title: 'Notifications',
    //   icon: 'notifications-outline',
    //   toggle: true,
    //   value: false,
    //   onToggle: () => {},
    // },
    {
      title: 'Theme',
      icon: 'color-palette-outline',
      onPress: showDialog,
    },
  ];

  const handleAuthToggle = async (newValue) => {
    
    if (newValue) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert('Biometric not available', 'Your device does not support biometrics.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm biometric to enable',
      });

      if (result.success) {
        setIsBiometricEnabled(true);
        await setBiometricPreference(true);
      } else {
        Alert.alert('Failed', 'Biometric auth was not successful.');
      }
    } else {
      setIsBiometricEnabled(false);
      await setBiometricPreference(false);
    }
  };


  const renderItem = ({ item }) => (
    <View>
      <View style={styles.itemContainer}>
        <View
          style={{
            backgroundColor: theme.dark.onPrimary,
            borderRadius: 5,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon name={item.icon} size={22} color={theme.dark.primary} />
        </View>
        <View
          style={{
            marginLeft: 10,
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Text style={styles.title}>{item.title}</Text>
          {item.toggleLock ? (
            <Switch
              value={isBiometricEnabled}
              onValueChange={handleAuthToggle}
              thumbColor={item.value ? theme.dark.primary : '#ccc'}
              trackColor={{ true: '#999', false: '#555' }}
            />
          ) : (
            <TouchableOpacity onPress={item.onPress} style={styles.arrowWrapper}>
              <Icon name="chevron-forward" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Lock immediately */}
      {/* {item.title === 'Lock App' && lockAppEnabled && (
        <View style={styles.subItemContainer}>
          <Text style={[styles.title, { fontSize: 14 }]}>Lock immediately?</Text>
          <Switch
            value={lockImmediately}
            onValueChange={setLockImmediately}
            thumbColor={lockImmediately ? theme.dark.primary : '#ccc'}
            trackColor={{ true: '#999', false: '#555' }}
          />
        </View>
      )} */}
    </View>
  );

  useEffect(() => {
    (async () => {
      const enabled = await getBiometricPreference();
      setIsBiometricEnabled(enabled);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={settingsItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Choose theme</Dialog.Title>
          <Dialog.Content>
            {themeColors.map((color, index) => (
              <View key={color}>
                <Text variant="bodyMedium">{color}</Text>
                <TouchableOpacity
                  onPress={async () => {
                    await setThemeColor(color);
                    hideDialog();
                  }}
                  style={{
                    backgroundColor: color,
                    height: 50,
                    marginVertical: 5,
                    borderRadius: 5,
                  }}
                />
            </View>
            ))}
            <Button
                onPress={async () => {
                  await resetThemeColor();
                  hideDialog();
                }}
              >
                Reset Theme
              </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  subItemContainer: {
    marginLeft: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  arrowWrapper: {
    paddingHorizontal: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 4,
  },
});
