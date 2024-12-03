import {
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FAB } from "react-native-paper";
import { HomeHeader } from "../components";
import React, { useState } from "react";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import { IconComponent } from "../components/IconPickerModal";
import AppHeader from "../components/AppHeader";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";
import RecentTransaction from "../components/RecentTransaction";

const AppHeaderMemoized = React.memo(AppHeader);

const HomeScreen = ({ navigation, route }) => {
  const allColors = useDynamicColors();
  const styles = makeStyles(allColors);

  const [onUpload, setOnUpload] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} barStyle={allColors.barStyle}/>
      <AppHeaderMemoized
        title="Home"
        isParent={true}
        navigation={navigation}
        isHome
        needSearch={true}
        onUpload={onUpload}
        setOnUpload={setOnUpload}
      />
      <ScrollView>
        <AnimatedEntryScreen>
          <HomeHeader />
          <View style={{margin: 16, gap: 10, marginTop: 0}}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <MyText style={{padding: 15, paddingLeft: 0, color: allColors.universalColor}} variant="titleMedium">
                Recently added
              </MyText>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10
                }}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("AllExpensesScreen")}
              >
                <MyText variant="titleMedium" style={{ color: allColors.universalColor}}>View all</MyText>
                <IconComponent
                  name={"arrow-right"}
                  category={"Octicons"}
                  color={allColors.addBtnColors}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <RecentTransaction/>
          </View>
        </AnimatedEntryScreen>
      </ScrollView>
      <FAB
        animated
        icon="plus"
        color={allColors.universalColor}
        onPress={() => navigation.navigate("PlusMoreHome")}
        mode="elevated"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: allColors.backgroundColorSecondary,
        }}
        customSize={70}
      />
    </SafeAreaView>
  );
};

const makeStyles = allColors =>
  StyleSheet.create({
    button: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: allColors.textColorSecondary,
      fontSize: 16,
      fontWeight: '700',
    },
    loaderContainer: {
      // flex: 1,
      gap: 20,
      justifyContent: "center",
      alignItems: "center",
      height: 200,
      // width: '100%'
    },
});

export default HomeScreen;
