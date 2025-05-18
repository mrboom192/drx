import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="edit-medication"
        options={{
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
}
