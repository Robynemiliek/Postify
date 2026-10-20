import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  deletePost as deletePostFromFirebase,
  getAllPosts,
  updatePost as updatePostFromFirebase,
} from "@/api/postApi";
import { PostData } from "@/utils/postData";

export default function Page() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [currentUser, setCurrentUser] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostData | null>(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCategory, setEditedCategory] = useState("");


  // MIDLERTIDIG INNLOGGING
  const saveCurrentUser = async () => {
    await AsyncStorage.setItem("currentUser", "Robyn");
  };

  const loadCurrentUser = async () => {
    const user = await AsyncStorage.getItem("currentUser");
    setCurrentUser(user || "");
  };

  useEffect(() => {
    saveCurrentUser();
    loadCurrentUser();
  }, []);

  const loadPosts = async () => {
    const fetchedPosts = await getAllPosts();
    setPosts(fetchedPosts);
  };

  const deletePost = async () => {
    if (!selectedPost) return;

    await deletePostFromFirebase(selectedPost.id);

    const updatedPosts = posts.filter((post) => post.id !== selectedPost.id);

    setPosts(updatedPosts);

    setSelectedPost(null);
    setModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, []),
  );

  const startEditPost = (post: PostData) => {
    setSelectedPost(post);
    setEditedTitle(post.title);
    setEditedDescription(post.description);
    setEditedCategory(post.category || "");
    setEditModalVisible(true);
  };

  const updatePost = async () => {
    if (!selectedPost) return;

    await updatePostFromFirebase(selectedPost.id, {
      title: editedTitle,
      description: editedDescription,
      category: editedCategory,
    });

    const updatedPosts = posts.map((post) =>
      post.id === selectedPost.id
        ? {
            ...post,
            title: editedTitle,
            description: editedDescription,
            category: editedCategory,
          }
        : post,
    );

    setPosts(updatedPosts);
    setEditModalVisible(false);
    setSelectedPost(null);
  };

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Home</Text>
      {/* Viser alle postene */}
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.postCard}
            onPress={() => router.push(`/postDetails/${item.id}`)}
          >
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postDescription}>{item.description}</Text>
            {item.category && (
              <Text style={styles.postDescription}>
                Category: {item.category}
              </Text>
            )}

            {/* Slette post */}
            <View>
              <Pressable
                style={styles.deleteButton}
                onPress={() => {
                  setSelectedPost(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
            {/* Redigere post */}
            <Pressable
              style={styles.editButton}
              onPress={() => startEditPost(item)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </Pressable>
          </Pressable>
        )}
      />
      {/* Modal for å slette post */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>Delete this post?</Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.confirmDeleteButton}
                onPress={deletePost}
              >
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </Pressable>
              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal for å redigere post */}
      <Modal visible={editModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>Edit Post</Text>

            <TextInput
              style={styles.editInput}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Title"
            />
            <TextInput
              style={styles.editInput}
              value={editedDescription}
              onChangeText={setEditedDescription}
              placeholder="Description"
            />
            <TextInput
              style={styles.editInput}
              value={editedCategory}
              onChangeText={setEditedCategory}
              placeholder="Category"
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.confirmDeleteButton}
                onPress={updatePost}
              >
                <Text style={styles.buttonText}>Save changes</Text>
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={() => {
                  setEditModalVisible(false);
                  setSelectedPost(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 64,
    fontWeight: "bold",
  },
  postCard: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  postTitle: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 6,
  },
  postDescription: {
    fontSize: 16,
    marginBottom: 12,
  },
  commentAuthor: {
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    margin: 40,
    borderRadius: 16,
  },
  deleteButton: {
    backgroundColor: "#ffdddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },

  commentButton: {
    backgroundColor: "#ddddff",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },

  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  modalButtons: {
    marginTop: 20,
    gap: 10,
  },

  cancelButton: {
    backgroundColor: "#eeeeee",
    padding: 12,
    borderRadius: 8,
  },

  cancelButtonText: {
    textAlign: "center",
    fontWeight: "bold",
  },

  confirmDeleteButton: {
    backgroundColor: "#ffdddd",
    padding: 12,
    borderRadius: 8,
  },

  confirmDeleteText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#cc0000",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    marginBottom: 10,
    minHeight: 50,
    textAlignVertical: "top",
  },
  editButton: {
    backgroundColor: "#ddddff",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
});
