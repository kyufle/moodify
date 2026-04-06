import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const DUMMY_STORIES = [
  { id: '1', name: 'Tu historia', isUser: true, mood: '😊' },
  { id: '2', name: 'Alex', mood: '🔥' },
  { id: '3', name: 'Sofia', mood: '✨' },
  { id: '4', name: 'Carlos', mood: '⚡' },
  { id: '5', name: 'Maria', mood: '🌈' },
  { id: '6', name: 'Dani', mood: '🍕' },
];

export const StoriesBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DUMMY_STORIES.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <View style={styles.avatarWrapper}>
              {story.isUser ? (
                <View style={styles.userAvatarBorder}>
                   <View style={styles.avatarPlaceholder}>
                    <Feather name="user" size={24} color="#94A3B8" />
                  </View>
                  <View style={styles.addButton}>
                    <Feather name="plus" size={12} color="#FFFFFF" />
                  </View>
                </View>
              ) : (
                <LinearGradient
                  colors={['#818CF8', '#C084FC', '#F472B6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBorder}
                >
                  <View style={styles.avatarInner}>
                    <Text style={styles.moodEmoji}>{story.mood}</Text>
                  </View>
                </LinearGradient>
              )}
            </View>
            <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 68,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userAvatarBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#334155',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  moodEmoji: {
    fontSize: 24,
  },
  storyName: {
    marginTop: 6,
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    textAlign: 'center',
  },
});
