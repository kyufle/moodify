import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ChatQuickActions = ({ onAction }: { onAction: (label: string) => void }) => {
  const [showActions, setShowActions] = useState(false);
  const {t} = useTranslation();
    const ACTIONS = [
    { id: '1', label: t('bloom.challenge'), icon: 'zap', color: '#F59E0B' },
    { id: '2', label: t('bloom.weImprove'), icon: 'smile', color: '#10B981' },
  ];

  const toggleActions = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowActions(!showActions);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={toggleActions}
        activeOpacity={0.7}
      >
        
        <Feather 
          name={showActions ? "chevron-down" : "chevron-up"} 
          size={18} 
          color="#DB2777"
        />
      </TouchableOpacity>

      {showActions && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.list}
        >
          {ACTIONS.map(action => (
            <TouchableOpacity 
              key={action.id} 
              style={styles.chip}
              onPress={() => {
                onAction(action.label);
                // Opcional: cerrar al pulsar una acción
                // toggleActions(); 
              }}
            >
              <Feather name={action.icon as any} size={14} color={action.color} />
              <Text style={styles.label}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 20
  },
  toggleText: {
    fontSize: 11,
    color: '#DB2777',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    marginTop: 4,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 15,
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FCE7F3',
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  }
});