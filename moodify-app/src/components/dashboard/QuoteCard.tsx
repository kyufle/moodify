import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { getRandomQuote } from '../../utils/utils';

export const QuoteCard = () => {
  const { t } = useTranslation();

  const quote = useMemo(() => getRandomQuote(), []);

  return (
    <LinearGradient
      colors={['#1E293B', '#334155']}
      style={styles.container}
    >
      <Feather 
        name="message-square" 
        size={24} 
        color="rgba(255, 255, 255, 0.2)" 
        style={styles.quoteIcon} 
      />
      
      <Text style={styles.quoteText}>
        "{quote.text}"
      </Text>

      <View style={styles.footer}>
        <Text style={styles.author}>— {quote.author}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>
            {t('motivation', 'MOTIVACIÓN').toUpperCase()}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 24,
    borderRadius: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  quoteIcon: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  quoteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 20,
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontWeight: '600',
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  }
});