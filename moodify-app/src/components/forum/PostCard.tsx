import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface PostProps {
  user: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  image?: any;
}

export const PostCard = ({ user, time, content, likes, comments, image }: PostProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Feather name="user" size={18} color="#94A3B8" />
        </View>
        <View>
          <Text style={styles.userName}>{user}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-horizontal" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <Text style={styles.content}>{content}</Text>

      {image && (
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.statGroup}>
          <TouchableOpacity style={styles.statButton}>
            <Feather name="heart" size={20} color="#64748B" />
            <Text style={styles.statText}>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statButton}>
            <Feather name="message-square" size={20} color="#64748B" />
            <Text style={styles.statText}>{comments}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.statButton}>
          <Feather name="share-2" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  time: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  moreButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 12,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  statGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  }
});
