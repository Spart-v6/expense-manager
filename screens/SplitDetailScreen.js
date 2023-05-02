import { View, SafeAreaView } from "react-native";
import { Text } from "react-native-paper";
import AppHeader from "../components/AppHeader";
import React from "react";

const SplitDetailScreen = ({ navigation, route }) => {
  const [currentSectionData, setCurrentSectionData] = React.useState(
    route.params.subArray
  );

  // console.log(currentSectionData);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppHeader
        title={currentSectionData[currentSectionData.length - 1].sectionName}
        navigation={navigation}
        isPlus={true}
      />
      <View>
        <Text>SplitDetailScreen</Text>
      </View>
    </SafeAreaView>
  );
};

/* 

Section name in middle
Who paid and how much 
list of members with their amount paid

*/

export default SplitDetailScreen;
