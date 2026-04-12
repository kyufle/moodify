import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ACTIONS = [
  { id: '1', label: 'Sugerir Reto', icon: 'zap', color: '#F59E0B' },
  { id: '2', label: '¿Cómo mejorar hoy?', icon: 'smile', color: '#10B981' },
  { id: '3', label: 'Duda sobre racha', icon: 'help-circle', color: '#6366F1' },
  { id: '4', label: 'Reportar problema', icon: 'alert-circle', color: '#EF4444' },
];

export const ChatQuickActions = ({ onAction }: { onAction: (label: string) => void }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ACTIONS.map(action => (
          <TouchableOpacity 
            key={action.id} 
            style={styles.chip}
            onPress={() => onAction(action.label)}
          >
            <Feather name={action.icon as any} size={14} color={action.color} />
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  scrollContent: {
    paddingHorizontal: 15,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  }
});
