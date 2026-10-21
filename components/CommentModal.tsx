import { useEffect, useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type CommentModalProps = {
  visible: boolean;
  initialText?: string;
  onSave: (text: string) => void;
  onClose: () => void;
};

export default function CommentModal({
  visible,
  initialText,
  onSave,
  onClose,
}: CommentModalProps) {
  const [text, setText] = useState("");

  const isEditMode = initialText !== undefined;

  useEffect(() => {
    if (visible) {
      setText(initialText ?? "");
    }
  }, [visible, initialText]);

  const handleSave = () => {
    if (!text.trim()) return;

    onSave(text.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {isEditMode ? "Edit comment" : "Add comment"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={text}
            onChangeText={setText}
            multiline
          />

          <View style={styles.buttons}>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>
                {isEditMode ? "Save changes" : "Post comment"}
              </Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    margin: 30,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttons: {
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: "#ddddff",
    padding: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#eeeeee",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
});
