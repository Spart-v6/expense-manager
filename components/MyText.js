import { Text } from "react-native-paper";

const withContent = (WrappedComponent) => {
  return ({ children, ...rest }) => {
    return <WrappedComponent content={children} {...rest} />;
  };
};

const MyText = ({ style, content, fontWeight = "normal", ...rest }) => {
  const fontFamily =
    fontWeight === "bold" ? "Poppins_700Bold" : "Poppins_400Regular";

  return (
    <Text style={[{ fontFamily }, style]} {...rest}>
      {content}
    </Text>
  );
};

const TextWithContent = withContent(MyText);

export default TextWithContent;
