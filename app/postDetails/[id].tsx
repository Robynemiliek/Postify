import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getPostById, toggleBookmark } from "@/api/postApi";
import { PostData } from "@/utils/postData";

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<PostData | null>(null);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      const fetchedPost = await getPostById(id);
      setPost(fetchedPost);

      const user = await AsyncStorage.getItem("currentUser");
      setCurrentUser(user || "");
    };

    loadPost();
  }, [id]);

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6258d8" />
        <Text style={styles.loadingText}>Loading post...</Text>
      </View>
    );
  }

  const currentlyBookmarked = post.bookmarks?.includes(currentUser) ?? false;

  const handleToggleBookmark = async () => {
    if (!post || !currentUser) return;

    await toggleBookmark(post.id, currentUser, currentlyBookmarked);

    const newBookmarks = currentlyBookmarked
      ? (post.bookmarks || []).filter((user) => user !== currentUser)
      : [...(post.bookmarks || []), currentUser];

    setPost({ ...post, bookmarks: newBookmarks });
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
        <Text style={styles.backButtonText}>‹  Back</Text>
      </Pressable>
      <View style={styles.postCard}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>{post.description}</Text>
        <Pressable
          accessibilityLabel={
            currentlyBookmarked ? "Remove bookmark" : "Add to bookmarks"
          }
          accessibilityRole="button"
          accessibilityState={{
            selected: currentlyBookmarked,
            disabled: !currentUser,
          }}
          disabled={!currentUser}
          onPress={handleToggleBookmark}
          style={({ pressed }) => [
            styles.bookmarkButton,
            currentlyBookmarked && styles.bookmarkedButton,
            pressed && styles.buttonPressed,
            !currentUser && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.bookmarkButtonText}>
            {currentlyBookmarked
              ? "🔖 Remove bookmark"
              : "🔖 Add to bookmarks"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  backButtonText: {
    color: "#6258d8",
    fontSize: 17,
    fontWeight: "600",
  },
  postCard: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#eeeeee",
    marginVertical: 18,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 22,
  },
  bookmarkButton: {
    backgroundColor: "#ddddff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  bookmarkedButton: {
    backgroundColor: "#c9c5ff",
  },
  bookmarkButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "gray",
  },
});
