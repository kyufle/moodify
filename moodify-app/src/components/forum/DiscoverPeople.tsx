import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserContext } from '@/components/user-provider';
import { useTranslation } from 'react-i18next';
import { avatarMap } from '../../utils/utils';

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

const PersonCard = ({
  person,
  onFollowToggle,
}: {
  person: Person;
  onFollowToggle: (id: number, isFollowing: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    await onFollowToggle(person.id, !!person.is_following);
    setLoading(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        {person.image_id && avatarMap[person.image_id] ? (
          <Image 
            source={avatarMap[person.image_id]} 
            style={styles.avatarImage} 
          />
        ) : (
          /* Fallback por si no hay imagen o no coincide el ID */
          <LinearGradient 
            colors={['#6366F1', '#A855F7']} 
            style={styles.avatarPlaceholder}
          >
            <Text style={styles.avatarInitial}>
              {(person.name ?? person.username)[0]?.toUpperCase()}
            </Text>
          </LinearGradient>
        )}
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {person.name ?? person.username}
        </Text>
        <Text style={styles.cardUsername} numberOfLines={1}>@{person.username}</Text>
        
        {person.streak !== undefined && person.streak > 0 && (
          <View style={styles.streakBadge}>
            <Feather name="zap" size={11} color="#F59E0B" />
            <Text style={styles.streakText}>{person.streak} d</Text>
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
  const { t } = useTranslation();
  
  const [query, setQuery] = useState('');
  const [suggested, setSuggested] = useState<Person[]>([]);
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [blockedIds, setBlockedIds] = useState<number[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingSuggested, setLoadingSuggested] = useState(true);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const fetchData = useCallback(async () => {
    if (!token) { setLoadingSuggested(false); return; }
    try {
      // 1. Obtener bloqueados
      const blockRes = await fetch(`${API}community/blocked-users`, { headers: authHeaders });
      const blockedData = await blockRes.json();
      if (Array.isArray(blockedData)) {
        setBlockedIds(blockedData.map((u: any) => u.id));
      }

      // 2. Obtener sugeridos
      const suggRes = await fetch(`${API}community/suggested`, { headers: authHeaders });
      const suggData = await suggRes.json();
      if (Array.isArray(suggData)) {
        setSuggested(suggData.filter(p => !p.is_following));
      }
    } catch (e) {
      console.error("Error fetching Discover data", e);
    } finally {
      setLoadingSuggested(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim() || !token) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const r = await fetch(`${API}users/search?q=${encodeURIComponent(q)}`, { headers: authHeaders });
      const data = await r.json();
      if (Array.isArray(data)) setSearchResults(data);
    } catch {
    } finally { setSearching(false); }
  }, [token]);

  const handleFollowToggle = async (
    id: number,
    isFollowing: boolean,
    listSetter: React.Dispatch<React.SetStateAction<Person[]>>,
  ) => {
    if (!token) return;
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await fetch(`${API}community/users/${id}/${endpoint}`, {
        method: 'POST',
        headers: authHeaders,
      });
      listSetter(prev =>
        prev.map(p => p.id === id ? { ...p, is_following: !isFollowing } : p)
      );
    } catch {}
  };

  // Filtrar por IDs bloqueados
  const displayList = (query.trim() ? searchResults : suggested)
    .filter(person => !blockedIds.includes(person.id));

  const isLoading = query.trim() ? searching : loadingSuggested;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Feather name="search" size={16} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder={t('conversation.searchUers')}
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

      <Text style={styles.sectionLabel}>
        {query.trim() ? t('forum.results') : t('forum.mayKnow')}
      </Text>

      {isLoading ? (
        <ActivityIndicator color="#6366F1" style={{ marginVertical: 20 }} />
      ) : displayList.length === 0 ? (
        <View style={styles.emptySearch}>
          <Text style={styles.emptySearchText}>
            {query.trim() ? t('forum.noUsersFound') : t('forum.noNewSuggestions')}
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
  container: { marginBottom: 20, marginTop: 20 },
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
    marginBottom: 14 
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1E293B' },
  sectionLabel: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#94A3B8', 
    letterSpacing: 0.5, 
    textTransform: 'uppercase', 
    paddingHorizontal: 20, 
    marginBottom: 12 
  },
  cardScroll: { paddingHorizontal: 16, gap: 12 },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 16, 
    alignItems: 'center', 
    width: 140, 
    gap: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 8, 
    elevation: 2 
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarInitial: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  cardInfo: { alignItems: 'center', gap: 1, width: '100%' },
  cardName: { fontSize: 14, fontWeight: '700', color: '#1E293B', textAlign: 'center' },
  cardUsername: { fontSize: 11, color: '#94A3B8', fontWeight: '500', textAlign: 'center' },
  streakBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 3, 
    backgroundColor: '#FFFBEB', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 10, 
    marginTop: 4 
  },
  streakText: { fontSize: 10, fontWeight: '700', color: '#F59E0B' },
  followBtn: { 
    backgroundColor: '#6366F1', 
    borderRadius: 14, 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    width: '100%', 
    alignItems: 'center',
    marginTop: 4
  },
  followBtnActive: { 
    backgroundColor: '#EEF2FF', 
    borderWidth: 1.5, 
    borderColor: '#6366F1' 
  },
  followBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  followBtnTextActive: { color: '#6366F1' },
  emptySearch: { paddingHorizontal: 20, paddingVertical: 16 },
  emptySearchText: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },
});