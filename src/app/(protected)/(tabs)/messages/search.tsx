import CustomIcon from "@/components/icons/CustomIcon";
import { TextRegular } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useChats } from "@/stores/useChatStore";
import { useUserData } from "@/stores/useUserStore";
import { Chat } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchModal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const userData = useUserData();
  const chats = useChats();

  const handleSearch = async (text: string) => {
    // Handle search input
    setSearchQuery(text);
    if (text.length > 0) {
      const results = chats.filter((chat) =>
        JSON.stringify(chat).toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultPress = (chat: Chat) => {
    // Naviagate to the chat screen
    router.navigate({
      pathname: "/(protected)/(chat)/[chatId]",
      params: { chatId: chat.id },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <CustomIcon name="search" size={20} color="#9b9a9e" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search chats..."
          placeholderTextColor={Colors.lightText}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color="#9b9a9e" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Chat }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleResultPress(item)}
          >
            <TextRegular style={styles.resultTitle}>
              {userData?.role === "patient"
                ? `${item.participants.doctor.firstName} ${item.participants.doctor.lastName}`
                : `${item.participants.patient.firstName} ${item.participants.patient.lastName}`}
            </TextRegular>
            <TextRegular style={styles.resultDate}>
              {item.createdAt.toDate().toLocaleString()}
            </TextRegular>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <TextRegular style={styles.emptyText}>
              {searchQuery.length > 0
                ? "No chats found"
                : "Start typing to search chats"}
            </TextRegular>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.faintGrey,
    gap: 10,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  resultItem: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
  },
  resultTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  resultDate: {
    color: "#9b9a9e",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 32,
  },
  emptyText: {
    color: "#9b9a9e",
    fontSize: 16,
  },
});
