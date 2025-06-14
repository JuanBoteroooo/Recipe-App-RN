import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../api/api';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import isoLogo from '../../assets/iso.png';

export default function GroupsScreen({ navigation }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups');
      setGroups(res.data);
    } catch (error) {
      console.error('Error al obtener los grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchGroups);
    return unsubscribe;
  }, [navigation]);

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('GroupDetail', { groupId: item._id })}
      activeOpacity={0.85}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBg}>
        <View style={styles.headerRow}>
          <Image source={isoLogo} style={styles.headerLogo} />
          <Text style={styles.header}>Mis Grupos</Text>
          <TouchableOpacity
            style={styles.headerAddButton}
            onPress={() => navigation.navigate('CreateGroup')}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={36} color={COLORS.accent} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item._id}
          renderItem={renderGroup}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 12 }}
        />
      )}
    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#F9FAFB',
  accent: '#FF6B00',
  secondary: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  shadow: '#000000',
  headerBg: '#FFF3E6',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFDF9'
  },
  headerBg: {
    backgroundColor: COLORS.headerBg,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 8,   
    paddingTop: 8,      
    marginTop: 5,      
    marginBottom: 8,
    shadowColor: '#fff',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    shadowColor: '#d1d9e6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f5e9da',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 2,
    minHeight: 48,
  },
  headerLogo: {
    width: 40,
    height: 40,
    marginRight: 8,
    resizeMode: 'contain'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent,
    letterSpacing: 0.5,
    textShadowColor: '#fff2',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    flex: 1,
  },
  headerAddButton: {
    marginLeft: 6,
    marginRight: 8, 
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
    borderColor: COLORS.border,
    borderWidth: 1,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: 120,
    height: 100,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  infoContainer: {
    flex: 1,
    padding: 14,
    justifyContent: 'center'
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  fab: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    padding: 2,
    elevation: 4,
    shadowColor: COLORS.textPrimary,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  }
});
