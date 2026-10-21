import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

import { createPost } from "@/api/postApi";
import PostForm from "@/components/PostForm";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [formKey, setFormKey] = useState(0);

  const handleFormChange = useCallback(
    (newTitle: string, newDescription: string, newCategory: string) => {
      setTitle(newTitle);
      setDescription(newDescription);
      setCategory(newCategory);
    },
    [],
  );

  const savePost = async () => {
    await createPost({
      title: title,
      description: description,
      hashtags: "",
      author: "Robyn",
      category: category,
    });

    setTitle("");
    setDescription("");
    setCategory("");

    // Tømmer også tekstfeltene i PostForm
    setFormKey((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.backButtonText}>‹ Back</Text>
      </Pressable>

      <Text style={styles.title}>Create post</Text>

      <PostForm key={formKey} onChange={handleFormChange} />

      <Button title="Save post" onPress={savePost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  backButtonText: {
    color: "#6258d8",
    fontSize: 17,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
