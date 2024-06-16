import { Text } from "react-native-paper";

const withContent = (WrappedComponent) => {
  return ({ children, ...rest }) => {
    return <WrappedComponent content={children} {...rest} />;
  };
};

const MyText = ({ style, content, ...rest }) => {
  return (
    <Text style={[{ fontFamily: "Karla_400Regular" }, style]} {...rest}>
      {content}
    </Text>
  );
};

const TextWithContent = withContent(MyText);

export default TextWithContent;
