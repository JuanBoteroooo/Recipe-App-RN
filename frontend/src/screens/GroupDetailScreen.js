import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet,
  ActivityIndicator, TouchableOpacity, Alert
} from 'react-native';
import api from '../api/api';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRoute } from '@react-navigation/native';

export default function GroupDetailScreen({ route, navigation }) {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/groups/${groupId}`);
      setGroup(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo cargar el grupo');
    } finally {
      setLoading(false);
    }
  };

  // Hook de focus robusto
  useFocusEffect(
    useCallback(() => {
      fetchGroup();
    }, [groupId])
  );

  const handleAddRecipe = () => {
    navigation.navigate('AddRecipeToGroup', { groupId });
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailRecipe', { recipe: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#6200EE" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{group?.name}</Text>

      <TouchableOpacity
        style={[styles.fab, { top: insets.top + 12, right: insets.right + 18 }]}
        onPress={handleAddRecipe}
      >
        <Ionicons name="add-circle" size={48} color={COLORS.tertiary} />
      </TouchableOpacity>

      {group?.recipes?.length === 0 ? (
        <Text style={styles.noRecipesText}>Este grupo aún no tiene recetas.</Text>
      ) : (
        <FlatList
          data={group.recipes}
          keyExtractor={(item) => item._id}
          renderItem={renderRecipe}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 24 }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
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
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: COLORS.fifth,
    letterSpacing: 1
  },
  noRecipesText: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.fifth
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
