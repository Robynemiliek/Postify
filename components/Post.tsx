import { PostData } from "@/utils/postData";
import { Link } from "expo-router";
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type PostProps = {
  post: PostData;
  onDelete?: (post: PostData) => void;
  onEdit?: (post: PostData) => void;
  onRemoveFavorite?: (post: PostData) => void;
};

export default function Post({
  post,
  onDelete,
  onEdit,
  onRemoveFavorite,
}: PostProps) {
  const commentCount = post.comments?.length ?? 0;
  const likeCount = post.likes?.length ?? 0;
  const firstImage = post.imageUrls?.[0];

  return (
    <View style={styles.postCard}>
      <Link
        href={{
          pathname: "/postDetails/[id]",
          params: { id: post.id, title: post.title },
        }}
        asChild
      >
        <TouchableOpacity>
          <Text style={styles.postTitle}>{post.title}</Text>

          <Text style={styles.postDescription}>{post.description}</Text>

          {post.category && (
            <Text style={styles.postDescription}>
              Category: {post.category}
            </Text>
          )}
        </TouchableOpacity>
      </Link>
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.hashtags}>{post.hashtags}</Text>

          {likeCount > 0 && (
            <Text style={styles.likeCount}>❤️ {likeCount}</Text>
          )}

          {commentCount > 0 && (
            <Text style={styles.commentCount}>💬 {commentCount}</Text>
          )}

          {(post.imageUrls?.length ?? 0) > 1 && (
            <Text style={styles.imageCount}>🖼 {post.imageUrls!.length}</Text>
          )}
        </View>

        <Text style={styles.author}>{post.author}</Text>
      </View>

      {onDelete && (
        <Pressable style={styles.deleteButton} onPress={() => onDelete(post)}>
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable>
      )}

      {onEdit && (
        <Pressable style={styles.editButton} onPress={() => onEdit(post)}>
          <Text style={styles.buttonText}>Edit</Text>
        </Pressable>
      )}

      {onRemoveFavorite && (
        <Pressable
          style={styles.editButton}
          onPress={() => onRemoveFavorite(post)}
        >
          <Text style={styles.buttonText}>Remove favorite</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  deleteButton: {
    backgroundColor: "#ffdddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#ddddff",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hashtags: {
    fontSize: 12,
    color: "gray",
  },
  likeCount: {
    fontSize: 12,
    color: "#FF3B30",
  },
  commentCount: {
    fontSize: 12,
    color: "#007AFF",
  },
  imageCount: {
    fontSize: 12,
    color: "#555",
  },
  author: {
    fontSize: 12,
    color: "gray",
    textDecorationLine: "underline",
  },
});
