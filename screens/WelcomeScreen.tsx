import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Chopped</Text>
      <Text style={styles.tagline}>Don’t be chopped.</Text>
      <Button title="Continue with Google" onPress={() => {}} />
      <Button title="Continue with Apple" onPress={() => {}} />
      <Button
        title="I'm 18+ – Continue"
        onPress={() => navigation.navigate('Upload')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  tagline: { fontSize: 18, marginBottom: 40 },
});