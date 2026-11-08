import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ChatScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Pesan / Chat</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
});