import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";

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
        name="update-condition"
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
      <Stack.Screen
        name="create-second-opinion"
        options={{
          title: "Create Second Opinion",
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="second-opinion-info"
        options={{
          title: "Create Second Opinion",
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="update-public-profile"
        options={{
          title: "Edit public profile",
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="add-card"
        options={{
          title: "Add Card",
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen name="[date]" />
      <Stack.Screen
        name="doctor-verification"
        options={{
          title: "Verification",
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="filters"
        options={{
          title: "Filters",
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
}
