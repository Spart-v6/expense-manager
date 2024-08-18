import { Appbar, Button } from "react-native-paper";
import { IconComponent } from "./IconPickerModal";
import { View, Animated, Dimensions } from "react-native";
import MyText from "./MyText";
import React from "react";
import useDynamicColors from "../commons/useDynamicColors";
import { getUsernameFromStorage } from "../helper/constants";
import Feather from 'react-native-vector-icons/Feather';
import moment from "moment";

const AppHeader = ({
  title,
  isParent,
  isHome,
  navigation,
  isPlus,
  isUpdate,
  isDeletePressed,
  needSearch,
  isInfoPressed,
  needInfo = false
}) => {
  const allColors = useDynamicColors();
  const screenHeight = Dimensions.get('window').height;
  const statusBarHeight = screenHeight * 0.05;


  const GreetAndSearch = React.memo(({greeting, username}) => {
    const [showGreeting, setShowGreeting] = React.useState(true);
    const greetingText = showGreeting ? `${greeting} ${username}` : 'Search your expenses';

    const fadeAnimation = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      const fadeIn = Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      });
      const fadeOut = Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      });

      const timer = setTimeout(() => {
        fadeOut.start(() => {
          setShowGreeting(false);
          fadeIn.start();
        });
      }, 2000);

      fadeIn.start();

      return () => {
        clearTimeout(timer);
        fadeAnimation.setValue(0);
      };
    }, [fadeAnimation]);

    return (
      <Animated.View style={{ opacity: fadeAnimation }}>
        <View style={{ marginLeft: 6 }}>
          <MyText style={{color: allColors.universalColor}} variant="titleMedium">{greetingText}</MyText>
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
      {!isParent && (
        <Button onPress={() => navigation.goBack()}>
          <IconComponent
            name={"keyboard-backspace"}
            category={"MaterialIcons"}
            size={20}
          />
        </Button>
      )}
      {isHome || needSearch ? (
        <>
        <Appbar.Action icon="magnify" onPress={searchExpense} color={allColors.universalColor}/>
        <Appbar.Content title={<GreetAndSearch greeting={greeting} username={username}/>} onPress={searchExpense}/>
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
      {isHome && (
        <Appbar.Action
        icon={({ color, size }) => (
          <View style={{ alignItems: 'center' }}>
            <Feather name="settings" size={20} color={allColors.textColorPrimary} style={{ position: 'absolute' }} />
          </View>
          )}
          onPress={() => navigation.navigate("SettingsScreen")}
        />
      )}
      {isPlus && isUpdate && (
        <Appbar.Action icon="delete" onPress={handleDeleteExpense} color={allColors.universalColor}/>
      )}
      {
        needInfo && (
          <Appbar.Action icon={({ color, size }) => (
              <Feather name="info" size={20} color={allColors.textColorPrimary}/>
          )} onPress={handleInfoPress}/>
        )
      }
    </Appbar.Header>
  );
};

export default AppHeader;
