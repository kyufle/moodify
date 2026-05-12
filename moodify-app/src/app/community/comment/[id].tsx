import React from 'react';
import ForumView from '@/components/forum/ForumView';
import { DiscoverPeople } from '@/components/forum/DiscoverPeople';
import { useLocalSearchParams } from 'expo-router';

export default function CommunityScreen() {
  const { id } = useLocalSearchParams();
  // @ts-ignore
  return <ForumView activeTab='comment' selectedPostId={id} />;
}
