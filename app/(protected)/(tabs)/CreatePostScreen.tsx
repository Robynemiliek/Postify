import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { createPost } from "@/api/postApi";
import PostForm from "@/components/PostForm";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [formKey, setFormKey] = useState(0);

  const handleFormChange = useCallback(
    (
      newTitle: string,
      newDescription: string,
      newCategory: string,
      newImages: string[],
    ) => {
      setTitle(newTitle);
      setDescription(newDescription);
      setCategory(newCategory);
      setImages(newImages);
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
    setImages([]);

    // Tømmer alle tekstfeltene i PostForm
    setFormKey((prev) => prev + 1);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
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

      <View style={styles.saveButton}>
        <Button title="Save post" onPress={savePost} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
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
  saveButton: {
    marginTop: 20,
  },
  buttonPressed: {
    opacity: 0.75,
  },
});
