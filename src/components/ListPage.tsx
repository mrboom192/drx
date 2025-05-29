import { TextSemiBold } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import PageScrollView from "./PageScrollView";

type ListPageProps<T> = {
  data: T[] | undefined;
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  emptyMessage?: string;
};

function ListPage<T>({
  data,
  renderItem,
  emptyMessage = "No items found.",
}: ListPageProps<T>) {
  if (!data || data.length === 0) {
    return (
      <PageScrollView>
        <TextSemiBold style={styles.emptyMessage}>{emptyMessage}</TextSemiBold>
      </PageScrollView>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item: any) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
}

export default ListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 16,
    color: Colors.grey,
  },
});
