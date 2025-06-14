import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../api/api';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import isoLogo from '../../assets/iso.png';

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
    if (route.params?.newRecipeCreated) {
      fetchRecipes(); // tu función de recarga
    }
  }, [route.params?.newRecipeCreated]);

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
      <View style={styles.headerWrapper}>
        <View style={styles.headerBg}>
          <View style={styles.headerRow}>
            <Image source={isoLogo} style={styles.headerLogo} />
            <Text style={styles.header}>Recetas Generales</Text>
            <TouchableOpacity
              style={styles.headerAddButton}
              onPress={() => navigation.navigate('CreateRecipe')}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={36} color={COLORS.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
  primary: '#F9FAFB',
  accent: '#FF6B00', 
  cardBackground: '#F9F9F9',
  blueDark: '#1B263B',
  textPrimary: '#1B263B',
  textSecondary: '#6C757D',
  border: '#E0E0E0',
  headerBg: '#FFF3E6', 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFDF9' 
  },
  headerWrapper: {
    marginTop: -12, // Menos margen superior
    paddingTop: 0,
  },
  headerBg: {
    backgroundColor: COLORS.headerBg,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 8,   // Menos padding
    paddingTop: 8,      // Menos padding
    marginTop: 16,      // Menos margen
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
    minHeight: 48, // Altura mínima para el header
  },
  headerLogo: {
    width: 40, // Más pequeño
    height: 40,
    marginRight: 8,
    resizeMode: 'contain'
  },
  header: {
    fontSize: 22, // Más pequeño
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