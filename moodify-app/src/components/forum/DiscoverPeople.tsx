import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '@/components/user-provider';

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://moodify_backend.test/api/';

interface Person {
  id: number;
  name?: string;
  username: string;
  image_id: string | null;
  streak?: number;
  points?: number;
  is_following?: boolean;
}

const AVATAR_GRADS: [string, string][] = [
  ['#6366F1', '#A855F7'],
  ['#10B981', '#3B82F6'],
  ['#F59E0B', '#EF4444'],
  ['#EC4899', '#8B5CF6'],
  ['#0EA5E9', '#6366F1'],
];

const PersonCard = ({
  person,
  onFollowToggle,
}: {
  person: Person;
  onFollowToggle: (id: number, isFollowing: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const grad = AVATAR_GRADS[person.id % AVATAR_GRADS.length];
  const initial = (person.name ?? person.username)[0]?.toUpperCase() ?? '?';

  const handlePress = async () => {
    setLoading(true);
    await onFollowToggle(person.id, !!person.is_following);
    setLoading(false);
  };

  return (
    <View style={styles.card}>
      <LinearGradient colors={grad} style={styles.avatar}>
        <Text style={styles.avatarInitial}>{initial}</Text>
      </LinearGradient>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {person.name ?? person.username}
        </Text>
        <Text style={styles.cardUsername}>@{person.username}</Text>
        {person.streak !== undefined && person.streak > 0 && (
          <View style={styles.streakBadge}>
            <Feather name="zap" size={11} color="#F59E0B" />
            <Text style={styles.streakText}>{person.streak} días</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.followBtn, person.is_following && styles.followBtnActive]}
        onPress={handlePress}
        disabled={loading}
        activeOpacity={0.75}
      >
        {loading ? (
          <ActivityIndicator size="small" color={person.is_following ? '#6366F1' : '#fff'} />
        ) : (
          <Text style={[styles.followBtnText, person.is_following && styles.followBtnTextActive]}>
            {person.is_following ? 'Siguiendo' : 'Seguir'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const DiscoverPeople = () => {
  const { userValue } = useContext(UserContext);
  const token = userValue?.accessToken;

  const [query, setQuery] = useState('');
  const [suggested, setSuggested] = useState<Person[]>([]);
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingSuggested, setLoadingSuggested] = useState(true);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    if (!token) { setLoadingSuggested(false); return; }
    fetch(`${API}community/suggested`, { headers: authHeaders })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSuggested(data); })
      .catch(() => {})
      .finally(() => setLoadingSuggested(false));
  }, [token]);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim() || !token) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const r = await fetch(`${API}users/search?q=${encodeURIComponent(q)}`, { headers: authHeaders });
      const data = await r.json();
      if (Array.isArray(data)) setSearchResults(data);
    } catch {}
    finally { setSearching(false); }
  }, [token]);

  const handleFollowToggle = async (
    id: number,
    isFollowing: boolean,
    listSetter: React.Dispatch<React.SetStateAction<Person[]>>,
  ) => {
    if (!token) return;
    try {
      await fetch(`${API}users/follow`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ followed_id: id }),
      });
      listSetter(prev =>
        prev.map(p => p.id === id ? { ...p, is_following: !isFollowing } : p)
      );
    } catch {}
  };

  const displayList = query.trim() ? searchResults : suggested;
  const isLoading = query.trim() ? searching : loadingSuggested;

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Feather name="search" size={16} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por @usuario..."
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setSearchResults([]); }}>
            <Feather name="x" size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Section label */}
      <Text style={styles.sectionLabel}>
        {query.trim() ? 'Resultados' : 'Personas que quizás conozcas'}
      </Text>

      {isLoading ? (
        <ActivityIndicator color="#6366F1" style={{ marginVertical: 20 }} />
      ) : displayList.length === 0 ? (
        <View style={styles.emptySearch}>
          <Text style={styles.emptySearchText}>
            {query.trim() ? 'No se encontraron usuarios' : 'No hay sugerencias disponibles'}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardScroll}
        >
          {displayList.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              onFollowToggle={(id, isF) =>
                handleFollowToggle(
                  id, isF,
                  query.trim() ? setSearchResults : setSuggested,
                )
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  cardScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    width: 130,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardInfo: {
    alignItems: 'center',
    gap: 2,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  cardUsername: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  streakText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
  },
  followBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 18,
    minWidth: 80,
    alignItems: 'center',
  },
  followBtnActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#6366F1',
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  followBtnTextActive: {
    color: '#6366F1',
  },
  emptySearch: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emptySearchText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
