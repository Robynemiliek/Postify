import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { signOutUser } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    setLoggingOut(true);
    setError("");

    try {
      await signOutUser();
    } catch {
      setError("Could not sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images2.minutemediacdn.com/image/upload/c_crop,x_0,y_521,w_6960,h_3915/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/images%2FvoltaxMediaLibrary%2Fmmsport%2Fmentalfloss%2F01g05dr5ywhn47egkrkd.jpg",
        }}
        style={styles.image}
      />

      <Text style={styles.name}>{user?.displayName || "Postify user"}</Text>

      <Text style={styles.bio}>Student og utvikler</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.imfo}>
        <Text style={styles.imfoText}>Oslo, Norway</Text>
        <Text style={styles.imfoText}>Høyskolen Kristiania</Text>
        <Text style={styles.imfoText}>12 innlegg</Text>
      </View>

      <Pressable
        accessibilityLabel="Create a post"
        accessibilityRole="button"
        onPress={() => router.push("/CreatePostScreen")}
        style={({ pressed }) => [
          styles.createPostButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.createPostButtonText}>＋ Create post</Text>
      </Pressable>

      <Pressable
        accessibilityLabel="Log out"
        accessibilityRole="button"
        disabled={loggingOut}
        onPress={handleSignOut}
        style={({ pressed }) => [
          styles.logoutButton,
          (pressed || loggingOut) && styles.buttonPressed,
        ]}
      >
        {loggingOut ? (
          <ActivityIndicator color="#6258d8" />
        ) : (
          <Text style={styles.logoutButtonText}>Log out</Text>
        )}
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },

  image: {
    width: 200,
    height: 200,
    borderRadius: 75,
    marginTop: 40,
    marginBottom: 15,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
  },

  bio: {
    fontSize: 16,
    color: "gray",
    marginTop: 4,
  },

  email: {
    fontSize: 14,
    color: "#6258d8",
    marginTop: 8,
  },

  imfo: {
    marginTop: 30,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "100%",
  },

  imfoText: {
    fontSize: 16,
    marginBottom: 12,
  },

  createPostButton: {
    width: "100%",
    backgroundColor: "#ddddff",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },

  createPostButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  logoutButton: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6258d8",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },

  logoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6258d8",
  },

  error: {
    color: "#d93025",
    marginTop: 12,
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
