import { Text, TextProps } from "./Themed";

export function TextNormal(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "dm" }]} />;
}

export function TextSb(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "dm-sb" }]} />;
}

export function TextB(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: "dm-b" }]} />;
}
