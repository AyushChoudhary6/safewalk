import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

interface ActionButtonsProps {
  onDirections?: () => void;
  onStart?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDirections,
  onStart,
  onSave,
  onShare,
}) => {
  return (
    <View style={styles.actionButtonsRow}>
      <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onDirections}>
        <MaterialCommunityIcons name="directions" size={20} color="#FFF" />
        <Text style={styles.primaryButtonText}>Directions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onStart}>
        <MaterialCommunityIcons name="navigation" size={20} color="#FFF" />
        <Text style={styles.primaryButtonText}>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onSave}>
        <MaterialCommunityIcons name="bookmark-outline" size={20} color="#0B84FF" />
        <Text style={styles.secondaryButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onShare}>
        <MaterialCommunityIcons name="share-outline" size={20} color="#0B84FF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  primaryButton: {
    backgroundColor: '#0B84FF',
  },
  secondaryButtonText: {
    color: '#0B84FF',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
