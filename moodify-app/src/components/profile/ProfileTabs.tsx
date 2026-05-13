import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Feather name="grid" size={20} color={activeTab === 'posts' ? '#6366F1' : '#94A3B8'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Feather name="bookmark" size={20} color={activeTab === 'saved' ? '#6366F1' : '#94A3B8'} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tagged' && styles.activeTab]}
          onPress={() => setActiveTab('tagged')}
        >
          <Feather name="at-sign" size={20} color={activeTab === 'tagged' ? '#6366F1' : '#94A3B8'} />
        </TouchableOpacity>
      </View>

      <View style={styles.placeholderGrid}>
        {[1,2,3,4,5,6].map(i => (
          <View key={i} style={styles.gridItem} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  tabHeader: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tab: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#6366F1',
  },
  placeholderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    padding: 2,
  },
  gridItem: {
    width: '32.8%',
    aspectRatio: 1,
    backgroundColor: '#F1F5F9',
  }
});
