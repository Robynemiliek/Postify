import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://images2.minutemediacdn.com/image/upload/c_crop,x_0,y_521,w_6960,h_3915/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/images%2FvoltaxMediaLibrary%2Fmmsport%2Fmentalfloss%2F01g05dr5ywhn47egkrkd.jpg",
        }}
        style={styles.image}
      />

      <Text style={styles.name}>Robyn</Text>
      <Text style={styles.bio}>Student og utvikler</Text>

      <View style={styles.imfo}>
        <Text style={styles.imfoText}>Oslo, Norway</Text>
        <Text style={styles.imfoText}>Høyskolen Kristiania</Text>
        <Text style={styles.imfoText}>12 inlegg</Text>
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

  buttonPressed: {
    opacity: 0.75,
  },
});
