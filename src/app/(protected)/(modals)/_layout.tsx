import IconButton from "@/components/IconButton";
import PageHeader from "@/components/PageHeader";
import { router, Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="update-medication"
        options={{
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="update-allergy"
        options={{
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
}
