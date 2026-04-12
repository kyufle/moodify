import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MessageBubbleProps {
  text: string;
  isAI: boolean;
  time: string;
}

export const MessageBubble = ({ text, isAI, time }: MessageBubbleProps) => {
  return (
    <View style={[styles.container, isAI ? styles.aiContainer : styles.userContainer]}>
      {isAI ? (
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.aiBubble}
        >
          <Text style={styles.aiText}>{text}</Text>
          <Text style={styles.aiTime}>{time}</Text>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.userBubble}
        >
          <Text style={styles.userText}>{text}</Text>
          <Text style={styles.userTime}>{time}</Text>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '85%',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    padding: 14,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  userBubble: {
    padding: 14,
    borderRadius: 20,
    borderBottomRightRadius: 4,
  },
  aiText: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
  },
  aiTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'right',
  },
  userTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
  }
});
