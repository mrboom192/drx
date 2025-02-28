import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";

const Header = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Text>MyJournal</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", height: 50 },
});

export default Header;
