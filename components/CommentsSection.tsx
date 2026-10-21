import { CommentObject } from "@/utils/commentData";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type commentsSectionProps = {
  comments: CommentObject[];
  currentUser: string;
  loading: boolean;
  onEdit: (comment: CommentObject) => void;
  onDelete: (commentId: string) => void;
};

export default function CommentSection({
  comments,
  currentUser,
  loading,
  onEdit,
  onDelete,
}: commentsSectionProps) {
  if (loading) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments ({comments.length})</Text>

      {comments.length === 0 && (
        <Text style={styles.emptyText}>No comments yet</Text>
      )}

      {comments.map((item) => (
        <View key={item.id} style={styles.commentCard}>
          <Text style={styles.author}>{item.comment.authorId}</Text>
          <Text style={styles.commentText}>{item.comment.comment}</Text>

          {item.comment.authorId === currentUser && (
            <View style={styles.buttons}>
              <Pressable style={styles.editButton} onPress={() => onEdit(item)}>
                <Text>Edit</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => onDelete(item.id)}
              >
                <Text>Delete</Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyText: {
    color: "gray",
    marginBottom: 12,
  },
  commentCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  author: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#ddddff",
    padding: 8,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#ffdddd",
    padding: 8,
    borderRadius: 6,
  },
});
