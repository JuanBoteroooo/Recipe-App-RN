import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import COLORS from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

// Aquí deberías traer el email desde el contexto o props (según tu lógica actual)
const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { email } = route?.params || { email: 'No disponible' };


  const handleLogout = () => {
    // Aquí iría tu lógica de logout real (limpiar token, contexto, etc)
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Correo electrónico:</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.fifth,
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    color: COLORS.fifth,
    marginBottom: 5,
  },
  email: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.fourth,
  },
  button: {
    backgroundColor: COLORS.fourth,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
