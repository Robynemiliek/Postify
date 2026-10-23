import { Redirect } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    getSignInErrorMessage,
    getSignUpErrorMessage,
    signInWithEmail,
    signUpWithEmail,
} from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";

type Mode = "signIn" | "signUp";

export default function AuthScreen() {
  const { user, loading } = useAuth();

  const [mode, setMode] = useState<Mode>("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#6258d8" />
      </View>
    );
  }

  // Already signed in? Go to the home screen.
  if (user) {
    return <Redirect href="/" />;
  }

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError("");
  };

  const handleSubmit = async () => {
    if (mode === "signUp" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setBusy(true);

    try {
      if (mode === "signIn") {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password, name.trim());
      }
    } catch (e: any) {
      const message =
        mode === "signIn"
          ? getSignInErrorMessage(e.code)
          : getSignUpErrorMessage(e.code);

      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Postify</Text>
      <Text style={styles.subtitle}>Share your moments with the world</Text>

      <View style={styles.toggle}>
        <Pressable
          style={[
            styles.toggleButton,
            mode === "signIn" && styles.toggleActive,
          ]}
          onPress={() => switchMode("signIn")}
        >
          <Text
            style={[
              styles.toggleText,
              mode === "signIn" && styles.toggleTextActive,
            ]}
          >
            Sign in
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.toggleButton,
            mode === "signUp" && styles.toggleActive,
          ]}
          onPress={() => switchMode("signUp")}
        >
          <Text
            style={[
              styles.toggleText,
              mode === "signUp" && styles.toggleTextActive,
            ]}
          >
            Register
          </Text>
        </Pressable>
      </View>

      {mode === "signUp" && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <TextInput
        style={styles.input}
        placeholder="Password (at least 6 characters)"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.button, busy && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={busy}
      >
        {busy ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            {mode === "signIn" ? "Sign in" : "Create account"}
          </Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6258d8",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
    textAlign: "center",
    marginBottom: 32,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#f2f2f7",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#fff",
  },
  toggleText: {
    fontSize: 15,
    color: "#666",
  },
  toggleTextActive: {
    color: "#6258d8",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
    color: "#222",
  },
  error: {
    color: "#d93025",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#6258d8",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
