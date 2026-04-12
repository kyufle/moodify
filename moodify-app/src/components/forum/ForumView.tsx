import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DashboardBackground } from '../dashboard/DashboardBackground';
import { StaticBottomNavBar } from '../StaticBottomNavBar';
import { ForumHeader } from './ForumHeader';
import { StoriesBar } from './StoriesBar';
import { StaffAnnouncements } from './StaffAnnouncements';
import { CreatePostWidget } from './CreatePostWidget';
import { PostCard } from './PostCard';

const DUMMY_POSTS = [
  {
    id: '1',
    user: 'Alex Turner',
    time: 'Hace 2 horas',
    content: '¡Hoy ha sido un gran día! He conseguido mantener mi racha de 7 días. #Moodify #Motivacion',
    likes: 24,
    comments: 5,
  },
  {
    id: '2',
    user: 'Sofia Rossi',
    time: 'Hace 5 horas',
    content: '¿Alguien sabe de alguna técnica para relajarse antes de dormir? Me está costando un poco últimamente.',
    likes: 12,
    comments: 8,
  },
  {
    id: '3',
    user: 'Carlos Ruiz',
    time: 'Hace 1 día',
    content: 'Me encanta la nueva actualización de la app. El calendario es súper intuitivo.',
    likes: 45,
    comments: 3,
  }
];

export const ForumView = () => {
  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ForumHeader />
          <StoriesBar />
          <StaffAnnouncements />
          <CreatePostWidget />
          
          {DUMMY_POSTS.map(post => (
            <PostCard 
              key={post.id}
              user={post.user}
              time={post.time}
              content={post.content}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
        </ScrollView>
      </DashboardBackground>

      <StaticBottomNavBar activeTab="community" />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, 
  }
});

export default ForumView;
