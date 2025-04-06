import React from "react";
import { View , StyleSheet} from "react-native";
import { Text, FAB } from "react-native-paper";

const CardsScreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Cards Screen</Text>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("PlusMoreCard")}
        variant="tertiary"
        mode="flat"
      />
    </View>
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

export default CardsScreen;
