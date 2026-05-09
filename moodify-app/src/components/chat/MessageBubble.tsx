import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

interface MessageBubbleProps {
  text: string;
  isAI: boolean;
  time: string;
  status?: 'pending' | 'sent' | 'read'; 
}

export const MessageBubble = ({ text, isAI, time, status }: MessageBubbleProps) => {
  return (
    <View style={[
      styles.container, 
      isAI ? styles.aiContainer : styles.meContainer
    ]}>
      <Text style={[
        styles.text, 
        isAI ? styles.aiText : styles.meText
      ]}>
        {text}
      </Text>
      
      <View style={styles.footer}>
        <Text style={[
          styles.time, 
          isAI ? styles.aiTime : styles.meTime
        ]}>
          {time}
        </Text>
        
      
        {!isAI && (
          <View style={styles.tickContainer}>
            {status === 'read' ? (
              <Ionicons name="checkmark-done" size={15} color="#34B7F1" />
            ) : (
              <Ionicons name="checkmark" size={15} color="#E2E8F0" />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  aiContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  meContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366F1',
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  aiText: {
    color: '#1E293B',
  },
  meText: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  time: {
    fontSize: 10,
  },
  aiTime: {
    color: '#94A3B8',
  },
  meTime: {
    color: '#E2E8F0',
  },
  tickContainer: {
    marginLeft: 4,
    bottom: -1,
  }
});