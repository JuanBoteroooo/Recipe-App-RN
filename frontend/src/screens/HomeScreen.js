import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../api/api';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recipes');
      setRecipes(res.data);
    } catch (error) {
      console.error('Error al obtener recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailRecipe', { recipe: item })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Recetas Generales</Text>

      <TouchableOpacity
        style={[
          styles.fab,
          {
            top: insets.top + 12,
            right: insets.right + 18
          }
        ]}
        onPress={() => navigation.navigate('CreateRecipe')}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={48} color={COLORS.accent} />
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.accent} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item._id}
          renderItem={renderRecipe}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 12 }}
        />
      )}
    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#FFFFFF',
  accent: '#FF6B00', 
  cardBackground: '#F9F9F9',
  blueDark: '#1B263B',
  textPrimary: '#1B263B',
  textSecondary: '#6C757D',
  border: '#E0E0E0', // Gris claro
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.primary
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.blueDark,
    letterSpacing: 1
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1.5,                 // << Aquí agregamos el borde
    borderColor: COLORS.border,      // Gris clarito
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: 170,
    height: 130,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18
  },
  infoContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
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