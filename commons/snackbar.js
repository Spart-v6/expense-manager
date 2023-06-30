import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";
import MyText from "../components/MyText";
import useDynamicColors from "../commons/useDynamicColors";

const SnackbarComponent = ({errorMsg}) => {
  const allColors = useDynamicColors();

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
        <MyText variant="bodyMedium"> {errorMsg} </MyText>
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
