import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import api from "../api/api";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { assets } from "../../assets/assets";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/users/login", { email, password });
      console.log("Token recibido:", res.data.token);

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("userId", res.data.userId);
      await AsyncStorage.setItem("email", email);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Tabs" }],
        })
      );
    } catch (err) {
      console.log(err.response?.data);
      Alert.alert(
        "Error",
        err.response?.data?.message || "No se pudo iniciar sesión"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: assets.logoImage }} style={styles.logo} />
      <Text style={styles.title}>GastroShare</Text>
      <Text style={styles.subtitle}>Bienvenido de nuevo</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={COLORS.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

// PALETA FINAL
const COLORS = {
  primary: "#F5F5F5",
  card: "#FFFFFF",
  accent: "#FF6B00", // solo para el logo y links
  textPrimary: "#1F1F1F",
  textSecondary: "#808080",
  border: "#E0E0E0",
  button: "#333333",
  buttonText: "#FFFFFF",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.primary,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.button,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },
  button: {
    backgroundColor: COLORS.button,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: COLORS.accent,
    textAlign: "center",
    marginTop: 20,
    fontWeight: "500",
  },
});
