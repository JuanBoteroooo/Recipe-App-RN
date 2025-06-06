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
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 10 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#7b4258" />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <>
          {/* Agregamos separación extra debajo del botón */}
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
              numColumns={2}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ paddingBottom: 80, paddingTop: 12 }}
            />
          )}

          <TouchableOpacity
            style={[styles.fab, { top: insets.top + 12, right: insets.right + 18 }]}
            onPress={() => navigation.navigate('AddRecipeToGroup', { groupId })}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={48} color="#aa6e7f" />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#ffffff',
  secondary: '#f5eaed',
  tertiary: '#aa6e7f',
  fourth: '#7b4258',
  fifth: '#3c2a30'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: COLORS.primary
  },
  backButton: {
    position: 'absolute',
    left: 18,
    zIndex: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 4
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: COLORS.fifth,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 60,
    color: COLORS.tertiary
  },
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    shadowColor: COLORS.fifth,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
    minWidth: 0
  },
  image: {
    width: '100%',
    aspectRatio: 1.2,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.tertiary,
    backgroundColor: '#eee'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.fifth,
    marginBottom: 2
  },
  fab: {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    padding: 2,
    elevation: 4,
    shadowColor: COLORS.fifth,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  }
});
