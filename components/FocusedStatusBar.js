import { StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/core";

const FocusedStatusBar = ({headerColor}) => {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar animated backgroundColor={headerColor} /> : null;
};

export default FocusedStatusBar;
