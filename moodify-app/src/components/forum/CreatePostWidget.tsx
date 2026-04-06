import React from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const CreatePostWidget = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.avatarPlaceholder}>
          <Feather name="user" size={20} color="#94A3B8" />
        </View>
        <TextInput 
          style={styles.input}
          placeholder="¿Qué tienes en mente?"
          placeholderTextColor="#94A3B8"
        />
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionItem}>
          <Feather name="image" size={18} color="#3B82F6" />
          {/* <Text style={styles.actionText}>Foto</Text> */}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Feather name="video" size={18} color="#EF4444" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Feather name="map-pin" size={18} color="#10B981" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.postButton}>
          <Feather name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  postButton: {
    backgroundColor: '#334155',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  }
});
