import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { getBookmarkedPosts, toggleBookmark } from "@/api/postApi";
import Post from "@/components/Post";
import { PostData } from "@/utils/postData";

export default function Favorites() {
  // Holder brukerens lagrede innlegg og navnet som brukes til bokmerker.
  const [posts, setPosts] = useState<PostData[]>([]);
  const [currentUser, setCurrentUser] = useState("");

  // Henter favorittene på nytt hver gang fanen får fokus.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadFavorites = async () => {
        const user = await AsyncStorage.getItem("currentUser");

        if (!user) {
          if (isActive) {
            setCurrentUser("");
            setPosts([]);
          }
          return;
        }

        const bookmarkedPosts = await getBookmarkedPosts(user);
        if (isActive) {
          setCurrentUser(user);
          setPosts(bookmarkedPosts);
        }
      };

      loadFavorites();
      return () => {
        isActive = false;
      };
    }, []),
  );

  // Fjerner bokmerket i databasen og tar innlegget ut av listen med en gang.
  const removeFavorite = async (post: PostData) => {
    if (!currentUser) return;

    await toggleBookmark(post.id, currentUser, true);
    setPosts((favorites) =>
      favorites.filter((favorite) => favorite.id !== post.id),
    );
  };

  // Sideoverskrift, favorittliste og melding som vises når listen er tom.
  return (
    <View style={styles.main}>
      <Text style={styles.title}>My favorites</Text>

      <FlatList
        contentContainerStyle={
          posts.length === 0 ? styles.emptyList : undefined
        }
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Post post={item} onRemoveFavorite={removeFavorite} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            Your favorite posts will appear here.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Oppsettet følger samme sidebredde og luft som Home-siden.
  main: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    paddingHorizontal: 24,
  },
});
