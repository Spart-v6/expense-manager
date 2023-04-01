import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import allColors from "../commons/allColors";
import React from "react";

const makeStyles = () =>
  StyleSheet.create({
    card: {
      backgroundColor: allColors.backgroundColorLessPrimary,
      borderRadius: 25,
      margin: 16,
      padding: 16,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 30,
    },
  });

const CardComponent = () => {
  const styles = makeStyles();
  return (
    <>
      <Card style={[styles.card]}>
        <Card.Title
          title="VISA"
          titleStyle={{
            color: allColors.textColorFive,
            fontSize: 24,
            textAlign: "right",
            paddingTop: 15,
            paddingBottom: 10,
            textAlignVertical: "center",
          }}
        />
        <Card.Content>
          <View style={{gap: 6}}>
            <Text variant="titleMedium">Total Expenditure</Text>
            <Text
              variant="headlineLarge"
              style={{ color: allColors.textColorPrimary }}
            >
              $ 1123213123
            </Text>
          </View>
          <View style={styles.content}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Text
                variant="headlineSmall"
                style={{ color: allColors.textColorPrimary }}
              >
                ANKUR SINGH
              </Text>
              <Text
                variant="titleSmall"
                style={{ color: allColors.textColorPrimary }}
              >
                Valid Forever
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </>
  );
};

export default CardComponent;
