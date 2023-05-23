import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Snackbar, Text } from "react-native-paper";
import allColors from "./allColors";

const SnackbarComponent = ({errorMsg}) => {

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Snackbar
        visible
        onDismiss={onDismissSnackBar}
        style={{backgroundColor: allColors.errorColor}}
      >
        <Text variant="bodyMedium"> {errorMsg} </Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    position: "relative",
    marginLeft: 20,
    marginRight: 20,
    bottom: 70,
    left: 0
  },
});

export default SnackbarComponent;
