import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/api/commentApi";
import { useAuth } from "@/context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CommentObject } from "@/utils/commentData";

import { getPostById, toggleBookmark } from "@/api/postApi";
import CommentModal from "@/components/CommentModal";
import CommentsSection from "@/components/CommentsSection";
import { PostData } from "@/utils/postData";

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { user } = useAuth();

  const [post, setPost] = useState<PostData | null>(null);

  const currentUser = user?.uid ?? "";
  const currentUserName = user?.displayName ?? user?.email ?? "Unknown";

  const [comments, setComments] = useState<CommentObject[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentObject | null>(
    null,
  );

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      const fetchedPost = await getPostById(id);
      setPost(fetchedPost);

      setCommentsLoading(true);

      try {
        const fetchedComments = await getComments(fetchedPost?.comments ?? []);
        setComments(fetchedComments);
      } finally {
        setCommentsLoading(false);
      }
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

  const handleAddComment = () => {
    setSelectedComment(null);
    setCommentModalVisible(true);
  };

  const handleEditComment = (comment: CommentObject) => {
    setSelectedComment(comment);
    setCommentModalVisible(true);
  };

  const handleSaveComment = async (text: string) => {
    if (!post || !currentUser) return;

    if (selectedComment) {
      // Rediger eksisterende kommentar
      if (selectedComment.comment.authorId !== currentUser) return;

      await updateComment(selectedComment.id, text);

      setComments((prev) =>
        prev.map((item) =>
          item.id === selectedComment.id
            ? {
                ...item,
                comment: { ...item.comment, comment: text },
              }
            : item,
        ),
      );
    } else {
      // Opprett ny kommentar
      const commentData = {
        author: currentUserName,
        authorId: currentUser,
        comment: text,
      };

      const newId = await addComment(post.id, commentData);

      setComments((prev) => [...prev, { id: newId, comment: commentData }]);

      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments ?? []), newId],
            }
          : prev,
      );
    }

    setCommentModalVisible(false);
    setSelectedComment(null);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!post) return;

    const commentToDelete = comments.find((item) => item.id === commentId);

    if (!commentToDelete || commentToDelete.comment.authorId !== currentUser) {
      return;
    }

    await deleteComment(commentId, post.id);

    setComments((prev) => prev.filter((item) => item.id !== commentId));

    setPost((prev) =>
      prev
        ? {
            ...prev,
            comments: (prev.comments ?? []).filter((id) => id !== commentId),
          }
        : prev,
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
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
            {currentlyBookmarked ? "🔖 Remove bookmark" : "🔖 Add to bookmarks"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.commentsContainer}>
        <CommentsSection
          comments={comments}
          currentUser={currentUser}
          loading={commentsLoading}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
        />

        <Pressable
          style={styles.addCommentButton}
          onPress={handleAddComment}
          disabled={!currentUser}
        >
          <Text style={styles.addCommentButtonText}>+ Add comment</Text>
        </Pressable>
      </View>

      <CommentModal
        visible={commentModalVisible}
        initialText={selectedComment?.comment.comment}
        onSave={handleSaveComment}
        onClose={() => {
          setCommentModalVisible(false);
          setSelectedComment(null);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },

  commentsContainer: {
    marginTop: 20,
  },
  addCommentButton: {
    backgroundColor: "#ddddff",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  addCommentButtonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
