import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

export default function GlassCard({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // This uses semi-transparency as a fallback for the blur
    backgroundColor: 'rgba(255, 255, 255, 0.12)', 
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    // Add a slight shadow to mimic the depth in the photo
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});