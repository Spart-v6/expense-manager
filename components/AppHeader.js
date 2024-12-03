import { Appbar, Button } from "react-native-paper";
import { IconComponent } from "./IconPickerModal";
import { View, Animated, Dimensions, AppState } from "react-native";
import MyText from "./MyText";
import React, { useEffect, useState } from "react";
import useDynamicColors from "../commons/useDynamicColors";
import { getUsernameFromStorage } from "../helper/constants";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

const AppHeader = React.memo((({
  title,
  isParent,
  isHome,
  navigation,
  isPlus,
  isUpdate,
  isDeletePressed,
  needSearch,
  isInfoPressed,
  needInfo = false,
  setOnDeleteRange,
  deleteExpensesInRange = false,
  onClearAll,
  isMenuNeeded = true
}) => {
  const allColors = useDynamicColors();
  const screenHeight = Dimensions.get('window').height;
  const statusBarHeight = screenHeight * 0.05;

  const handleUpload = React.useCallback(() => {
    navigation.navigate('FileUploadScreen');
  }, []);
  
  const handleSettingsPress = React.useCallback(() => {
    navigation.navigate("SettingsScreen");
  }, [navigation]);

  const handleOpenDeleteDialog = React.useCallback(() => { 
    setOnDeleteRange(prev => !prev);
  }, [setOnDeleteRange]);

  const goToNotificationScreen = React.useCallback(() => {
    navigation.navigate("NotificationsScreen");
  });
  

  const GreetAndSearch = React.memo(({ greeting, username }) => {
    const fadeAnimation = React.useRef(new Animated.Value(0)).current; // For greeting animation
    const finalFadeAnimation = React.useRef(new Animated.Value(0)).current; // For "Search your expenses" fade-in
    const [hasAnimated, setHasAnimated] = React.useState(false);
    const [showGreeting, setShowGreeting] = React.useState(true); // Track visibility
    const [finalText, setFinalText] = React.useState(null); // Control final display text
    const allColors = useDynamicColors();
  
    React.useEffect(() => {
      const checkAnimationState = async () => {
        const storedState = await AsyncStorage.getItem('hasAnimated');
        if (storedState === 'true') {
          setHasAnimated(true);
          setShowGreeting(false);
          setFinalText('Search your expenses');
          // Smooth fade-in for "Search your expenses"
          Animated.timing(finalFadeAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        } else {
          // Run the initial greeting animation
          Animated.sequence([
            Animated.timing(fadeAnimation, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.delay(1000),
            Animated.timing(fadeAnimation, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start(async () => {
            await AsyncStorage.setItem('hasAnimated', 'true');
            setHasAnimated(true);
            setShowGreeting(false);
            setFinalText('Search your expenses');
            // Smooth fade-in for "Search your expenses"
            Animated.timing(finalFadeAnimation, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start();
          });
        }
      };
      checkAnimationState();
    }, [fadeAnimation, finalFadeAnimation]);
  
    React.useEffect(() => {
      // Set greeting text when data is ready
      if (showGreeting && greeting && username) {
        setFinalText(`${greeting} ${username}`);
      }
    }, [greeting, username, showGreeting]);
  
    if (!finalText) {
      // Render nothing until `finalText` is ready
      return null;
    }
  
    return (
      <Animated.View
        style={{
          opacity: showGreeting ? fadeAnimation : finalFadeAnimation,
        }}
      >
        <View style={{ marginLeft: 6 }}>
          <MyText style={{ color: allColors.universalColor }} variant="titleMedium">{finalText}</MyText>
        </View>
      </Animated.View>
    );
  });
  
  const [greeting, setGreeting] = React.useState("");
  const [username, setUsername] = React.useState(null);

  React.useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await getUsernameFromStorage();
      setUsername(storedUsername);
    };
    fetchUsername();
  }, []);

  const handleDeleteExpense = () => isDeletePressed(true);
  const handleInfoPress = () => isInfoPressed(true);
  const searchExpense = () =>
    navigation.navigate("SearchScreen", { comingFrom: title });

  React.useEffect(() => {
    const currentHour = moment().hour();
    if (currentHour >= 5 && currentHour < 12) setGreeting("Good morning");
    else if (currentHour >= 12 && currentHour < 17)
      setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <Appbar.Header
      style={{ backgroundColor: allColors.backgroundColorPrimary }}
      statusBarHeight={statusBarHeight}
    >
      {!isParent && isMenuNeeded && (
        <Button onPress={() => navigation.goBack()}>
          <IconComponent
            name={"keyboard-backspace"}
            category={"MaterialIcons"}
            size={20}
          />
        </Button>
      )}
      {!isMenuNeeded && (
        <View style={{marginLeft: 20, marginRight: 20}}>
        <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
          <Feather name="menu" size={20} color={allColors.textColorPrimary} />
        </TouchableOpacity>
        </View>
      )}
      {isHome || needSearch ? (
        <>
        <View style={{marginLeft: 20}}>
          <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.dispatch(DrawerActions.openDrawer())} >
            <Feather name="menu" size={20} color={allColors.textColorPrimary} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', flex: 1, marginRight: 20}}>
          <TouchableOpacity style={{width: "90%", alignItems: "center"}} onPress={searchExpense}>
            <Appbar.Content title={<GreetAndSearch greeting={greeting} username={username}/>} style={{justifyContent: "center"}} />
          </TouchableOpacity>
          <Appbar.Action icon="magnify" onPress={searchExpense} color={allColors.universalColor}/>
        </View>
        </>
      ) : (
        <Appbar.Content
          title={<MyText variant="titleLarge" style={{color: allColors.textColorSecondary, maxWidth: Dimensions.get("screen").width / 1.3}} 
          ellipsizeMode='tail' numberOfLines={2}>
            { isUpdate ? "Update Expense" : title}
          </MyText>}
          titleStyle={[ {color: allColors.textColorSecondary, marginRight: 20} ,isParent && { marginLeft: 6 }]}
        />
      )}
      {/* {isHome && (
        <Appbar.Action icon={({color, size }) => (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="notifications-outline" size={20} color={allColors.textColorPrimary} style={{  }} />
          </View>
        )}
          onPress={goToNotificationScreen} 
          animated={false}
        />
      )}
      {isHome && (
        <Appbar.Action icon={({color, size }) => (
          <View style={{ alignItems: 'center' }}>
            <Feather name="upload" size={20} color={allColors.textColorPrimary} style={{  }} />
          </View>
        )}
          onPress={handleUpload} 
          animated={false}
        />
      )} */}
      {deleteExpensesInRange && (
        <Appbar.Action icon={({color, size }) => (
          <View style={{ alignItems: 'center' }}>
            <MaterialIcons name="delete-sweep" size={20} color={allColors.textColorPrimary} style={{  }} />
          </View>
        )}
          onPress={handleOpenDeleteDialog} 
          animated={false}
        />
      )}
      {/* {isHome && (
        <Appbar.Action
        icon={({ color, size }) => (
          <View style={{ alignItems: 'center' }}>
            <Feather name="settings" size={20} color={allColors.textColorPrimary} style={{ }} />
          </View>
          )}
          onPress={handleSettingsPress}
          animated={false}
        />
      )} */}
      {isPlus && isUpdate && (
        <Appbar.Action icon="delete" onPress={handleDeleteExpense} color={allColors.universalColor}/>
      )}
      {
        needInfo && (
          <Appbar.Action icon={({ color, size }) => (
              <Feather name="info" size={20} color={allColors.textColorPrimary}/>
          )} onPress={handleInfoPress} animated={false}/>
        )
      }
      { title === "Notifications" && (
        <Appbar.Action
          icon={({ color, size }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons name="notification-clear-all" size={20} color={allColors.textColorPrimary} style={{ }} />
            </View>
            )}
          onPress={onClearAll}
          animated={false}
        />
      )}
    </Appbar.Header>
  );
}))

export default AppHeader;
