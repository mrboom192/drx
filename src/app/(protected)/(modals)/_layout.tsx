import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="add"
        options={{
          title: "Add",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: "Edit",
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
}
