import PageHeader from "@/components/PageHeader";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function ModalsLayout() {
  const { t } = useTranslation();

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
          title: t("page.create-second-opinion"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="second-opinion-info"
        options={{
          title: t("page.create-second-opinion"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="update-public-profile"
        options={{
          title: t("page.edit-public-profile"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="update-service"
        options={{
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="add-card"
        options={{
          title: t("page.add-card"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen name="[date]" />
      <Stack.Screen
        name="doctor-verification"
        options={{
          title: t("page.verification"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="filter"
        options={{
          title: t("page.filters"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="add-phone"
        options={{
          title: t("page.add-phone-number"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="country-picker"
        options={{
          title: t("page.select-a-country"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
      <Stack.Screen
        name="verify-code"
        options={{
          title: t("page.verify-phone-number"),
          presentation: "modal",
          header: (props) => <PageHeader {...props} />,
        }}
      />
    </Stack>
  );
}
