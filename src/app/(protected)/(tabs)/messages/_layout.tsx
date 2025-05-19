import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";

const MessagesLayout = () => {
  return (
    <Stack
      screenOptions={{
        navigationBarColor: "#FFF",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="search"
        options={{
          title: "Search Chats",
          animation: "fade",
          animationDuration: 125,
          headerShadowVisible: false,
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
};

export default MessagesLayout;
