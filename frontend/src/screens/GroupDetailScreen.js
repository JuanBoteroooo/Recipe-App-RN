import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet,
  ActivityIndicator, TouchableOpacity, Alert
} from 'react-native';
import api from '../api/api';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function GroupDetailScreen({ route, navigation }) {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/groups/${groupId}`);
      setGroup(res.data);
    } catch (error) {
      console.error('Error al obtener grupo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchGroup);
    return unsubscribe;
  }, [navigation]);

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailRecipe', { recipe: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color={COLORS.dark} />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primaryAccent} />
      ) : (
        <>
          <View style={{ marginTop: insets.top + 20 }}>
            <Text style={styles.header}>{group?.name}</Text>
          </View>

          {group?.recipes?.length === 0 ? (
            <Text style={styles.emptyText}>Este grupo no tiene recetas todavía.</Text>
          ) : (
            <FlatList
              data={group.recipes}
              keyExtractor={(item) => item._id}
              renderItem={renderRecipe}
              contentContainerStyle={{ paddingBottom: 80, paddingTop: 12 }}
            />
          )}

          <TouchableOpacity
            style={[styles.fab, { top: insets.top + 12, right: insets.right + 18 }]}
            onPress={() => navigation.navigate('AddRecipeToGroup', { groupId })}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={48} color={COLORS.primaryAccent} />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#F7F7F7',
  card: '#FFFFFF',
  border: '#E0E0E0',
  textPrimary: '#222222',
  textSecondary: '#666666',
  primaryAccent: '#FF6B00',
  dark: '#141414',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background
  },
  backButton: {
    position: 'absolute',
    left: 18,
    zIndex: 10,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: COLORS.primaryAccent,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 60,
    color: COLORS.textSecondary
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: COLORS.border
  },
  image: {
    width: 130,
    height: 100,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16
  },
  infoContainer: {
    flex: 1,
    padding: 14,
    justifyContent: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  fab: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: COLORS.card,
    borderRadius: 30,
    padding: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  }
});
