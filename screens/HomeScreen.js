import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Text, FAB } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "red",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Homes Screen</Text>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("PlusMoreHome")}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
