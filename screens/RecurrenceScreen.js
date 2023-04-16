import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import { FAB, Card, Text } from "react-native-paper";
import allColors from "../commons/allColors";
import AnimatedEntryScreen from "../components/AnimatedEntryScreen";
import AppHeader from "../components/AppHeader";
import React from "react";
import obj from "../helper/dummy";

const RecurrenceScreen = ({ navigation }) => {

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text>{item.name}</Text>
        <Text>{item.account}</Text>
      </Card.Content>
    </Card>
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor={"transparent"} />
      <AppHeader
        title="Recurring Expenses"
        isParent={true}
        navigation={navigation}
      />
      <AnimatedEntryScreen>
        {/* Anticipated Balance || Projected Balance || Future Balance */}
        <View style={{ margin: 20 }}>
          <Card
            mode="contained"
            style={{ backgroundColor: allColors.backgroundColorSecondary }}
          >
            <Card.Title
              title="Anticipated Balance"
              subtitle="$75,000"
              titleStyle={{
                color: allColors.textColorPrimary,
                fontSize: 30,
                paddingTop: 30,
              }}
              subtitleStyle={{
                fontSize: 35,
                textAlignVertical: "center",
                paddingTop: 30,
                paddingBottom: 10,
                color: allColors.textColorSecondary,
              }}
            />
            <Card.Content>
              <Text variant="headlineSmall">Current balance: $50,000</Text>
            </Card.Content>
          </Card>
        </View>

        <ScrollView>
          <View style={{ margin: 20, flex: 1}}>
            <FlatList
            scrollEnabled={false}
              data={obj}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>
        </ScrollView>
      </AnimatedEntryScreen>
      <FAB
        animated
        icon="repeat"
        onPress={() => navigation.navigate("PlusMoreRecurrence")}
        mode="flat"
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
const styles = StyleSheet.create({
  card: {
    backgroundColor: allColors.backgroundColorRecurrence,
    marginTop: 8,
    marginBottom: 8,
    elevation: 4,
    borderRadius: 8,
  },
});
export default RecurrenceScreen;
